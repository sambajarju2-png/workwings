import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const clientId = process.env.REVOLUT_CLIENT_ID;
  if (!clientId) return NextResponse.json({ error: "REVOLUT_CLIENT_ID not set" }, { status: 500 });

  const isProd = process.env.REVOLUT_ENVIRONMENT === "production";
  const baseAuth = isProd ? "https://business.revolut.com" : "https://sandbox-business.revolut.com";
  const redirectUri = "https://workwings.vercel.app/api/revolut/callback";

  const url = `${baseAuth}/app-confirm?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=READ,WRITE,PAY`;

  return NextResponse.redirect(url);
}
