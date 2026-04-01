import type { Tenant } from "@/src/lib/storage-types";
import { TENANT_FIELDS } from "@/src/lib/storage-types";

/** HTTPS URLs only — safe to expose to browsers. */
function isHttpsUrl(s: string): boolean {
  return /^https:\/\/.+/i.test(s.trim());
}

/**
 * Public intake config derived from tenant row (no secrets).
 * Booking URL: JSON in CRM Keys — { "booking_url": "https://..." } or bookingUrl / calendly_url.
 * Optional: Domain / Login URL if it clearly looks like a scheduler link.
 */
export function extractPublicIntakeConfig(tenant: Tenant | null): {
  bookingUrl: string | null;
  logoUrl: string | null;
  brandColor: string | null;
} {
  if (!tenant) {
    return { bookingUrl: null, logoUrl: null, brandColor: null };
  }

  const logoRaw = tenant[TENANT_FIELDS.LOGO_URL];
  const logoUrl = typeof logoRaw === "string" && isHttpsUrl(logoRaw) ? logoRaw.trim() : null;

  const colorsRaw = tenant[TENANT_FIELDS.BRAND_COLORS];
  let brandColor: string | null = null;
  if (typeof colorsRaw === "string" && colorsRaw.trim()) {
    const first = colorsRaw.split(/[,\s|]/)[0]?.trim();
    if (first && /^#?[0-9A-Fa-f]{6}$/.test(first.replace(/^#/, ""))) {
      brandColor = first.startsWith("#") ? first : `#${first}`;
    }
  }

  let bookingUrl: string | null = null;
  const crmRaw = tenant[TENANT_FIELDS.CRM_KEYS];
  if (typeof crmRaw === "string" && crmRaw.trim()) {
    try {
      const j = JSON.parse(crmRaw) as Record<string, unknown>;
      const candidates = [j.booking_url, j.bookingUrl, j.calendly_url, j.scheduling_url];
      for (const c of candidates) {
        if (typeof c === "string" && isHttpsUrl(c)) {
          bookingUrl = c.trim();
          break;
        }
      }
    } catch {
      /* ignore invalid JSON */
    }
  }

  if (!bookingUrl) {
    const domainLogin = tenant[TENANT_FIELDS.DOMAIN_LOGIN_URL];
    if (typeof domainLogin === "string" && isHttpsUrl(domainLogin)) {
      const d = domainLogin.trim();
      if (/calendly|schedule|book|appoint|acuity|meetings|hubspot\.com\/meetings|zcal|tidycal/i.test(d)) {
        bookingUrl = d;
      }
    }
  }

  return { bookingUrl, logoUrl, brandColor };
}
