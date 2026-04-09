import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const supabase = createClient(url, key);
  const body = await req.json();

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true,
    user_metadata: { role: "worker" },
  });

  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });
  if (!authData.user) return NextResponse.json({ error: "User not created" }, { status: 500 });

  // 2. Create worker record
  const { error: workerError } = await supabase.from("workers").insert({
    id: authData.user.id,
    email: body.email,
    first_name: body.firstName,
    last_name: body.lastName,
    city: body.city || null,
    phone: body.phone || null,
    btw_number: body.btwNumber || null,
    kvk_number: body.kvkNumber || null,
    sectors: body.sectors || [],
    status: "active",
    payout_preference: "normal",
  });

  if (workerError) return NextResponse.json({ error: workerError.message }, { status: 500 });

  return NextResponse.json({ success: true, userId: authData.user.id });
}
