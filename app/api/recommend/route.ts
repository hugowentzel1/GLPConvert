import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { IntakeAnswer } from "@/lib/verticals/types";
import { recommendGlpProgram } from "@/lib/verticals/glp/recommend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  vertical: z.enum(["glp", "trt", "pep"]).default("glp"),
  answers: z.array(
    z.object({
      questionId: z.string(),
      value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
    }),
  ),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
    }
    const { vertical, answers } = parsed.data;

    if (vertical !== "glp") {
      return NextResponse.json(
        { error: "Vertical not implemented yet", vertical },
        { status: 501 },
      );
    }

    const rec = recommendGlpProgram(answers as IntakeAnswer[]);
    return NextResponse.json({ ok: true, vertical, recommendation: rec });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
