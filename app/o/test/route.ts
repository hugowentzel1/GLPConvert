import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(
    "https://sunspire-web-app.vercel.app/?company=testco&demo=1",
    307,
  );
}
