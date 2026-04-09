import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@supabase/supabase-js";
import React from "react";
import { Modelovereenkomst } from "@/lib/invoices/modelovereenkomst";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const supabase = createClient(url, key);

  // id can be application_id or shift_id
  const { data: app } = await supabase.from("applications").select(`
    *, workers(first_name, last_name, city, kvk_number, btw_number),
    shifts(title, date, start_time, end_time, rate_per_hour, description,
      companies(name, city, kvk_number),
      locations(name, address, city))
  `).eq("id", id).single();

  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  const w = app.workers;
  const s = app.shifts;
  const c = s?.companies;
  const l = s?.locations;
  const nr = `WW-OVK-${id.slice(0, 8).toUpperCase()}`;
  const datum = new Date(s?.date + "T00:00:00").toLocaleDateString("nl-NL");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element: any = React.createElement(Modelovereenkomst, {
    bemiddelaarNaam: "WorkWings B.V.",
    bemiddelaarPlaats: "Rotterdam",
    bemiddelaarKvk: "12345678",
    zzperNaam: `${w?.first_name} ${w?.last_name}`,
    zzperPlaats: w?.city || "Nederland",
    zzperKvk: w?.kvk_number,
    zzperBtw: w?.btw_number,
    opdrachtgeverNaam: c?.name || "Opdrachtgever",
    opdrachtgeverPlaats: c?.city || "Nederland",
    opdrachtgeverKvk: c?.kvk_number,
    omschrijving: s?.title || "Werkzaamheden",
    datum,
    startTijd: s?.start_time?.slice(0, 5) || "09:00",
    eindTijd: s?.end_time?.slice(0, 5) || "17:00",
    tariefPerUur: Number(app.proposed_rate || s?.rate_per_hour || 0),
    locatie: l ? `${l.name}, ${l.address || ""}, ${l.city || ""}` : "Op locatie opdrachtgever",
    overeenkomstNummer: nr,
    overeenkomstDatum: datum,
  });

  const pdfBuffer = await renderToBuffer(element);
  const uint8 = new Uint8Array(pdfBuffer);

  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${nr}.pdf"`,
    },
  });
}
