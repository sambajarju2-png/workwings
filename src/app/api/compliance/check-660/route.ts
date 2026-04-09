import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const supabase = createClient(url, key);
  const { worker_id, company_id, hours_to_add } = await req.json();

  let { data: track } = await supabase.from("hour_tracking").select("*").eq("worker_id", worker_id).eq("company_id", company_id).single();
  if (!track) {
    const { data: t } = await supabase.from("hour_tracking").insert({ worker_id, company_id }).select().single();
    track = t;
  }
  if (!track) return NextResponse.json({ error: "Failed" }, { status: 500 });

  const newTotal = Number(track.total_hours) + (hours_to_add || 0);
  const blocked = newTotal >= 660;
  const warning = newTotal >= 580 && !blocked;

  if (hours_to_add) {
    await supabase.from("hour_tracking").update({
      total_hours: newTotal, shift_count: track.shift_count + 1,
      last_shift_date: new Date().toISOString().split("T")[0],
      warning_sent: warning || blocked, blocked, updated_at: new Date().toISOString(),
    }).eq("id", track.id);
  }

  return NextResponse.json({
    total_hours: newTotal, remaining_hours: Math.max(0, 660 - newTotal),
    warning, blocked,
    message: blocked ? `660-uur limiet bereikt` : warning ? `Nog ${Math.round(660 - newTotal)} uur over` : `${Math.round(newTotal)}/660 uur`,
  });
}

export async function GET(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const { searchParams } = new URL(req.url);
  const workerId = searchParams.get("worker_id");
  if (!workerId) return NextResponse.json({ error: "Missing worker_id" }, { status: 400 });
  const supabase = createClient(url, key);
  const { data } = await supabase.from("hour_tracking").select("*, companies(name)").eq("worker_id", workerId);
  return NextResponse.json({ tracking: data || [] });
}
