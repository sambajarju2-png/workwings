import { NextResponse } from "next/server";
import { revolutClient } from "@/lib/revolut";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!revolutClient.isConfigured()) {
    return NextResponse.json({ status: "not_configured", message: "Missing REVOLUT_CLIENT_ID or REVOLUT_BUSINESS_PRIVATE_KEY" });
  }

  try {
    const accounts = await revolutClient.getAccounts();
    if (!accounts.success) return NextResponse.json({ status: "auth_failed", error: accounts.error });

    const eurAccount = accounts.data?.find((a: { currency: string }) => a.currency === "EUR");
    return NextResponse.json({
      status: "connected",
      accounts: accounts.data?.length || 0,
      eur_balance: eurAccount?.balance ?? null,
      eur_account_id: eurAccount?.id ?? null,
    });
  } catch (err) {
    return NextResponse.json({ status: "error", error: String(err) });
  }
}
