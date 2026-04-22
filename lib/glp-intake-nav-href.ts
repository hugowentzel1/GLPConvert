/**
 * Intake / marketing — preserve full query (UTMs, branding, demo) on navigation.
 */

type SearchLike = URLSearchParams | null;

export function buildMarketingHomeHref(sp: SearchLike): string {
  if (!sp) return "/";
  const q = sp.toString();
  return q ? `/?${q}` : "/";
}

export function buildIntakeSelfHref(sp: SearchLike): string {
  if (!sp) return "/intake";
  const qs = sp.toString();
  return qs ? `/intake?${qs}` : "/intake";
}

export function buildIntakePricingHref(sp: SearchLike, companyLabel: string): string {
  const q = new URLSearchParams(sp?.toString() ?? "");
  const label = companyLabel.trim() || "Your clinic";
  q.set("company", label);
  return `/pricing?${q.toString()}`;
}
