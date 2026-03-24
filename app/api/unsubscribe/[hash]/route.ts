import { NextResponse } from "next/server";
import { resolveHashToEmail, suppressByEmail } from "@/src/lib/suppress";

export async function GET(
  _req: Request,
  { params }: { params: { hash: string } },
) {
  try {
    const email = await resolveHashToEmail(params.hash);
    if (email) await suppressByEmail(email, "one-click");
  } catch {}
  const html = `<!doctype html><html><body style="font-family:system-ui;padding:24px">
    <h1>You're unsubscribed</h1>
    <p>We recorded your request. You won't receive further emails from us.</p>
  </body></html>`;
  return new NextResponse(html, { headers: { "content-type": "text/html" } });
}
