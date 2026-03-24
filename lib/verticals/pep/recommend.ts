import type { IntakeAnswer, ProgramRecommendation } from "../types";

export function recommendPepProgram(_answers: IntakeAnswer[]): ProgramRecommendation {
  return {
    programId: "pep-stub",
    programName: "PepConvert (coming soon)",
    rationale:
      "PepConvert vertical is scaffolded. Use GLPConvert (`vertical: glp`) for active flows.",
    priceSignal: {
      kind: "starts_at",
      amountUsd: 0,
      label: "Pricing to be configured per clinic.",
    },
    urgencyScore: 0,
    complianceNotes: [
      "Not medical advice.",
      "A licensed provider will determine final eligibility.",
    ],
  };
}
