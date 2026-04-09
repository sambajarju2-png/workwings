import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const supabase = createClient(url, key);
  const today = new Date().toISOString().split("T")[0];

  const { data: due } = await supabase.from("invoices")
    .select("id, net_amount, worker_id").eq("payout_type", "fast")
    .eq("worker_payout_status", "scheduled").lte("scheduled_payout_date", today);

  if (!due?.length) return NextResponse.json({ message: "No fast payouts due", count: 0 });

  const results = [];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workwings.vercel.app";
  for (const inv of due) {
    try {
      const res = await fetch(`${baseUrl}/api/payments/payout-worker`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice_id: inv.id }),
      });
      results.push({ invoice_id: inv.id, ...(await res.json()) });
    } catch (err) {
      results.push({ invoice_id: inv.id, error: String(err) });
    }
  }

  return NextResponse.json({ processed: due.length, date: today, results });
}
