"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { sanitizeFirstHttpsUrl } from "@/lib/sanitize-booking-url";

const BOOKING_KEYS = ["booking", "book", "booking_url"] as const;

/**
 * Fixes malformed intake URLs where `booking` was pasted/concatenated with a second
 * `http(s)://...` (common copy-paste bug). Replaces history with a clean query string.
 */
export default function IntakeSearchParamsSanitizer() {
  const sp = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current || !sp || !pathname) return;
    const id = window.requestAnimationFrame(() => {
      let changed = false;
      const next = new URLSearchParams(sp.toString());
      for (const k of BOOKING_KEYS) {
        const raw = next.get(k);
        if (!raw) continue;
        let decoded = raw;
        try {
          decoded = decodeURIComponent(raw);
        } catch {
          /* use raw */
        }
        const fixed = sanitizeFirstHttpsUrl(decoded);
        if (fixed && fixed !== decoded) {
          next.set(k, fixed);
          changed = true;
        }
      }
      if (changed) {
        ran.current = true;
        const qs = next.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, [sp, pathname, router]);

  return null;
}
