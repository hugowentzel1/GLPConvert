"use client";
import { useEffect } from "react";
import { useBrandTakeover } from "./useBrandTakeover";

export default function NavBrandOverride() {
  const b = useBrandTakeover();
  useEffect(() => {
    if (!b.enabled) return;
    const selectors = [
      "[data-app-brand]",
      ".app-brand",
      "header .brand",
      "header img[alt*='Sunspire' i]",
      "header [aria-label*='Sunspire' i]",
    ];
    document.querySelectorAll(selectors.join(",")).forEach((el) => {
      const node = el as HTMLElement;
      node.style.visibility = "hidden";
      node.style.pointerEvents = "none";
      node.setAttribute("data-vendor-hidden", "true");
    });
  }, [b.enabled]);
  return null;
}
