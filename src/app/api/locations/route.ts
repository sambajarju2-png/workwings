import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getCompanyId() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: m } = await admin.from("company_members").select("company_id").eq("user_id", user.id).single();
  return m?.company_id || null;
}

export async function GET() {
  const companyId = await getCompanyId();
  if (!companyId) return NextResponse.json({ locations: [] });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data } = await supabase.from("locations").select("*").eq("company_id", companyId).order("created_at", { ascending: false });
  return NextResponse.json({ locations: data || [] });
}

export async function POST(req: Request) {
  const companyId = await getCompanyId();
  if (!companyId) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  const body = await req.json();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data, error } = await supabase.from("locations").insert({
    company_id: companyId,
    name: body.name,
    address: body.address || null,
    city: body.city,
    lat: body.lat ? parseFloat(body.lat) : null,
    lng: body.lng ? parseFloat(body.lng) : null,
    parking_info: body.parking_info || null,
    dress_code: body.dress_code || null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ location: data });
}
