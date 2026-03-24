import type { IntakeAnswer, ProgramRecommendation } from "../types";

function answerMap(answers: IntakeAnswer[]): Record<string, string | undefined> {
  const m: Record<string, string | undefined> = {};
  for (const a of answers) {
    if (typeof a.value === "string") m[a.questionId] = a.value;
  }
  return m;
}

/**
 * Deterministic, non-clinical recommendation scaffold.
 * Replace programIds/names with clinic-specific catalog from Supabase or tenant config.
 */
export function recommendGlpProgram(answers: IntakeAnswer[]): ProgramRecommendation {
  const m = answerMap(answers);
  const timeline = m.timeline ?? "exploring";
  const goal = m.goal ?? "other";

  let programId = "core-coaching";
  let programName = "Core coaching + provider consult";
  let rationale =
    "Based on your answers, many patients explore a structured program with a licensed provider consult first.";
  let minUsd = 149;
  let maxUsd = 399;
  let urgencyScore = 40;

  if (timeline === "asap") {
    urgencyScore = 85;
    programId = "priority-consult";
    programName = "Priority consult pathway";
    rationale =
      "Because you’re looking to move quickly, we’ll prioritize booking you with the care team.";
  }

  if (goal === "metabolic") {
    programId = "metabolic-track";
    programName = "Metabolic wellness track";
    rationale =
      "Many people exploring metabolic health start with labs and a provider-led plan — final options are determined in consult.";
  }

  return {
    programId,
    programName,
    rationale,
    priceSignal: {
      kind: "range",
      minUsd,
      maxUsd,
      label: "Typical programs in this category often fall in this range; exact pricing is confirmed by the clinic.",
    },
    urgencyScore,
    complianceNotes: [
      "Not medical advice.",
      "A licensed provider will determine final eligibility.",
      "This tool is for educational and booking purposes only.",
    ],
  };
}
