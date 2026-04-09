import { NextResponse } from "next/server";
import { SignJWT, importPKCS8 } from "jose";
import { createPrivateKey } from "crypto";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function parsePrivateKey(): string {
  let pem = process.env.REVOLUT_BUSINESS_PRIVATE_KEY || "";
  pem = pem.replace(/\\n/g, "\n");
  if (!pem.includes("-----BEGIN")) pem = `-----BEGIN RSA PRIVATE KEY-----\n${pem}\n-----END RSA PRIVATE KEY-----`;
  if (pem.includes("RSA PRIVATE KEY")) {
    const key = createPrivateKey({ key: pem, format: "pem" });
    pem = key.export({ type: "pkcs8", format: "pem" }) as string;
  }
  return pem;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    const error = searchParams.get("error") || "no_code";
    return NextResponse.json({ error, params: Object.fromEntries(searchParams) });
  }

  const clientId = process.env.REVOLUT_CLIENT_ID!;
  const authUrl = process.env.REVOLUT_ENVIRONMENT === "production"
    ? "https://b2b.revolut.com" : "https://sandbox-b2b.revolut.com";

  try {
    const pkcs8Pem = parsePrivateKey();
    const privateKey = await importPKCS8(pkcs8Pem, "RS256");

    const jwt = await new SignJWT({})
      .setProtectedHeader({ alg: "RS256", typ: "JWT" })
      .setIssuedAt()
      .setIssuer("workwings.vercel.app")
      .setSubject(clientId)
      .setAudience("https://revolut.com")
      .setExpirationTime("2m")
      .sign(privateKey);

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

    const responseText = await res.text();

    if (!res.ok) {
      // Return the actual error so we can debug
      return NextResponse.json({
        error: "token_exchange_failed",
        status: res.status,
        revolut_response: responseText,
        auth_url: authUrl,
        client_id: clientId,
      });
    }

    const tokens = JSON.parse(responseText);

    // Store tokens in Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error: dbError } = await supabase.from("platform_settings").upsert({
        key: "revolut_tokens",
        value: JSON.stringify({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: Date.now() + (tokens.expires_in || 2400) * 1000,
        }),
        updated_at: new Date().toISOString(),
      }, { onConflict: "key" });

      if (dbError) {
        return NextResponse.json({ error: "db_save_failed", db_error: dbError.message, tokens_received: true });
      }
    } else {
      return NextResponse.json({ error: "no_supabase_service_key", tokens_received: true });
    }

    return NextResponse.redirect(new URL("/admin?revolut=connected", req.url));

  } catch (err) {
    return NextResponse.json({ error: "exception", message: String(err) });
  }
}
