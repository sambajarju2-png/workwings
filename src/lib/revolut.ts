/**
 * Revolut Business API Client
 * Docs: https://developer.revolut.com/docs/business/business-api
 * 
 * Samba: Add these env vars when you have them:
 * - REVOLUT_API_KEY (from Revolut Business > Settings > API)
 * - REVOLUT_ENVIRONMENT ('sandbox' | 'production')
 */

const REVOLUT_SANDBOX_URL = "https://sandbox-b2b.revolut.com/api/1.0";
const REVOLUT_PRODUCTION_URL = "https://b2b.revolut.com/api/1.0";

function getBaseUrl() {
  return process.env.REVOLUT_ENVIRONMENT === "production"
    ? REVOLUT_PRODUCTION_URL
    : REVOLUT_SANDBOX_URL;
}

function getHeaders() {
  return {
    "Authorization": `Bearer ${process.env.REVOLUT_API_KEY}`,
    "Content-Type": "application/json",
  };
}

function isConfigured() {
  return !!process.env.REVOLUT_API_KEY;
}

// ============================================
// COUNTERPARTIES (Worker bank accounts)
// ============================================

interface CreateCounterpartyInput {
  name: string;
  iban: string;
  bic?: string;
  email?: string;
  phone?: string;
}

export async function createCounterparty(input: CreateCounterpartyInput) {
  if (!isConfigured()) return { success: false, error: "Revolut not configured" };

  const res = await fetch(`${getBaseUrl()}/counterparty`, {
    method: "POST",
    headers: getHeaders(),
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

  if (!res.ok) {
    const err = await res.text();
    return { success: false, error: err };
  }

  const data = await res.json();
  return { success: true, counterparty_id: data.id, data };
}

export async function getCounterparties() {
  if (!isConfigured()) return { success: false, error: "Revolut not configured" };

  const res = await fetch(`${getBaseUrl()}/counterparties`, { headers: getHeaders() });
  if (!res.ok) return { success: false, error: await res.text() };
  return { success: true, data: await res.json() };
}

// ============================================
// PAYMENTS (Payouts to workers)
// ============================================

interface CreatePaymentInput {
  counterparty_id: string;
  account_id: string; // Revolut account to pay from
  amount: number; // in EUR
  currency?: string;
  reference: string; // e.g. "WW-INV-2026-0042"
  request_id: string; // idempotency key (use invoice ID)
}

export async function createPayment(input: CreatePaymentInput) {
  if (!isConfigured()) return { success: false, error: "Revolut not configured" };

  const res = await fetch(`${getBaseUrl()}/pay`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      request_id: input.request_id,
      account_id: input.account_id,
      receiver: {
        counterparty_id: input.counterparty_id,
      },
      amount: input.amount,
      currency: input.currency || "EUR",
      reference: input.reference,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { success: false, error: err };
  }

  const data = await res.json();
  return { success: true, payment_id: data.id, status: data.state, data };
}

export async function getPayment(paymentId: string) {
  if (!isConfigured()) return { success: false, error: "Revolut not configured" };

  const res = await fetch(`${getBaseUrl()}/transaction/${paymentId}`, { headers: getHeaders() });
  if (!res.ok) return { success: false, error: await res.text() };
  return { success: true, data: await res.json() };
}

// ============================================
// ACCOUNTS (Get your Revolut balances)
// ============================================

export async function getAccounts() {
  if (!isConfigured()) return { success: false, error: "Revolut not configured" };

  const res = await fetch(`${getBaseUrl()}/accounts`, { headers: getHeaders() });
  if (!res.ok) return { success: false, error: await res.text() };
  return { success: true, data: await res.json() };
}

// ============================================
// BATCH PAYMENTS (Pay multiple workers at once)
// ============================================

interface BatchPaymentItem {
  counterparty_id: string;
  amount: number;
  reference: string;
  request_id: string;
}

export async function createBatchPayment(accountId: string, payments: BatchPaymentItem[]) {
  if (!isConfigured()) return { success: false, error: "Revolut not configured" };

  // Revolut doesn't have a native batch endpoint — we fire multiple payments
  const results = await Promise.allSettled(
    payments.map(p => createPayment({
      counterparty_id: p.counterparty_id,
      account_id: accountId,
      amount: p.amount,
      reference: p.reference,
      request_id: p.request_id,
    }))
  );

  return {
    success: true,
    results: results.map((r, i) => ({
      reference: payments[i].reference,
      status: r.status === "fulfilled" ? r.value : { success: false, error: String(r.reason) },
    })),
  };
}

export const revolutClient = {
  isConfigured,
  createCounterparty,
  getCounterparties,
  createPayment,
  getPayment,
  getAccounts,
  createBatchPayment,
};
