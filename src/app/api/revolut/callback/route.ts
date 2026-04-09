import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  return NextResponse.redirect(new URL("/admin?revolut=connected", req.url));
}
