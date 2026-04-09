import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const supabase = createClient(url, key);
  const { application_id, shift_id, worker_id, reason } = await req.json();

  const { data, error } = await supabase.from("substitutions").insert({
    application_id, shift_id, original_worker_id: worker_id, reason, status: "open",
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Make the shift visible again for other workers
  await supabase.from("shifts").update({ workers_filled: -1 }).eq("id", shift_id); // decrement

  return NextResponse.json({ success: true, substitution_id: data.id });
}
