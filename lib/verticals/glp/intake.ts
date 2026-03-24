import type { VerticalId } from "../types";

export const GLP_VERTICAL_ID: VerticalId = "glp";

/** GLP-1 intake — compliance-safe phrasing; no diagnosis or eligibility claims. */
export const glpIntakeQuestions = [
  {
    id: "goal",
    type: "single" as const,
    required: true,
    prompt:
      "What are you mainly hoping to explore? (A licensed provider will determine final eligibility.)",
    options: [
      { value: "lose_weight", label: "Sustainable weight management" },
      { value: "metabolic", label: "Metabolic health / energy" },
      { value: "other", label: "Something else / not sure" },
    ],
  },
  {
    id: "prior_programs",
    type: "single" as const,
    required: false,
    prompt:
      "Have you tried structured weight-management support before? (Optional — helps us suggest next steps.)",
    options: [
      { value: "none", label: "Not yet" },
      { value: "lifestyle", label: "Lifestyle / coaching" },
      { value: "medication", label: "Prescription medication in the past" },
      { value: "prefer_not", label: "Prefer not to say" },
    ],
  },
  {
    id: "timeline",
    type: "single" as const,
    required: true,
    prompt: "How soon are you looking to speak with the clinic?",
    options: [
      { value: "asap", label: "As soon as possible" },
      { value: "two_weeks", label: "Within two weeks" },
      { value: "exploring", label: "Just exploring" },
    ],
  },
] as const;
