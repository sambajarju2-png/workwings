import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const supabase = createClient(url, key);

  const [
    { data: invoices },
    { data: payouts },
    { data: companyPayments },
    { data: shifts },
    { data: workers },
    { data: companies },
    { data: applications },
  ] = await Promise.all([
    supabase.from("invoices").select("*, workers(first_name, last_name, email), companies(name), shifts(title, date)").order("created_at", { ascending: false }).limit(50),
    supabase.from("payouts").select("*, workers(first_name, last_name)").order("created_at", { ascending: false }).limit(50),
    supabase.from("company_payments").select("*, companies(name)").order("created_at", { ascending: false }).limit(50),
    supabase.from("shifts").select("*, companies(name), locations(city)").order("created_at", { ascending: false }).limit(50),
    supabase.from("workers").select("id, first_name, last_name, email, phone, city, iban, status, payout_preference, total_shifts, rating_avg, created_at").order("created_at", { ascending: false }).limit(100),
    supabase.from("companies").select("id, name, kvk_number, contact_email, plan, status, created_at").order("created_at", { ascending: false }).limit(100),
    supabase.from("applications").select("*, workers(first_name, last_name), shifts(title, date, companies(name))").order("applied_at", { ascending: false }).limit(50),
  ]);

  // Stats
  const totalRevenue = (invoices || []).reduce((sum, i) => sum + Number(i.fee || 0), 0);
  const totalPaidOut = (payouts || []).filter(p => p.status === "completed" || p.status === "processing").reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalCompanyPayments = (companyPayments || []).filter(p => p.status === "received").reduce((sum, p) => sum + Number(p.total_amount || 0), 0);

  return NextResponse.json({
    stats: {
      total_invoices: invoices?.length || 0,
      total_workers: workers?.length || 0,
      total_companies: companies?.length || 0,
      total_shifts: shifts?.length || 0,
      total_applications: applications?.length || 0,
      total_revenue: totalRevenue,
      total_paid_out: totalPaidOut,
      total_company_payments: totalCompanyPayments,
    },
    invoices: invoices || [],
    payouts: payouts || [],
    company_payments: companyPayments || [],
    shifts: shifts || [],
    workers: workers || [],
    companies: companies || [],
    applications: applications || [],
  });
}
