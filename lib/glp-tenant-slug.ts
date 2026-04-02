type SearchLike = { get: (key: string) => string | null } | null;

/**
 * Resolve tenant handle for Supabase + public config API.
 * Use `handle=` when `company=` is a human display name (cold-email demos).
 */
export function resolveGlpTenantSlug(searchParams: SearchLike): string {
  if (!searchParams) return "glpconvert";
  const explicit = searchParams.get("handle")?.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (explicit && /^[a-z0-9-]{1,64}$/.test(explicit)) return explicit;
  const fromCompany = (searchParams.get("company") || "glpconvert")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return fromCompany || "glpconvert";
}
