/**
 * Vertical template types — only intake, recommendation, pricing, compliance, CRM differ per vertical.
 */

export type VerticalId = "glp" | "trt" | "pep";

export type PriceSignal =
  | { kind: "fixed"; amountUsd: number; label?: string }
  | { kind: "starts_at"; amountUsd: number; label?: string }
  | { kind: "range"; minUsd: number; maxUsd: number; label?: string };

export interface ProgramRecommendation {
  programId: string;
  programName: string;
  rationale: string;
  priceSignal: PriceSignal;
  urgencyScore: number;
  complianceNotes: string[];
}

export interface IntakeAnswer {
  questionId: string;
  value: string | number | boolean | string[];
}
