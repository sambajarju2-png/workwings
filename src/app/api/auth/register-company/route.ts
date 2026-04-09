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
    user_metadata: { role: "company", company_name: body.companyName },
  });

  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });
  if (!authData.user) return NextResponse.json({ error: "User not created" }, { status: 500 });

  // 2. Create company
  const { data: company, error: companyError } = await supabase.from("companies").insert({
    name: body.companyName,
    kvk_number: body.kvk || null,
    contact_email: body.email,
    address: body.address || null,
    city: body.city || null,
    postal_code: body.postalCode || null,
    sectors: body.sectors || [],
    status: "active",
  }).select().single();

  if (companyError) return NextResponse.json({ error: companyError.message }, { status: 500 });

  // 3. Link user to company
  await supabase.from("company_members").insert({
    company_id: company.id,
    user_id: authData.user.id,
    role: "admin",
  });

  return NextResponse.json({ success: true, userId: authData.user.id, companyId: company.id });
}
