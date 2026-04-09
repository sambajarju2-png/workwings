import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const body = await req.json();
  if (body.event !== "ORDER_COMPLETED" && body.order?.state !== "COMPLETED") return NextResponse.json({ received: true });

  const supabase = createClient(url, key);
  const order = body.order || body;
  const meta = order.metadata || {};
  const invoiceIds = meta.invoice_ids ? meta.invoice_ids.split(",") : [];
  if (!meta.company_id || !invoiceIds.length) return NextResponse.json({ received: true });

  const { data: payment } = await supabase.from("company_payments").insert({
    company_id: meta.company_id, total_amount: order.amount ? order.amount / 100 : 0,
    payment_method: "revolut_merchant", revolut_transaction_id: order.id,
    status: "received", received_at: new Date().toISOString(),
  }).select().single();

  if (payment) {
    const { data: invs } = await supabase.from("invoices").select("id, amount").in("id", invoiceIds);
    if (invs) await supabase.from("company_payment_invoices").insert(invs.map(i => ({ company_payment_id: payment.id, invoice_id: i.id, allocated_amount: i.amount })));
    await supabase.from("invoices").update({ company_payment_status: "paid" }).in("id", invoiceIds);
    await supabase.from("invoices").update({ worker_payout_status: "scheduled" }).in("id", invoiceIds).eq("payout_type", "normal").eq("worker_payout_status", "pending");
  }

  return NextResponse.json({ received: true, payment_id: payment?.id });
}
