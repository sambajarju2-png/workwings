import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { revolutClient } from "@/lib/revolut";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const supabase = createClient(url, key);
  const { invoice_id } = await req.json();

  const { data: invoice } = await supabase.from("invoices")
    .select("*, workers(id, first_name, last_name, iban, phone)").eq("id", invoice_id).single();

  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  if (invoice.worker_payout_status === "paid") return NextResponse.json({ error: "Already paid" }, { status: 400 });

  const worker = invoice.workers;
  if (!worker?.iban) return NextResponse.json({ error: "Worker has no IBAN" }, { status: 400 });

  if (!revolutClient.isConfigured()) {
    await supabase.from("payouts").insert({
      worker_id: worker.id, invoice_id: invoice.id, amount: invoice.net_amount,
      method: "simulated", payout_type: invoice.payout_type,
      worker_iban: worker.iban, status: "completed", executed_at: new Date().toISOString(),
    });
    await supabase.from("invoices").update({ worker_payout_status: "paid", paid_at: new Date().toISOString() }).eq("id", invoice_id);
    return NextResponse.json({ success: true, simulated: true, amount: invoice.net_amount });
  }

  const counterparty = await revolutClient.createCounterparty({
    name: `${worker.first_name} ${worker.last_name}`, iban: worker.iban,
  });
  if (!counterparty.success) return NextResponse.json({ error: counterparty.error }, { status: 500 });

  const accounts = await revolutClient.getAccounts();
  const eurAccount = accounts.data?.find((a: { currency: string }) => a.currency === "EUR");
  if (!eurAccount) return NextResponse.json({ error: "No EUR account" }, { status: 500 });

  const reference = `WW-${invoice.id.slice(0, 8).toUpperCase()}`;
  const payment = await revolutClient.createPayment({
    counterparty_id: counterparty.counterparty_id!, account_id: eurAccount.id,
    amount: invoice.net_amount, reference, request_id: invoice.id,
  });

  if (!payment.success) return NextResponse.json({ error: payment.error }, { status: 500 });

  await supabase.from("payouts").insert({
    worker_id: worker.id, invoice_id: invoice.id, amount: invoice.net_amount,
    method: "revolut", payout_type: invoice.payout_type,
    revolut_payment_id: payment.payment_id, worker_iban: worker.iban,
    status: "processing", scheduled_for: invoice.scheduled_payout_date,
  });
  await supabase.from("invoices").update({ worker_payout_status: "paid", paid_at: new Date().toISOString() }).eq("id", invoice_id);

  return NextResponse.json({ success: true, revolut_payment_id: payment.payment_id, amount: invoice.net_amount, reference });
}
