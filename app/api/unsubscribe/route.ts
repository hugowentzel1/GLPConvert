import { NextResponse } from "next/server";
import { z } from "zod";
import { suppressByEmail } from "@/src/lib/suppress";
const Body = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  try {
    const { email } = Body.parse(await req.json());
    await suppressByEmail(email, "body");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
