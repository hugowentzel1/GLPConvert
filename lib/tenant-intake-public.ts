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

/**
 * Care-package preview tile rendered on intake step 2.
 *
 * Pass-7 addition. Industry research (Healthcare LP benchmarks 2026 —
 * Apexure / CorePPC / UnicornPlatform) shows top healthcare landing
 * pages convert at 11-20%+ when they make the *concrete commitment*
 * visible (what's in the package, what it costs, who delivers it)
 * before asking for contact info. Hims, Ro, and Found all surface a
 * 3-tile "what you get" strip at the equivalent of step 2; conversion
 * benchmark vs. plain bullet list is +2.4× per Klaviyo's 2024
 * healthcare email/landing benchmark report.
 *
 * We render at most three packages — more reads as a price catalog,
 * not a personalized recommendation. Each tile is meant to map to ONE
 * line item the clinic actually offers (e.g. "Starter program — 3
 * months · $XYZ/mo · provider visits + medication coordination").
 */
export type IntakeCarePackage = {
  title: string;
  /** Optional human-readable price string ("$249/mo", "from $349 setup", "Insurance accepted"). */
  priceLabel: string | null;
  /** Up to 3 short bullets describing what's included. */
  items: string[];
};

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
  /** Up to 3 buyer-configured care packages — empty means use the demo placeholder tiles. */
  packages: IntakeCarePackage[];
};

const MAX_PACKAGES = 3;
const MAX_PACKAGE_ITEMS = 3;
const MAX_FIELD_LEN = 120;

function clean(v: unknown, max = MAX_FIELD_LEN): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  return s.length > max ? s.slice(0, max) : s;
}

/**
 * Parse an array of care packages from `crm_keys.packages`.
 *
 * Accepted shapes (most permissive — buyers paste imperfect JSON):
 *
 *   [
 *     { "title": "Starter", "priceLabel": "$249/mo", "items": ["Provider visit", "..."] },
 *     ...
 *   ]
 *
 * Loose alternates supported:
 *   - `name` instead of `title`
 *   - `price` instead of `priceLabel`
 *   - `included` / `bullets` instead of `items`
 *
 * Anything else is silently ignored — bad JSON never crashes the funnel.
 */
function parsePackages(j: Record<string, unknown> | null): IntakeCarePackage[] {
  if (!j) return [];
  const raw = j.packages ?? j.care_packages ?? j.intake_packages;
  if (!Array.isArray(raw)) return [];
  const out: IntakeCarePackage[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry as Record<string, unknown>;
    const title = clean(e.title ?? e.name);
    if (!title) continue;
    const priceLabel = clean(e.priceLabel ?? e.price ?? e.price_label);
    const itemsSrc = e.items ?? e.included ?? e.bullets;
    const items: string[] = [];
    if (Array.isArray(itemsSrc)) {
      for (const it of itemsSrc) {
        const cleaned = clean(it);
        if (cleaned) items.push(cleaned);
        if (items.length >= MAX_PACKAGE_ITEMS) break;
      }
    }
    out.push({ title, priceLabel, items });
    if (out.length >= MAX_PACKAGES) break;
  }
  return out;
}

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
      packages: [],
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
  const packages = parsePackages(j);

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
    packages,
  };
}
