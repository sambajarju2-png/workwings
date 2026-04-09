import { SignJWT, importPKCS8 } from "jose";
import { createPrivateKey } from "crypto";

const PRODUCTION_URL = "https://b2b.revolut.com/api/1.0";
const SANDBOX_URL = "https://sandbox-b2b.revolut.com/api/1.0";
const PRODUCTION_AUTH = "https://b2b.revolut.com";
const SANDBOX_AUTH = "https://sandbox-b2b.revolut.com";

function getBaseUrl() { return process.env.REVOLUT_ENVIRONMENT === "production" ? PRODUCTION_URL : SANDBOX_URL; }
function getAuthUrl() { return process.env.REVOLUT_ENVIRONMENT === "production" ? PRODUCTION_AUTH : SANDBOX_AUTH; }
function isConfigured() { return !!(process.env.REVOLUT_CLIENT_ID && process.env.REVOLUT_BUSINESS_PRIVATE_KEY); }

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

async function signJWT(): Promise<string> {
  const clientId = process.env.REVOLUT_CLIENT_ID!;
  const authUrl = getAuthUrl();
  const pkcs8 = parsePrivateKey();
  const privateKey = await importPKCS8(pkcs8, "RS256");
  return new SignJWT({})
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuedAt().setIssuer("workwings.vercel.app").setSubject(clientId)
    .setAudience(authUrl).setExpirationTime("2m")
    .sign(privateKey);
}

// Get stored tokens from Supabase
async function getStoredTokens() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, key);
  const { data } = await supabase.from("platform_settings").select("value").eq("key", "revolut_tokens").single();
  if (!data?.value) return null;
  return JSON.parse(data.value);
}

async function saveTokens(tokens: { access_token: string; refresh_token: string; expires_at: number }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, key);
  await supabase.from("platform_settings").upsert({
    key: "revolut_tokens",
    value: JSON.stringify(tokens),
    updated_at: new Date().toISOString(),
  }, { onConflict: "key" });
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const clientId = process.env.REVOLUT_CLIENT_ID!;
  const authUrl = getAuthUrl();
  const jwt = await signJWT();

  const res = await fetch(`${authUrl}/api/1.0/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: jwt,
    }),
  });

  if (!res.ok) throw new Error(`Refresh failed: ${res.status} ${await res.text()}`);

  const data = await res.json();
  const tokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token || refreshToken,
    expires_at: Date.now() + (data.expires_in || 2400) * 1000,
  };
  await saveTokens(tokens);
  return tokens.access_token;
}

async function getAccessToken(): Promise<string> {
  const stored = await getStoredTokens();
  if (!stored) throw new Error("No Revolut tokens. Visit /api/revolut/authorize to connect.");

  // Token still valid
  if (stored.expires_at > Date.now() + 60000) return stored.access_token;

  // Refresh it
  if (stored.refresh_token) return refreshAccessToken(stored.refresh_token);

  throw new Error("Token expired and no refresh token. Reconnect at /api/revolut/authorize");
}

async function authHeaders() {
  const token = await getAccessToken();
  return { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };
}

// API Methods
export async function createCounterparty(input: { name: string; iban: string }) {
  if (!isConfigured()) return { success: false as const, error: "Not configured" };
  try {
    const res = await fetch(`${getBaseUrl()}/counterparty`, { method: "POST", headers: await authHeaders(), body: JSON.stringify({ company_name: input.name, bank_country: "NL", currency: "EUR", iban: input.iban }) });
    if (!res.ok) return { success: false as const, error: await res.text() };
    const data = await res.json();
    return { success: true as const, counterparty_id: data.id as string, data };
  } catch (err) { return { success: false as const, error: String(err) }; }
}

export async function getCounterparties() {
  if (!isConfigured()) return { success: false as const, error: "Not configured" };
  try { const res = await fetch(`${getBaseUrl()}/counterparties`, { headers: await authHeaders() }); if (!res.ok) return { success: false as const, error: await res.text() }; return { success: true as const, data: await res.json() }; } catch (err) { return { success: false as const, error: String(err) }; }
}

export async function createPayment(input: { counterparty_id: string; account_id: string; amount: number; currency?: string; reference: string; request_id: string }) {
  if (!isConfigured()) return { success: false as const, error: "Not configured" };
  try {
    const res = await fetch(`${getBaseUrl()}/pay`, { method: "POST", headers: await authHeaders(), body: JSON.stringify({ request_id: input.request_id, account_id: input.account_id, receiver: { counterparty_id: input.counterparty_id }, amount: input.amount, currency: input.currency || "EUR", reference: input.reference }) });
    if (!res.ok) return { success: false as const, error: await res.text() };
    const data = await res.json();
    return { success: true as const, payment_id: data.id as string, status: data.state as string, data };
  } catch (err) { return { success: false as const, error: String(err) }; }
}

export async function getAccounts() {
  if (!isConfigured()) return { success: false as const, error: "Not configured" };
  try { const res = await fetch(`${getBaseUrl()}/accounts`, { headers: await authHeaders() }); if (!res.ok) return { success: false as const, error: await res.text() }; return { success: true as const, data: await res.json() }; } catch (err) { return { success: false as const, error: String(err) }; }
}

export const revolutClient = { isConfigured, getAccessToken, createCounterparty, getCounterparties, createPayment, getAccounts };
