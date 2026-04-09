"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";
import { getBrandTheme } from "@/lib/brandTheme";
import { isDemoFromSearch } from "@/src/lib/isDemo";
import { STORAGE_KEYS } from "@/lib/product-identity";
import {
  LOGO_URL_ALLOWED_HOSTS,
  normalizeDomainForClearbit,
  resolveBrandedLogoUrl,
  sanitizeExternalLogoUrl,
} from "@/lib/logo-brand-helpers";

function clean(s: string | null) {
  return s ? s.replace(/[<>]/g, "").trim().slice(0, 40) : null;
}
function hex(h: string | null, fallback = "#0f172a") {
  if (!h) return fallback;
  const x = h.startsWith("#") ? h : `#${h}`;
  return /^#[0-9a-fA-F]{6}$/.test(x) ? x.toUpperCase() : fallback;
}

/** 6-digit hex (with optional #) — used so `brand=059669` can mean color when `company` is set. */
function isLikelyHex6(s: string | null | undefined): boolean {
  if (!s) return false;
  const t = s.trim().replace(/^#/, "");
  return /^[0-9a-fA-F]{6}$/.test(t);
}

export type BrandState = {
  enabled: boolean;
  brand: string;
  primary: string;
  logo: string | null;
  domain: string | null;
  city: string | null;
  rep: string | null;
  firstName: string | null;
  role: string | null;
  expireDays: number;
  runs: number;
  blur: boolean;
  pilot: boolean;
  isDemo: boolean;
};

const STORAGE_KEY = STORAGE_KEYS.brandTakeover;

const DEFAULT_BRAND_STATE: BrandState = {
  enabled: false,
  brand: "Your Company",
  primary: getBrandTheme("default"),
  logo: null,
  domain: null,
  city: null,
  rep: null,
  firstName: null,
  role: null,
  expireDays: 7,
  runs: 2,
  blur: true,
  pilot: false,
  isDemo: false,
};

/**
 * Derive brand takeover from the current URL synchronously so SSR + first paint match
 * `?company=&demo=` links (previously state only updated in useEffect, so the site looked “broken”).
 */
export function brandStateFromSearchParams(
  sp: ReadonlyURLSearchParams | URLSearchParams | null | undefined,
): BrandState | null {
  if (!sp) return null;
  const isDemo = isDemoFromSearch(sp as URLSearchParams);
  const hasCompany = !!sp.get("company");
  const urlEnabled = isDemo || hasCompany;
  if (!urlEnabled) return null;

  const companyRaw = sp.get("company");
  const brandRaw = sp.get("brand");
  const companyName =
    clean(companyRaw || (brandRaw && !isLikelyHex6(brandRaw) ? brandRaw : null) || null) || "Your Company";
  const brandParamAsColor = brandRaw && isLikelyHex6(brandRaw) ? brandRaw : null;
  const customColor = sp.get("primary") || sp.get("brandColor") || brandParamAsColor;
  const domainExplicit = sp.get("domain")?.trim() || null;

  let themeColor: string;
  if (customColor) {
    themeColor = hex(customColor);
  } else {
    try {
      themeColor = getBrandTheme(companyName);
    } catch {
      themeColor = "#0f172a";
    }
  }

  const validatedLogo = resolveBrandedLogoUrl(sp.get("logo") || null, domainExplicit, sp.get("company") || null);

  const resolvedDomain =
    normalizeDomainForClearbit(domainExplicit) || normalizeDomainForClearbit(sp.get("company"));

  return {
    enabled: urlEnabled,
    brand: companyName,
    primary: themeColor,
    logo: validatedLogo,
    domain: resolvedDomain,
    city: sp.get("city") || null,
    rep: sp.get("rep") || null,
    firstName: clean(sp.get("firstName") || null),
    role: clean(sp.get("role") || null),
    expireDays: Math.max(1, parseInt(sp.get("expire") || "7", 10) || 7),
    runs: 2,
    blur: true,
    pilot: sp.get("pilot") === "1",
    isDemo,
  };
}

function saveBrandState(brandState: BrandState) {
  try {
    const stateWithTimestamp = {
      ...brandState,
      _timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateWithTimestamp));
  } catch (e) {
    console.error("useBrandTakeover: Failed to save to localStorage:", e);
  }
}

/** @deprecated use LOGO_URL_ALLOWED_HOSTS from `@/lib/logo-brand-helpers` */
export const ALLOWED_LOGO_HOSTS = Array.from(LOGO_URL_ALLOWED_HOSTS);

export function useBrandTakeover(): BrandState {
  const searchParams = useSearchParams();
  const sp = searchParams ?? new URLSearchParams();

  const fromUrl = useMemo(() => brandStateFromSearchParams(sp), [sp]);

  const [storedState, setStoredState] = useState<BrandState | null>(null);

  useEffect(() => {
    if (fromUrl) {
      saveBrandState(fromUrl);
      return;
    }

    try {
      let stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const legacy = localStorage.getItem(STORAGE_KEYS.legacyBrandTakeover);
        if (legacy) {
          stored = legacy;
          localStorage.setItem(STORAGE_KEY, legacy);
          localStorage.removeItem(STORAGE_KEYS.legacyBrandTakeover);
        }
      }

      if (stored) {
        const parsed = JSON.parse(stored);

        const now = Date.now();
        const storedTime = parsed._timestamp || 0;
        const daysSinceStored = (now - storedTime) / (1000 * 60 * 60 * 24);

        if (daysSinceStored < (parsed.expireDays || 7)) {
          if (parsed.logo) {
            parsed.logo = sanitizeExternalLogoUrl(parsed.logo);
          }
          setStoredState(parsed);
          return;
        }
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn("useBrandTakeover: Failed to restore brand state from localStorage:", e);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }

    setStoredState(null);
  }, [fromUrl]);

  return useMemo(() => fromUrl ?? storedState ?? DEFAULT_BRAND_STATE, [fromUrl, storedState]);
}
