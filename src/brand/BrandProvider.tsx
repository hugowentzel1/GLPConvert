"use client";
import React, { useEffect } from "react";
import { useBrandTakeover } from "./useBrandTakeover";
import { useSearchParams } from "next/navigation";
import { PRODUCT_NAME } from "@/lib/product-identity";

export default function BrandProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const b = useBrandTakeover();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlBrandColor = searchParams?.get("brandColor");
    const urlPrimary = searchParams?.get("primary");
    const urlBrand = searchParams?.get("brand");
    const urlCompany = searchParams?.get("company");
    const urlBrandAsHex =
      urlCompany &&
      urlBrand &&
      /^#?[0-9a-fA-F]{6}$/.test(urlBrand.replace(/^#/, ""))
        ? urlBrand.startsWith("#")
          ? urlBrand
          : `#${urlBrand}`
        : null;

    let color = b.primary;
    if (urlBrandColor) {
      color = urlBrandColor.startsWith("#") ? urlBrandColor : `#${urlBrandColor}`;
    } else if (urlPrimary) {
      color = urlPrimary.startsWith("#") ? urlPrimary : `#${urlPrimary}`;
    } else if (urlBrandAsHex) {
      color = urlBrandAsHex;
    } else if (urlBrand) {
      color = b.primary;
    }

    document.documentElement.style.setProperty("--brand-primary", color);
    document.documentElement.style.setProperty("--brand", color);
  }, [b.primary, searchParams]);

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
      } catch {
        /* already removed */
      }
    };
  }, [b.enabled, b.logo, b.primary]);

  useEffect(() => {
    if (!b.enabled) return;
    document.title = `${b.brand} — ${PRODUCT_NAME}`;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.appendChild(meta);
    return () => {
      try {
        if (meta.parentNode) {
          document.head.removeChild(meta);
        }
      } catch {
        /* already removed */
      }
    };
  }, [b.enabled, b.brand]);

  return <>{children}</>;
}
