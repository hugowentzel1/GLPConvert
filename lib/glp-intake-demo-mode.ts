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
