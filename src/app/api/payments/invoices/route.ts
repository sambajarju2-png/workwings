import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  if (!url || !key) return NextResponse.json({ invoices: [] });

  const supabase = createClient(url, key);
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("company_id");
  const workerId = searchParams.get("worker_id");

  let query = supabase.from("invoices").select(`
    *, workers(id, first_name, last_name, phone, iban),
    companies(id, name), shifts(id, title, date, start_time, end_time)
  `).order("created_at", { ascending: false }).limit(50);

  if (companyId) query = query.eq("company_id", companyId);
  if (workerId) query = query.eq("worker_id", workerId);

  const { data } = await query;
  return NextResponse.json({ invoices: data || [] });
}
