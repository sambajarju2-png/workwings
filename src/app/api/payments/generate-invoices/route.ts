import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const SERVICE_FEE_PER_HOUR = 3.50;
const FAST_PAYOUT_FEE = 0.75;

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const supabase = createClient(url, key);
  const { shift_id } = await req.json();

  const { data: shift } = await supabase
    .from("shifts").select("*, locations(*)").eq("id", shift_id).single();
  if (!shift) return NextResponse.json({ error: "Shift not found" }, { status: 404 });

  const { data: checkIns } = await supabase
    .from("check_ins").select("*, workers(payout_preference, iban)")
    .eq("shift_id", shift_id).not("checked_out_at", "is", null);
  if (!checkIns?.length) return NextResponse.json({ error: "No completed check-ins" }, { status: 400 });

  const invoices = [];
  for (const ci of checkIns) {
    const hours = ci.total_hours || 0;
    const workerAmount = hours * shift.rate_per_hour;
    const fee = hours * SERVICE_FEE_PER_HOUR;
    const payoutType = ci.workers?.payout_preference || "normal";
    const fastFee = payoutType === "fast" ? FAST_PAYOUT_FEE * hours : 0;
    const netAmount = workerAmount - fastFee;
    const shiftDate = new Date(shift.date);
    const scheduledDate = payoutType === "fast"
      ? new Date(shiftDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      : null;

    const { data: invoice } = await supabase.from("invoices").insert({
      shift_id, worker_id: ci.worker_id, company_id: shift.company_id,
      amount: workerAmount + fee, fee, net_amount: netAmount,
      hours_worked: hours, rate_per_hour: shift.rate_per_hour,
      payout_type: payoutType, fast_payout_fee: fastFee,
      scheduled_payout_date: scheduledDate,
      company_payment_status: "unpaid",
      worker_payout_status: payoutType === "fast" ? "scheduled" : "pending",
    }).select().single();
    if (invoice) invoices.push(invoice);
  }

  return NextResponse.json({ invoices, count: invoices.length });
}
