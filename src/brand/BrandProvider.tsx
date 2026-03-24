"use client";
import React, { useEffect } from "react";
import { useBrandTakeover } from "./useBrandTakeover";
import { useSearchParams } from "next/navigation";

export default function BrandProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const b = useBrandTakeover();
  const searchParams = useSearchParams();

  // CSS var theme
  useEffect(() => {
    console.log(
      "BrandProvider: enabled=",
      b.enabled,
      "primary=",
      b.primary,
      "brand=",
      b.brand,
    );
    // Always check for URL parameters, even if brand takeover is not enabled

    // Check if URL has brandColor parameter - if so, use that instead of forced colors
    const urlBrandColor = searchParams?.get('brandColor');
    console.log("BrandProvider: URL brandColor parameter:", urlBrandColor);
    console.log("BrandProvider: All search params:", searchParams?.toString());
    
    if (urlBrandColor) {
      const cleanColor = urlBrandColor.startsWith('#') ? urlBrandColor : `#${urlBrandColor}`;
      document.documentElement.style.setProperty("--brand-primary", cleanColor);
      document.documentElement.style.setProperty("--brand", cleanColor);
      console.log("BrandProvider: Using URL brand color:", cleanColor);
      return;
    }
    
    // Also check for primary parameter
    const urlPrimary = searchParams?.get('primary');
    if (urlPrimary) {
      const cleanColor = urlPrimary.startsWith('#') ? urlPrimary : `#${urlPrimary}`;
      document.documentElement.style.setProperty("--brand-primary", cleanColor);
      document.documentElement.style.setProperty("--brand", cleanColor);
      console.log("BrandProvider: Using URL primary color:", cleanColor);
      return;
    }

    // Only apply forced colors if no URL parameters are present
    if (!urlBrandColor && !urlPrimary) {
      // Force correct brand colors based on company name
      let forcedColor = b.primary;
    if (b.brand.toLowerCase() === "tesla") {
      forcedColor = "#CC0000";
      console.log("BrandProvider: Forcing Tesla red:", forcedColor);
    } else if (b.brand.toLowerCase() === "apple") {
      // Don't force Apple blue - respect URL parameters
      forcedColor = b.primary;
      console.log("BrandProvider: Using Apple primary color:", forcedColor);
    } else if (b.brand.toLowerCase() === "netflix") {
      forcedColor = "#E50914";
      console.log("BrandProvider: Forcing Netflix red:", forcedColor);
    } else if (b.brand.toLowerCase() === "google") {
      forcedColor = "#4285F4";
      console.log("BrandProvider: Forcing Google blue:", forcedColor);
    } else if (b.brand.toLowerCase() === "microsoft") {
      forcedColor = "#00A4EF";
      console.log("BrandProvider: Forcing Microsoft blue:", forcedColor);
    } else if (b.brand.toLowerCase() === "amazon") {
      forcedColor = "#FF9900";
      console.log("BrandProvider: Forcing Amazon orange:", forcedColor);
    } else if (
      b.brand.toLowerCase() === "meta" ||
      b.brand.toLowerCase() === "facebook"
    ) {
      forcedColor = "#1877F2";
      console.log("BrandProvider: Forcing Meta blue:", forcedColor);
    }

      document.documentElement.style.setProperty("--brand-primary", forcedColor);
      document.documentElement.style.setProperty("--brand", forcedColor);
      console.log("BrandProvider: CSS variables set to", forcedColor);
    }
  }, [b.enabled, b.primary, b.brand, searchParams]);

  // Favicon override
  useEffect(() => {
    if (!b.enabled) return;
    const link =
      document.querySelector('link[rel="icon"]') ||
      document.createElement("link");
    link.setAttribute("rel", "icon");
    link.setAttribute(
      "href",
      b.logo
        ? b.logo
        : `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='8' r='8' fill='${encodeURIComponent(b.primary)}'/></svg>`,
    );
    document.head.appendChild(link);
    return () => {
      try {
        if (link.parentNode) {
          document.head.removeChild(link);
        }
      } catch (e) {
        // Element may have already been removed
      }
    };
  }, [b.enabled, b.logo, b.primary]);

  // Title + robots
  useEffect(() => {
    if (!b.enabled) return;
    document.title = `${b.brand} — Solar Intelligence`;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.appendChild(meta);
    return () => {
      try {
        if (meta.parentNode) {
          document.head.removeChild(meta);
        }
      } catch (e) {
        // Element may have already been removed
      }
    };
  }, [b.enabled, b.brand]);

  return <>{children}</>;
}
// Force deployment Fri Sep 19 23:01:31 EDT 2025
