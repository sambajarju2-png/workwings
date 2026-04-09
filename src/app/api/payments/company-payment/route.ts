import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const supabase = createClient(url, key);
  const { company_id, invoice_ids, total_amount, payment_method, bank_reference } = await req.json();

  const { data: payment, error: paymentErr } = await supabase.from("company_payments").insert({
    company_id, total_amount, payment_method: payment_method || "bank_transfer",
    bank_reference, status: "received", received_at: new Date().toISOString(),
  }).select().single();

  if (paymentErr || !payment) return NextResponse.json({ error: paymentErr?.message }, { status: 500 });

  const { data: invoices } = await supabase.from("invoices").select("id, amount").in("id", invoice_ids);
  const links = (invoices || []).map(inv => ({
    company_payment_id: payment.id, invoice_id: inv.id, allocated_amount: inv.amount,
  }));

  await supabase.from("company_payment_invoices").insert(links);
  await supabase.from("invoices").update({ company_payment_status: "paid" }).in("id", invoice_ids);
  await supabase.from("invoices").update({ worker_payout_status: "scheduled" })
    .in("id", invoice_ids).eq("payout_type", "normal").eq("worker_payout_status", "pending");

  return NextResponse.json({ payment_id: payment.id, invoices_linked: invoice_ids.length });
}
