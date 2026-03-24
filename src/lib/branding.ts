export type Branding = {
  company: string;
  brandColor: string;
  token?: string;
  logoUrl?: string;
  tenantId?: string;
};

export function normalizeHex(input?: string) {
  if (!input) return "#1877F2";
  const decoded = input.startsWith("%23") ? "#" + input.slice(3) : input;
  const v = decoded.startsWith("#") ? decoded : "#" + decoded;
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) ? v : "#1877F2";
}

// Helper to get tenant by company handle
export async function getTenantByCompany(
  company: string,
): Promise<{ id: string; logoUrl?: string; brandColor?: string } | null> {
  try {
    // Optional: load from Supabase tenant config
    // This can be implemented later when the full tenant lookup is available
    return null;
  } catch {
    return null;
  }
}

export async function resolveBrandingFromSearch(
  search: URLSearchParams,
): Promise<Branding> {
  const company = (search.get("company") || "Demo").trim();
  const token = search.get("token") || undefined;
  const brandParam = normalizeHex(search.get("brandColor") || undefined);

  let logoUrl: string | undefined;
  let brandColor = brandParam;
  let tenantId: string | undefined;

  try {
    const t = await getTenantByCompany(company);
    if (t) {
      tenantId = t.id;
      logoUrl = t.logoUrl || logoUrl;
      if (t.brandColor) brandColor = normalizeHex(t.brandColor);
    }
  } catch {}

  return { company, token, brandColor, logoUrl, tenantId };
}
