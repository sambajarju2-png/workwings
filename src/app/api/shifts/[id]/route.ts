import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ shift: null, source: "mock" });
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, key);

    const { data: shift, error } = await supabase
      .from("shifts")
      .select(`
        *,
        companies ( id, name, description, brand_color, sectors, contact_email, contact_phone ),
        locations ( id, name, address, city, lat, lng, parking_info, dress_code )
      `)
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ shift: null, source: "error", error: error.message });
    }

    return NextResponse.json({ shift, source: "supabase" });
  } catch (err) {
    return NextResponse.json({ shift: null, source: "error" });
  }
}
