export const INTAKE_DEMO_EXAMPLE_HREF =
  "http://localhost:3000/intake?company=Sunspire+Weight+Clinic&demo=1&logo=https%3A%2F%2Fexample.com%2Flogo.png" as const;

/** Green brand tint + logo via Clearbit (`domain=`) — same-origin path; prefix your origin for sharing. */
export const INTAKE_DEMO_GREEN_LOGO_PATH =
  "/intake?demo=1&company=Verdant%20Clinic&domain=wholefoodsmarket.com&brandColor=%23047857" as const;

type IntakePageSearchParams = Readonly<
  Record<string, string | string[] | undefined> | undefined
>;

export function toUrlSearchParamsFromIntakePage(sp: IntakePageSearchParams): URLSearchParams {
  const out = new URLSearchParams();
  if (!sp) return out;
  for (const [key, value] of Object.entries(sp)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined) out.append(key, item);
      }
    } else {
      out.set(key, value);
    }
  }
  return out;
}

/** True when the GLP intake should show demo affordances (preview URL modes + demo=1|true). */
export function isIntakeDemoMode(sp: URLSearchParams | null): boolean {
  if (!sp) return false;
  return (
    sp.get("demo") === "1" ||
    sp.get("demo") === "true" ||
    sp.get("preview") === "1" ||
    sp.get("mode") === "demo"
  );
}

/**
 * Sales / cold-email preview: explicit demo params **or** branded `company` without tenant `handle`.
 * Paid embeds use `handle=` for config API — those stay in “paid” chrome.
 */
export function isIntakeBrandedMarketingMode(sp: URLSearchParams | null): boolean {
  if (!sp) return false;
  if (isIntakeDemoMode(sp)) return true;
  const company = sp.get("company")?.trim();
  const handle = sp.get("handle")?.trim();
  return Boolean(company) && !handle;
}
