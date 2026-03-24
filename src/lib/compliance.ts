// src/lib/compliance.ts
export const FEATURES = {
  cookiePreferences: process.env.NEXT_PUBLIC_COOKIE_PREFERENCES === "true",
  cpraDoNotSell: process.env.NEXT_PUBLIC_CPRA_DNS === "true",
  showLastValidated: process.env.NEXT_PUBLIC_SHOW_LAST_VALIDATED === "false" ? false : false, // default false
  showEstimateDisclaimer: process.env.NEXT_PUBLIC_SHOW_ESTIMATE_DISCLAIMER === "true", // default off
};

export function lastValidatedLabel(date = new Date()) {
  return date.toLocaleString("en-US", { month: "short", year: "numeric" }); // e.g., "Oct 2025"
}

