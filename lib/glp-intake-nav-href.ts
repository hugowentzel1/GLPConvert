/**
 * Intake / marketing — preserve full query (UTMs, branding, demo) on navigation.
 */

/** Works with `useSearchParams()` (ReadonlyURLSearchParams) and `URLSearchParams`. */
type SearchLike = { toString(): string; get(name: string): string | null } | null;

export function buildMarketingHomeHref(sp: SearchLike): string {
  if (!sp) return "/";
  const q = sp.toString();
  return q ? `/?${q}` : "/";
}

/** Demos and intake previews: home is marketing `/`. Logged-in / paid entry without `demo` often maps to `/paid`. */
export function buildAppHomeHref(sp: SearchLike): string {
  if (!sp) return "/";
  const q = sp.toString();
  if (sp.get("demo")) {
    return q ? `/?${q}` : "/";
  }
  return q ? `/paid?${q}` : "/paid";
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

/** Preserve current query (UTMs, demo, branding) for marketing site links (sunspire-style header). */
export function buildMarketingPathHref(sp: SearchLike, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!sp) return normalized;
  const qs = sp.toString();
  return qs ? `${normalized}?${qs}` : normalized;
}
