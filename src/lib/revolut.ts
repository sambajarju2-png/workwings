/**
 * Revolut Business API Client — JWT Certificate Auth
 */

import { SignJWT, importPKCS8 } from "jose";
import { createPrivateKey } from "crypto";

const PRODUCTION_URL = "https://b2b.revolut.com/api/1.0";
const SANDBOX_URL = "https://sandbox-b2b.revolut.com/api/1.0";
const PRODUCTION_AUTH = "https://b2b.revolut.com";
const SANDBOX_AUTH = "https://sandbox-b2b.revolut.com";

function getBaseUrl() {
  return process.env.REVOLUT_ENVIRONMENT === "production" ? PRODUCTION_URL : SANDBOX_URL;
}
function getAuthUrl() {
  return process.env.REVOLUT_ENVIRONMENT === "production" ? PRODUCTION_AUTH : SANDBOX_AUTH;
}
function isConfigured() {
  return !!(process.env.REVOLUT_CLIENT_ID && process.env.REVOLUT_BUSINESS_PRIVATE_KEY);
}

/**
 * Parse PEM private key — handles:
 * - Newlines stripped by Vercel (base64 on one line)
 * - PKCS#1 format (BEGIN RSA PRIVATE KEY) → converts to PKCS#8
 * - PKCS#8 format (BEGIN PRIVATE KEY) → uses directly
 */
function parsePrivateKey(): string {
  let pem = process.env.REVOLUT_BUSINESS_PRIVATE_KEY || "";

  // Fix escaped newlines from env vars
  pem = pem.replace(/\\n/g, "\n");

  // If it doesn't have proper PEM headers, try to reconstruct
  if (!pem.includes("-----BEGIN")) {
    // Raw base64 — wrap in PKCS#1 headers
    pem = `-----BEGIN RSA PRIVATE KEY-----\n${pem}\n-----END RSA PRIVATE KEY-----`;
  }

  // Convert PKCS#1 (RSA PRIVATE KEY) to PKCS#8 (PRIVATE KEY) using Node crypto
  if (pem.includes("RSA PRIVATE KEY")) {
    const key = createPrivateKey({ key: pem, format: "pem" });
    pem = key.export({ type: "pkcs8", format: "pem" }) as string;
  }

  return pem;
}

// ============================================
// JWT + OAuth2 Token Management
// ============================================

let cachedToken: { access_token: string; expires_at: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expires_at > Date.now() + 60000) {
    return cachedToken.access_token;
  }

  const clientId = process.env.REVOLUT_CLIENT_ID!;
  const authUrl = getAuthUrl();
  const pkcs8Pem = parsePrivateKey();
  const privateKey = await importPKCS8(pkcs8Pem, "RS256");

  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuedAt()
    .setIssuer(clientId)
    .setSubject(clientId)
    .setAudience(authUrl)
    .setExpirationTime("2m")
    .sign(privateKey);

  const res = await fetch(`${authUrl}/api/1.0/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: jwt,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Revolut auth failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in || 2400) * 1000,
  };

  return cachedToken.access_token;
}

async function authHeaders() {
  const token = await getAccessToken();
  return { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };
}

// ============================================
// API Methods
// ============================================

export async function createCounterparty(input: {
  name: string; iban: string; bic?: string; email?: string; phone?: string;
}) {
  if (!isConfigured()) return { success: false as const, error: "Not configured" };
  try {
    const res = await fetch(`${getBaseUrl()}/counterparty`, {
      method: "POST", headers: await authHeaders(),
      body: JSON.stringify({ company_name: input.name, bank_country: "NL", currency: "EUR", iban: input.iban }),
    });
    if (!res.ok) return { success: false as const, error: await res.text() };
    const data = await res.json();
    return { success: true as const, counterparty_id: data.id as string, data };
  } catch (err) { return { success: false as const, error: String(err) }; }
}

export async function getCounterparties() {
  if (!isConfigured()) return { success: false as const, error: "Not configured" };
  try {
    const res = await fetch(`${getBaseUrl()}/counterparties`, { headers: await authHeaders() });
    if (!res.ok) return { success: false as const, error: await res.text() };
    return { success: true as const, data: await res.json() };
  } catch (err) { return { success: false as const, error: String(err) }; }
}

export async function createPayment(input: {
  counterparty_id: string; account_id: string; amount: number;
  currency?: string; reference: string; request_id: string;
}) {
  if (!isConfigured()) return { success: false as const, error: "Not configured" };
  try {
    const res = await fetch(`${getBaseUrl()}/pay`, {
      method: "POST", headers: await authHeaders(),
      body: JSON.stringify({
        request_id: input.request_id, account_id: input.account_id,
        receiver: { counterparty_id: input.counterparty_id },
        amount: input.amount, currency: input.currency || "EUR", reference: input.reference,
      }),
    });
    if (!res.ok) return { success: false as const, error: await res.text() };
    const data = await res.json();
    return { success: true as const, payment_id: data.id as string, status: data.state as string, data };
  } catch (err) { return { success: false as const, error: String(err) }; }
}

export async function getPayment(paymentId: string) {
  if (!isConfigured()) return { success: false as const, error: "Not configured" };
  try {
    const res = await fetch(`${getBaseUrl()}/transaction/${paymentId}`, { headers: await authHeaders() });
    if (!res.ok) return { success: false as const, error: await res.text() };
    return { success: true as const, data: await res.json() };
  } catch (err) { return { success: false as const, error: String(err) }; }
}

export async function getAccounts() {
  if (!isConfigured()) return { success: false as const, error: "Not configured" };
  try {
    const res = await fetch(`${getBaseUrl()}/accounts`, { headers: await authHeaders() });
    if (!res.ok) return { success: false as const, error: await res.text() };
    return { success: true as const, data: await res.json() };
  } catch (err) { return { success: false as const, error: String(err) }; }
}

export async function createBatchPayment(accountId: string, payments: {
  counterparty_id: string; amount: number; reference: string; request_id: string;
}[]) {
  if (!isConfigured()) return { success: false as const, error: "Not configured" };
  const results = await Promise.allSettled(
    payments.map(p => createPayment({ counterparty_id: p.counterparty_id, account_id: accountId, amount: p.amount, reference: p.reference, request_id: p.request_id }))
  );
  return { success: true as const, results: results.map((r, i) => ({ reference: payments[i].reference, result: r.status === "fulfilled" ? r.value : { success: false as const, error: String(r.reason) } })) };
}

export const revolutClient = { isConfigured, getAccessToken, createCounterparty, getCounterparties, createPayment, getPayment, getAccounts, createBatchPayment };
