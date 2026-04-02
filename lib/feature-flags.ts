/**
 * Runtime feature flags derived from public env (safe for client + server).
 */

export type ProductVertical = "glp" | "trt" | "pep";

export function getDefaultVertical(): ProductVertical {
  const v = (process.env.NEXT_PUBLIC_VERTICAL || "glp").toLowerCase();
  if (v === "trt") return "trt";
  if (v === "pep") return "pep";
  return "glp";
}

/** When true, solar report is legacy; primary patient flow is intake → result */
export function isGlpPrimaryProduct(): boolean {
  return getDefaultVertical() === "glp";
}

/**
 * Solar estimate + /report UI — **off** unless explicitly enabled (not used on GLPConvert).
 */
export function isSolarEstimateEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_SOLAR_ESTIMATE === "1";
}
