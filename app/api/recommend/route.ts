import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { IntakeAnswer } from "@/lib/verticals/types";
import { recommendGlpProgram } from "@/lib/verticals/glp/recommend";
import { recommendTrtProgram } from "@/lib/verticals/trt/recommend";
import { recommendPepProgram } from "@/lib/verticals/pep/recommend";

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
    const list = answers as IntakeAnswer[];

    let recommendation;
    let stub = false;
    if (vertical === "glp") {
      recommendation = recommendGlpProgram(list);
    } else if (vertical === "trt") {
      recommendation = recommendTrtProgram(list);
      stub = true;
    } else {
      recommendation = recommendPepProgram(list);
      stub = true;
    }

    return NextResponse.json({ ok: true, vertical, recommendation, stub });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
