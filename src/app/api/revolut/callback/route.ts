import { NextResponse } from "next/server";
import { SignJWT, importPKCS8 } from "jose";
import { createPrivateKey } from "crypto";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function parsePrivateKey(): string {
  let pem = process.env.REVOLUT_BUSINESS_PRIVATE_KEY || "";
  pem = pem.replace(/\\n/g, "\n");
  if (!pem.includes("-----BEGIN")) {
    pem = `-----BEGIN RSA PRIVATE KEY-----\n${pem}\n-----END RSA PRIVATE KEY-----`;
  }
  if (pem.includes("RSA PRIVATE KEY")) {
    const key = createPrivateKey({ key: pem, format: "pem" });
    pem = key.export({ type: "pkcs8", format: "pem" }) as string;
  }
  return pem;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.redirect(new URL("/admin?revolut=error&reason=no_code", req.url));

  const clientId = process.env.REVOLUT_CLIENT_ID!;
  const isProd = process.env.REVOLUT_ENVIRONMENT === "production";
  const authUrl = isProd ? "https://b2b.revolut.com" : "https://sandbox-b2b.revolut.com";

  // Sign JWT assertion
  const pkcs8Pem = parsePrivateKey();
  const privateKey = await importPKCS8(pkcs8Pem, "RS256");

  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuedAt()
    .setIssuer("workwings.vercel.app")
    .setSubject(clientId)
    .setAudience(authUrl)
    .setExpirationTime("2m")
    .sign(privateKey);

  // Exchange code for tokens
  const res = await fetch(`${authUrl}/api/1.0/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: jwt,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Revolut token exchange failed:", err);
    return NextResponse.redirect(new URL(`/admin?revolut=error&reason=token_exchange`, req.url));
  }

  const tokens = await res.json();

  // Store tokens in Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    await supabase.from("platform_settings").upsert({
      key: "revolut_tokens",
      value: JSON.stringify({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: Date.now() + (tokens.expires_in || 2400) * 1000,
        token_type: tokens.token_type,
      }),
      updated_at: new Date().toISOString(),
    }, { onConflict: "key" });
  }

  return NextResponse.redirect(new URL("/admin?revolut=connected", req.url));
}
