import { PRODUCT_NAME, PARENT_COMPANY_LEGAL_NAME } from "@/lib/product-identity";

/** Short lines safe for UI — counsel review before production */
export const glpCompliance = {
  intakeIntro:
    "This tool is for educational and booking purposes only. Not medical advice. A licensed provider will determine final eligibility.",
  resultFooter: `Not medical advice. ${PRODUCT_NAME} is a product of ${PARENT_COMPANY_LEGAL_NAME}.`,
  programPrefix: "Based on your answers, many patients explore programs like",
} as const;

export const bannedPhrases = [
  "you qualify for",
  "you should take",
  "clinically proven for your exact case",
  "guaranteed weight loss",
] as const;
