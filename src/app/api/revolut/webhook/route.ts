import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ received: true });

  const body = await req.json();
  const supabase = createClient(url, key);

  // Log webhook event
  console.log("Revolut webhook:", JSON.stringify(body));

  const event = body.event;
  const data = body.data || body;

  // Handle transaction state changes (payout status updates)
  if (event === "TransactionStateChanged" && data.id) {
    const { data: payout } = await supabase.from("payouts")
      .select("id, invoice_id")
      .eq("revolut_payment_id", data.id)
      .single();

    if (payout) {
      const newStatus = data.state === "completed" ? "completed" : data.state === "failed" || data.state === "reverted" ? "failed" : "processing";
      await supabase.from("payouts").update({ status: newStatus, executed_at: new Date().toISOString() }).eq("id", payout.id);

      if (newStatus === "completed") {
        await supabase.from("invoices").update({ worker_payout_status: "paid", paid_at: new Date().toISOString() }).eq("id", payout.invoice_id);
      } else if (newStatus === "failed") {
        await supabase.from("invoices").update({ worker_payout_status: "failed" }).eq("id", payout.invoice_id);
      }
    }
  }

  return NextResponse.json({ received: true });
}
