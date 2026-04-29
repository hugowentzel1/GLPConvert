"use client";

import { useEffect } from "react";

/**
 * Iframe auto-resize emitter for embedded GLPConvert intake.
 *
 * Posts the document's scroll height to the parent window whenever it
 * changes. Pattern follows the de facto industry protocol used by
 * Calendly / Cal.com / HubSpot Forms / Tally / Typeform / Stripe
 * Checkout: a single `glpconvert:resize` message with `{ height }` is
 * emitted on `load`, `resize`, and any DOM mutation that changes the
 * page's scroll height.
 *
 * Notes:
 *
 *  - We render in *every* intake mount (not just `embed=1`) because the
 *    parent window only listens when it's expecting it; outside of an
 *    iframe `postMessage(*, "*")` is a no-op.
 *
 *  - We send `targetOrigin: "*"` because the parent's origin is the
 *    *clinic's* domain, which we don't know in advance. This is safe
 *    because we never include sensitive data in the message — only the
 *    height integer.
 *
 *  - The companion JS the buyer pastes on their parent page (documented
 *    in `/docs/embed`) listens for `glpconvert:resize` and sets the
 *    iframe's `height` attribute. If they paste the iframe without the
 *    listener, fallback `min-height` in the snippet keeps the funnel
 *    usable.
 */
export default function IntakeIframeAutoResize() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.parent === window) return; // not in an iframe — nothing to do
    let last = 0;
    const send = () => {
      try {
        const h = Math.max(
          document.documentElement.scrollHeight,
          document.body?.scrollHeight ?? 0,
        );
        if (h && h !== last) {
          last = h;
          window.parent.postMessage({ type: "glpconvert:resize", height: h }, "*");
        }
      } catch {
        // ignore — host may have CSP that blocks postMessage; not fatal
      }
    };
    send();
    const onResize = () => send();
    window.addEventListener("resize", onResize);
    window.addEventListener("load", send);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(send);
      ro.observe(document.body);
    }
    /** Fallback poll covers cases where ResizeObserver fires before content paints. */
    const interval = window.setInterval(send, 1500);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", send);
      ro?.disconnect();
      window.clearInterval(interval);
    };
  }, []);
  return null;
}
