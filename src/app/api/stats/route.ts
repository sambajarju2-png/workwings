import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ openShifts: 0, companies: 0, avgRate: 0, workers: 0 });
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, key);

    // Parallel fetch all stats
    const [shiftsRes, companiesRes, workersRes, ratesRes] = await Promise.all([
      supabase.from("shifts").select("id", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("companies").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("workers").select("id", { count: "exact", head: true }),
      supabase.from("shifts").select("rate_per_hour").eq("status", "open"),
    ]);

    const openShifts = shiftsRes.count || 0;
    const companies = companiesRes.count || 0;
    const workers = workersRes.count || 0;

    // Calculate average rate
    const rates = ratesRes.data || [];
    const avgRate = rates.length > 0
      ? Math.round(rates.reduce((sum: number, r: { rate_per_hour: number }) => sum + r.rate_per_hour, 0) / rates.length)
      : 0;

    return NextResponse.json(
      { openShifts, companies, avgRate, workers },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (err) {
    console.error("Stats API error:", err);
    return NextResponse.json({ openShifts: 0, companies: 0, avgRate: 0, workers: 0 });
  }
}
