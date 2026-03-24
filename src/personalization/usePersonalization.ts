"use client";

import { useEffect, useMemo, useState } from "react";

const ALLOWED_LOGO_HOSTS = new Set([
  "res.cloudinary.com",
  "i.imgur.com",
  "images.unsplash.com",
  "logo.clearbit.com",
  "cdn.jsdelivr.net",
]);

function sanitizeBrand(s: string | null): string | null {
  if (!s) return null;
  // strip HTML-ish stuff, trim, clamp
  const clean = s.replace(/[<>]/g, "").trim().slice(0, 40);
  return clean || null;
}

function normalizeHex(hex: string | null, fallback = "#FFA63D"): string {
  if (!hex) return fallback;
  const h = hex.startsWith("#") ? hex : `#${hex}`;
  return /^#[0-9a-fA-F]{6}$/.test(h) ? h.toUpperCase() : fallback;
}

function allowedLogo(urlStr: string | null): string | null {
  if (!urlStr) return null;
  try {
    const u = new URL(urlStr);
    if (u.protocol !== "https:") return null;
    if (!ALLOWED_LOGO_HOSTS.has(u.hostname)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export type Personalization = {
  brand: string | null;
  primary: string; // always a valid hex
  logo: string | null;
  isPersonalized: boolean;
};

export function usePersonalization(): Personalization {
  const [state, setState] = useState<Personalization>({
    brand: null,
    primary: "#FFA63D",
    logo: null,
    isPersonalized: false,
  });

  useEffect(() => {
    // Parse once on client to avoid blocking SSR
    const sp = new URLSearchParams(window.location.search);
    const brand = sanitizeBrand(sp.get("brand"));
    const primary = normalizeHex(sp.get("primary"));
    const logo = allowedLogo(sp.get("logo"));
    setState({
      brand,
      primary,
      logo,
      isPersonalized: Boolean(brand || sp.get("primary") || logo),
    });
  }, []);

  // stable ref
  return useMemo(() => state, [state]);
}

export const ALLOWED_LOGO_HOSTS_LIST = Array.from(ALLOWED_LOGO_HOSTS);
