import { NextResponse } from "next/server";
import { revolutClient } from "@/lib/revolut";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!revolutClient.isConfigured()) {
    return NextResponse.json({ error: "Revolut not configured" }, { status: 500 });
  }

  try {
    const token = await revolutClient.getAccessToken();
    const isProd = process.env.REVOLUT_ENVIRONMENT === "production";
    const baseUrl = isProd ? "https://b2b.revolut.com/api/2.0" : "https://sandbox-b2b.revolut.com/api/2.0";

    // Register webhook for transaction events
    const res = await fetch(`${baseUrl}/webhooks`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: "https://workwings.vercel.app/api/revolut/webhook",
        events: [
          "TransactionCreated",
          "TransactionStateChanged",
          "PayoutLinkCreated",
          "PayoutLinkStateChanged",
        ],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data, status: res.status });
    }

    return NextResponse.json({
      success: true,
      webhook_id: data.id,
      url: data.url,
      events: data.events,
      message: "Webhook registered successfully",
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
