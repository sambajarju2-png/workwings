import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const supabase = createClient(url, key);
  const { shift_id, worker_id, action, lat, lng } = await req.json();

  if (action === "checkin") {
    const { data, error } = await supabase.from("check_ins").insert({
      shift_id, worker_id,
      checked_in_at: new Date().toISOString(),
      check_in_lat: lat, check_in_lng: lng,
    }).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, check_in_id: data.id });
  }

  if (action === "checkout") {
    const { data: existing } = await supabase.from("check_ins")
      .select("*").eq("shift_id", shift_id).eq("worker_id", worker_id)
      .is("checked_out_at", null).single();

    if (!existing) return NextResponse.json({ error: "No active check-in" }, { status: 400 });

    const checkedIn = new Date(existing.checked_in_at);
    const now = new Date();
    const totalHours = (now.getTime() - checkedIn.getTime()) / (1000 * 60 * 60);

    await supabase.from("check_ins").update({
      checked_out_at: now.toISOString(),
      check_out_lat: lat, check_out_lng: lng,
      total_hours: Math.round(totalHours * 100) / 100,
    }).eq("id", existing.id);

    // Update 660-hour tracking
    const { data: shift } = await supabase.from("shifts").select("company_id").eq("id", shift_id).single();
    if (shift) {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "https://workwings.vercel.app"}/api/compliance/check-660`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ worker_id, company_id: shift.company_id, hours_to_add: totalHours }),
      });
    }

    return NextResponse.json({ success: true, total_hours: Math.round(totalHours * 100) / 100 });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
