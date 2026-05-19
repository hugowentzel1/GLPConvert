/**
 * Shared rules for demo / cold-email logos (HTTPS + allowlist).
 *
 * Resolution chain when `domain=clinic.com` is on the URL (the canonical cold-email pattern):
 *   1. If `NEXT_PUBLIC_LOGO_DEV_TOKEN` is set → use logo.dev — the 2026 Clearbit successor,
 *      free tier, full-resolution real brand logos. Sign up at https://logo.dev/ to get a token,
 *      then add `NEXT_PUBLIC_LOGO_DEV_TOKEN=...` to .env.local + Vercel env.
 *   2. Else → fall back to Google's favicon endpoint (free, no key, lower-res but real logo).
 *   3. If the resolved URL fails to load in the browser, the funnel already shows a monogram avatar.
 *
 * The original Clearbit endpoint (`logo.clearbit.com`) was discontinued after the HubSpot
 * acquisition and no longer resolves DNS. It stays in the allowlist only so legacy URLs
 * built before this refactor still pass sanitization (the host is dead so they 0-byte; the
 * <img> falls through to the monogram fallback).
 */

const LOGO_DEV_TOKEN =
  (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN : "") || "";

const ALLOWED_LOGO_HOSTS = new Set([
  "img.logo.dev",        // primary 2026 (Clearbit successor); needs NEXT_PUBLIC_LOGO_DEV_TOKEN
  "www.google.com",      // free favicon fallback, no key
  "logo.clearbit.com",   // legacy (dead host); kept for back-compat sanitization only
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

/**
 * Build the best automatic logo URL for a clinic domain.
 *
 * Prefers logo.dev (real full-resolution brand logo) when a token is configured;
 * falls back to Google's favicon endpoint (no key required, lower resolution).
 * Returns the empty string if `domain` cannot be normalized to a registrable host.
 */
export function clinicLogoUrl(domain: string): string {
  const d = normalizeDomainForClearbit(domain);
  if (!d) return "";
  if (LOGO_DEV_TOKEN) {
    return `https://img.logo.dev/${d}?token=${encodeURIComponent(LOGO_DEV_TOKEN)}&format=png&size=128&fallback=monogram`;
  }
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(d)}&sz=128`;
}

/**
 * Back-compat alias. Historically named for Clearbit; now routes through the
 * resolution chain in `clinicLogoUrl`. Kept so existing imports keep working.
 */
export function clearbitLogoUrl(domain: string): string {
  return clinicLogoUrl(domain);
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
