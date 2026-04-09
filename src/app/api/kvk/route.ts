import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TEST_KEY = "l7xx1f2691f2520d487b902f4e0b57a0b197";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kvkNumber = searchParams.get("kvk");
  if (!kvkNumber) return NextResponse.json({ error: "Missing kvk param" }, { status: 400 });

  const apiKey = process.env.KVK_API_KEY || TEST_KEY;
  const isTest = !process.env.KVK_API_KEY;
  const baseUrl = isTest ? "https://api.kvk.nl/test/api/v1/basisprofielen" : "https://api.kvk.nl/api/v1/basisprofielen";

  try {
    const res = await fetch(`${baseUrl}/${kvkNumber}`, {
      headers: { apikey: apiKey },
    });

    if (!res.ok) return NextResponse.json({ found: false, error: "Niet gevonden" });

    const data = await res.json();
    const hv = data._embedded?.hoofdvestiging;
    const eigenaar = data._embedded?.eigenaar;

    return NextResponse.json({
      found: true,
      kvkNumber: data.kvkNummer,
      name: data.naam || eigenaar?.naam,
      legalForm: data.formeleRegistratiedatum ? undefined : undefined,
      address: hv?.adressen?.[0] ? `${hv.adressen[0].straatnaam || ""} ${hv.adressen[0].huisnummer || ""}`.trim() : undefined,
      city: hv?.adressen?.[0]?.plaats,
      postalCode: hv?.adressen?.[0]?.postcode,
      sbiActivities: data.spiActiviteiten?.map((s: any) => s.sbiOmschrijving) || [],
      employees: data.totaalWerkzamePersonen,
    });
  } catch (err) {
    return NextResponse.json({ found: false, error: String(err) });
  }
}
