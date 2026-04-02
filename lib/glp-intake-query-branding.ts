import { resolveBrandedLogoUrl } from "@/lib/logo-brand-helpers";

/** Normalize #RRGGBB from query params */
export function normIntakeBrandHex(v: string | null | undefined): string | null {
  if (v == null || v === "") return null;
  let s = v.trim();
  if (!s) return null;
  if (!s.startsWith("#")) s = `#${s}`;
  return /^#[0-9A-Fa-f]{6}$/.test(s) ? s : null;
}

export type GlpIntakeQueryBranding = {
  logoUrl: string | null;
  primaryHex: string | null;
  secondaryHex: string | null;
};

/**
 * Logo + colors from URL (demo / cold-email), same rules as the intake funnel.
 * Works with `URLSearchParams` from `useSearchParams()` or `new URL(url).searchParams`.
 */
export function parseGlpIntakeQueryBranding(sp: URLSearchParams | null): GlpIntakeQueryBranding {
  if (!sp) {
    return { logoUrl: null, primaryHex: null, secondaryHex: null };
  }
  const logoUrl = resolveBrandedLogoUrl(
    sp.get("logo") || null,
    sp.get("domain") || null,
    sp.get("company") || null,
  );
  const primaryHex =
    normIntakeBrandHex(sp.get("brandColor")) ||
    normIntakeBrandHex(sp.get("primary")) ||
    normIntakeBrandHex(sp.get("brand")) ||
    null;
  const secondaryHex = normIntakeBrandHex(sp.get("brand2")) || null;
  return { logoUrl, primaryHex, secondaryHex };
}
