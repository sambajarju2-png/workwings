import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const merchantKey = process.env.REVOLUT_MERCHANT_SECRET_KEY;
  if (!url || !key || !merchantKey) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const supabase = createClient(url, key);
  const { company_id, invoice_ids } = await req.json();

  const { data: invoices } = await supabase.from("invoices").select("id, amount").in("id", invoice_ids).eq("company_payment_status", "unpaid");
  if (!invoices?.length) return NextResponse.json({ error: "No unpaid invoices" }, { status: 400 });

  const totalCents = Math.round(invoices.reduce((sum, i) => sum + Number(i.amount), 0) * 100);
  const { data: company } = await supabase.from("companies").select("name").eq("id", company_id).single();

  const isProd = process.env.REVOLUT_ENVIRONMENT === "production";
  const merchantUrl = isProd ? "https://merchant.revolut.com/api/orders" : "https://sandbox-merchant.revolut.com/api/orders";

  const orderRes = await fetch(merchantUrl, {
    method: "POST",
    headers: { "Authorization": `Bearer ${merchantKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: totalCents, currency: "EUR",
      description: `WorkWings — ${company?.name || "Bedrijf"} — ${invoice_ids.length} facturen`,
      merchant_order_ext_ref: `WW-CP-${Date.now()}`,
      settlement_currency: "EUR",
      metadata: { company_id, invoice_ids: invoice_ids.join(",") },
    }),
  });

  if (!orderRes.ok) return NextResponse.json({ error: await orderRes.text() }, { status: 500 });
  const order = await orderRes.json();
  return NextResponse.json({ order_id: order.id, checkout_url: order.checkout_url, amount: totalCents / 100, invoice_count: invoice_ids.length });
}
