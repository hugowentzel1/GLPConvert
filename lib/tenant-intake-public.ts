import type { Tenant } from "@/src/lib/storage-types";
import { TENANT_FIELDS } from "@/src/lib/storage-types";

/** HTTPS URLs only — safe to expose to browsers. */
function isHttpsUrl(s: string): boolean {
  return /^https:\/\/.+/i.test(s.trim());
}

function normHex6(v: unknown): string | null {
  if (typeof v !== "string" || !v.trim()) return null;
  let s = v.trim();
  if (!s.startsWith("#")) s = `#${s}`;
  return /^#[0-9A-Fa-f]{6}$/.test(s) ? s : null;
}

function parseCrmJson(crmRaw: string | undefined): Record<string, unknown> | null {
  if (!crmRaw?.trim()) return null;
  try {
    return JSON.parse(crmRaw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function pickString(j: Record<string, unknown> | null, keys: string[]): string | null {
  if (!j) return null;
  for (const k of keys) {
    const v = j[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function pickPositiveInt(j: Record<string, unknown> | null, keys: string[]): number | null {
  if (!j) return null;
  for (const k of keys) {
    const v = j[k];
    if (typeof v === "number" && Number.isFinite(v) && v >= 0) return Math.round(v);
    if (typeof v === "string" && /^\d+(\.\d+)?$/.test(v.trim())) return Math.round(parseFloat(v));
  }
  return null;
}

export function humanizeTenantHandle(handle: string): string {
  return handle
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export type PublicIntakeConfig = {
  bookingUrl: string | null;
  logoUrl: string | null;
  brandColor: string | null;
  brandColorSecondary: string | null;
  /** Resolved display name for intake chrome (tenant CRM config or handle). */
  displayName: string;
  pricingMonthlyLow: number | null;
  pricingMonthlyHigh: number | null;
  consultFeeNote: string | null;
  paymentNote: string | null;
};

/**
 * Public intake config derived from tenant row (no secrets).
 * Booking URL: JSON in CRM Keys — booking_url, bookingUrl, calendly_url, etc.
 * Optional intake economics in crm_keys:
 *   intake_monthly_low, intake_monthly_high (numbers)
 *   intake_consult_fee_note, intake_payment_note (strings)
 * Branding overrides: intake_brand_name | display_name; intake_brand_color_secondary | brand2 (hex)
 */
export function extractPublicIntakeConfig(tenant: Tenant | null, handle: string): PublicIntakeConfig {
  const fallbackName = humanizeTenantHandle(handle || "clinic");

  if (!tenant) {
    return {
      bookingUrl: null,
      logoUrl: null,
      brandColor: null,
      brandColorSecondary: null,
      displayName: fallbackName,
      pricingMonthlyLow: null,
      pricingMonthlyHigh: null,
      consultFeeNote: null,
      paymentNote: null,
    };
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

  const j = parseCrmJson(tenant[TENANT_FIELDS.CRM_KEYS]);
  const secondaryFromCrm =
    normHex6(pickString(j, ["intake_brand_color_secondary", "brand2", "secondary_brand_color"])) ||
    null;
  const nameFromCrm = pickString(j, ["intake_brand_name", "display_name", "brand_name"]);
  const pricingLow = pickPositiveInt(j, ["intake_monthly_low", "pricing_monthly_low", "monthly_low"]);
  const pricingHigh = pickPositiveInt(j, ["intake_monthly_high", "pricing_monthly_high", "monthly_high"]);
  const consultFeeNote = pickString(j, ["intake_consult_fee_note", "consult_fee_note"]);
  const paymentNote = pickString(j, ["intake_payment_note", "payment_note", "insurance_note"]);

  let bookingUrl: string | null = null;
  if (j) {
    const candidates = [j.booking_url, j.bookingUrl, j.calendly_url, j.scheduling_url];
    for (const c of candidates) {
      if (typeof c === "string" && isHttpsUrl(c)) {
        bookingUrl = c.trim();
        break;
      }
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

  const displayName = nameFromCrm || fallbackName;

  return {
    bookingUrl,
    logoUrl,
    brandColor,
    brandColorSecondary: secondaryFromCrm,
    displayName,
    pricingMonthlyLow: pricingLow,
    pricingMonthlyHigh: pricingHigh,
    consultFeeNote,
    paymentNote,
  };
}
