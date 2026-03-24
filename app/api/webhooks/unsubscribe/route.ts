import { NextResponse } from "next/server";
import { upsertLeadSuppressionByEmail } from "@/src/lib/storage";
import { z } from "zod";

const Body = z.object({
  email: z.string().email(),
  hash: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email } = Body.parse(json);
    await upsertLeadSuppressionByEmail(email, "webhook");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("unsubscribe webhook error", err);
    return NextResponse.json(
      { ok: false, error: "bad_request" },
      { status: 400 },
    );
  }
}
