/**
 * Shared rules for demo / cold-email logos (HTTPS + allowlist).
 * Clearbit URLs are used when `domain=example.com` is present (or `company` is a bare domain).
 */

const ALLOWED_LOGO_HOSTS = new Set([
  "logo.clearbit.com",
  "res.cloudinary.com",
  "i.imgur.com",
  "images.unsplash.com",
  "cdn.jsdelivr.net",
]);

/** Hostnames permitted for external logo URLs in demo / brand takeover flows */
export const LOGO_URL_ALLOWED_HOSTS = ALLOWED_LOGO_HOSTS;

/**
 * Normalize user input into a registrable domain (lowercase, no protocol/www/path).
 * Returns null if it does not look like example.com
 */
export function normalizeDomainForClearbit(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let s = raw.trim().toLowerCase();
  s = s.replace(/^https?:\/\//, "").replace(/^www\./, "");
  s = s.split("/")[0]?.split("?")[0] || "";
  s = s.replace(/[<>]/g, "").trim();
  if (!/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/i.test(s)) return null;
  if (s.length > 128) return null;
  return s;
}

export function clearbitLogoUrl(domain: string): string {
  const d = normalizeDomainForClearbit(domain);
  if (!d) return "";
  return `https://logo.clearbit.com/${d}`;
}

/**
 * Return the URL if it is HTTPS and host is allowlisted; otherwise null.
 */
export function sanitizeExternalLogoUrl(urlStr: string | null | undefined): string | null {
  if (!urlStr) return null;
  let decoded = urlStr;
  try {
    decoded = decodeURIComponent(urlStr);
  } catch {
    decoded = urlStr;
  }
  try {
    const u = new URL(decoded);
    if (u.protocol !== "https:") return null;
    if (!ALLOWED_LOGO_HOSTS.has(u.hostname)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

/**
 * Resolve logo: explicit HTTPS logo param wins; else Clearbit from domain or company-as-domain.
 */
export function resolveBrandedLogoUrl(
  logoParam: string | null | undefined,
  domainParam: string | null | undefined,
  companyParam: string | null | undefined,
): string | null {
  let fromQuery: string | null = null;
  if (logoParam) {
    try {
      const u = decodeURIComponent(logoParam.trim());
      if (/^https:\/\//i.test(u)) fromQuery = u;
    } catch {
      /* ignore */
    }
  }
  const direct = sanitizeExternalLogoUrl(fromQuery);
  if (direct) return direct;

  const dom =
    normalizeDomainForClearbit(domainParam) || normalizeDomainForClearbit(companyParam);
  if (!dom) return null;
  return sanitizeExternalLogoUrl(clearbitLogoUrl(dom));
}
