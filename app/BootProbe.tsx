"use client";
import { useEffect } from "react";

export default function BootProbe() {
  useEffect(() => {
    (window as any).__BOOT_OK__ = true;

    const t = setTimeout(() => {
      // If nothing has marked content visible after 6s, force-hide overlays.
      if (!(window as any).__CONTENT_SHOWN__) {
        console.warn("[boot] failsafe: forcing content visible");
        document.documentElement.classList.add("force-show");
      }
    }, 6000);

    return () => clearTimeout(t);
  }, []);

  return null;
}
