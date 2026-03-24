"use client";
import { useEffect } from "react";

type Props = {
  /** CSS selectors to try in order to find the cookie banner element */
  selectors?: string[];
  /** If true, set a data attribute when cookie is visible to optionally hide sticky CTA */
  setVisibilityAttr?: boolean;
};

export default function CookieOffsetProvider({
  selectors = [
    "#cookie-banner",
    ".cookie-banner",
    ".cookie-consent",
    ".cc-window",
    ".adept-cookie-cta",  // add/adjust to your Adept cookie CTA class if known
  ],
  setVisibilityAttr = true,
}: Props) {
  useEffect(() => {
    const root = document.documentElement;

    const findBanner = () => {
      for (const sel of selectors) {
        const el = document.querySelector<HTMLElement>(sel);
        if (el) return el;
      }
      return null;
    };

    let banner = findBanner();

    const update = () => {
      banner = banner || findBanner();
      const h = banner && (banner.offsetParent !== null || getComputedStyle(banner).position === 'fixed')
        ? (banner.getBoundingClientRect().height || banner.offsetHeight || 0)
        : 0;
      root.style.setProperty("--cookie-offset", `${Math.ceil(h)}px`);
      if (setVisibilityAttr) {
        if (h > 0) root.setAttribute("data-cookie-visible", "true");
        else root.removeAttribute("data-cookie-visible");
      }
    };

    // Observe DOM changes (banner mounts/unmounts) & resize (height changes)
    const mo = new MutationObserver(update);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class", "hidden", "aria-hidden"] });

    const ro = new ResizeObserver(update);
    if (banner) ro.observe(banner);

    // Polling fallback (some consent UIs animate in)
    const id = window.setInterval(update, 500);
    update();

    return () => {
      mo.disconnect();
      ro.disconnect();
      window.clearInterval(id);
      root.style.removeProperty("--cookie-offset");
      root.removeAttribute("data-cookie-visible");
    };
  }, [selectors, setVisibilityAttr]);

  return null;
}
