/**
 * Revolut Business API Client — JWT Certificate Auth
 * Docs: https://developer.revolut.com/docs/business/business-api
 */

import { SignJWT, importPKCS8 } from "jose";

const PRODUCTION_URL = "https://b2b.revolut.com/api/1.0";
const SANDBOX_URL = "https://sandbox-b2b.revolut.com/api/1.0";
const PRODUCTION_AUTH_URL = "https://b2b.revolut.com";
const SANDBOX_AUTH_URL = "https://sandbox-b2b.revolut.com";

function getBaseUrl() {
  return process.env.REVOLUT_ENVIRONMENT === "production" ? PRODUCTION_URL : SANDBOX_URL;
}
function getAuthUrl() {
  return process.env.REVOLUT_ENVIRONMENT === "production" ? PRODUCTION_AUTH_URL : SANDBOX_AUTH_URL;
}
function isConfigured() {
  return !!(process.env.REVOLUT_CLIENT_ID && process.env.REVOLUT_BUSINESS_PRIVATE_KEY);
}

// ============================================
// JWT + OAuth2 Token Management
// ============================================

let cachedToken: { access_token: string; expires_at: number } | null = null;

async function signJWT(): Promise<string> {
  const privateKeyPem = process.env.REVOLUT_BUSINESS_PRIVATE_KEY!;
  const clientId = process.env.REVOLUT_CLIENT_ID!;
  const authUrl = getAuthUrl();

  const privateKey = await importPKCS8(privateKeyPem, "RS256");

  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuedAt()
    .setIssuer(authUrl.includes("sandbox") ? "revolut-sandbox" : clientId)
    .setSubject(clientId)
    .setAudience(`${authUrl}`)
    .setExpirationTime("2m")
    .sign(privateKey);

  return jwt;
}

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && cachedToken.expires_at > Date.now() + 60000) {
    return cachedToken.access_token;
  }

  const clientId = process.env.REVOLUT_CLIENT_ID!;
  const jwt = await signJWT();
  const authUrl = getAuthUrl();

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
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// ============================================
// COUNTERPARTIES (Worker bank accounts)
// ============================================

export async function createCounterparty(input: {
  name: string; iban: string; bic?: string; email?: string; phone?: string;
}) {
  if (!isConfigured()) return { success: false as const, error: "Revolut not configured" };

  try {
    const res = await fetch(`${getBaseUrl()}/counterparty`, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({
        company_name: input.name,
        bank_country: "NL",
        currency: "EUR",
        iban: input.iban,
        bic: input.bic,
        email: input.email,
        phone: input.phone,
      }),
    });

    if (!res.ok) return { success: false as const, error: await res.text() };
    const data = await res.json();
    return { success: true as const, counterparty_id: data.id as string, data };
  } catch (err) {
    return { success: false as const, error: String(err) };
  }
}

export async function getCounterparties() {
  if (!isConfigured()) return { success: false as const, error: "Revolut not configured" };
  try {
    const res = await fetch(`${getBaseUrl()}/counterparties`, { headers: await authHeaders() });
    if (!res.ok) return { success: false as const, error: await res.text() };
    return { success: true as const, data: await res.json() };
  } catch (err) {
    return { success: false as const, error: String(err) };
  }
}

// ============================================
// PAYMENTS (SEPA payouts to workers)
// ============================================

export async function createPayment(input: {
  counterparty_id: string; account_id: string; amount: number;
  currency?: string; reference: string; request_id: string;
}) {
  if (!isConfigured()) return { success: false as const, error: "Revolut not configured" };

  try {
    const res = await fetch(`${getBaseUrl()}/pay`, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({
        request_id: input.request_id,
        account_id: input.account_id,
        receiver: { counterparty_id: input.counterparty_id },
        amount: input.amount,
        currency: input.currency || "EUR",
        reference: input.reference,
      }),
    });

    if (!res.ok) return { success: false as const, error: await res.text() };
    const data = await res.json();
    return { success: true as const, payment_id: data.id as string, status: data.state as string, data };
  } catch (err) {
    return { success: false as const, error: String(err) };
  }
}

export async function getPayment(paymentId: string) {
  if (!isConfigured()) return { success: false as const, error: "Revolut not configured" };
  try {
    const res = await fetch(`${getBaseUrl()}/transaction/${paymentId}`, { headers: await authHeaders() });
    if (!res.ok) return { success: false as const, error: await res.text() };
    return { success: true as const, data: await res.json() };
  } catch (err) {
    return { success: false as const, error: String(err) };
  }
}

// ============================================
// ACCOUNTS (Revolut balances)
// ============================================

export async function getAccounts() {
  if (!isConfigured()) return { success: false as const, error: "Revolut not configured" };
  try {
    const res = await fetch(`${getBaseUrl()}/accounts`, { headers: await authHeaders() });
    if (!res.ok) return { success: false as const, error: await res.text() };
    return { success: true as const, data: await res.json() };
  } catch (err) {
    return { success: false as const, error: String(err) };
  }
}

// ============================================
// BATCH PAYMENTS
// ============================================

export async function createBatchPayment(accountId: string, payments: {
  counterparty_id: string; amount: number; reference: string; request_id: string;
}[]) {
  if (!isConfigured()) return { success: false as const, error: "Revolut not configured" };

  const results = await Promise.allSettled(
    payments.map(p => createPayment({
      counterparty_id: p.counterparty_id, account_id: accountId,
      amount: p.amount, reference: p.reference, request_id: p.request_id,
    }))
  );

  return {
    success: true as const,
    results: results.map((r, i) => ({
      reference: payments[i].reference,
      result: r.status === "fulfilled" ? r.value : { success: false as const, error: String(r.reason) },
    })),
  };
}

export const revolutClient = {
  isConfigured, getAccessToken, createCounterparty, getCounterparties,
  createPayment, getPayment, getAccounts, createBatchPayment,
};
