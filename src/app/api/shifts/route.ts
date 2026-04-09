import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ shifts: [], source: "mock" });
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, key);

    const { data: shifts, error } = await supabase
      .from("shifts")
      .select(`
        *,
        companies ( id, name, description, brand_color, sectors ),
        locations ( id, name, address, city, lat, lng, parking_info, dress_code )
      `)
      .eq("status", "open")
      .order("date", { ascending: true })
      .limit(20);

    if (error) {
      console.error("Shifts fetch error:", error);
      return NextResponse.json({ shifts: [], source: "error", error: error.message });
    }

    return NextResponse.json({ shifts: shifts || [], source: "supabase" });
  } catch (err) {
    console.error("Shifts API error:", err);
    return NextResponse.json({ shifts: [], source: "error" });
  }
}
