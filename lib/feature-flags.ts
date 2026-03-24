/**
 * Runtime feature flags derived from public env (safe for client + server).
 */

export type ProductVertical = "glp" | "trt" | "pep" | "solar_legacy";

export function getDefaultVertical(): ProductVertical {
  const v = (process.env.NEXT_PUBLIC_VERTICAL || "glp").toLowerCase();
  if (v === "trt") return "trt";
  if (v === "pep") return "pep";
  if (v === "solar_legacy" || v === "solar") return "solar_legacy";
  return "glp";
}

/** When true, solar report is legacy; primary patient flow is intake → result */
export function isGlpPrimaryProduct(): boolean {
  return getDefaultVertical() === "glp";
}

/** Solar estimate + /report remain available for demos/migration */
export function isSolarEstimateEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_ENABLE_SOLAR_ESTIMATE === "1") return true;
  if (process.env.NEXT_PUBLIC_ENABLE_SOLAR_ESTIMATE === "0") return false;
  return getDefaultVertical() === "solar_legacy";
}
