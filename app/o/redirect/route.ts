import { NextResponse } from "next/server";

export async function GET() {
  const base =
    process.env.NEXT_PUBLIC_APP_URL || "https://demo.sunspiredemo.com";
  return NextResponse.redirect(`${base}/?company=testco&demo=1`, 307);
}
