"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { useCountdown } from "@/src/demo/useCountdown";
import { usePreviewQuota } from "@/src/demo/usePreviewQuota";
import { track } from "@/src/demo/track";
import { isIntakeBrandedMarketingMode } from "@/lib/glp-intake-demo-mode";
import { LAUNCH_BRANDED_CTA_LABEL, PRODUCT_NAME } from "@/lib/product-identity";
import { INTAKE_DEMO_BANNER_DISMISS_EVENT, INTAKE_DEMO_BANNER_DISMISS_KEY } from "@/lib/intake-demo-banner-dismiss";
import { buildIntakePricingHref, buildMarketingHomeHref } from "@/lib/glp-intake-nav-href";
import { parseGlpIntakeQueryBranding } from "@/lib/glp-intake-query-branding";

const INTAKE_TAGLINE = "Medical weight-loss intake";

function safeCompanyLabel(raw: string | null): string {
  if (!raw?.trim()) return "Your clinic";
  try {
    return decodeURIComponent(raw.trim());
  } catch {
    return raw.trim();
  }
}

function useIntakeDemoHover(reduceMotion: boolean | null | undefined) {
  if (reduceMotion) return {};
  return {
    whileHover: { y: -2, scale: 1.02 },
    whileTap: { scale: 0.99 },
    transition: { type: "spring" as const, stiffness: 420, damping: 28 },
  };
}

/**
 * Intake site chrome: mirrors `src/demo/DemoChrome.tsx` `DemoBanner` (preview strip, copy, dismiss,
 * private disclaimer row inside the same gradient box). No Pricing / Partners / Support.
 */
export default function IntakeDemoSiteHeader() {
  const sp = useSearchParams();
  const reduceMotion = useReducedMotion();
  const b = useBrandTakeover();
  const countdown = useCountdown(b.expireDays || 7);
  const { read } = usePreviewQuota(2);
  const remaining = read();
  const marketing = isIntakeBrandedMarketingMode(sp);
  const companyLabel = safeCompanyLabel(sp?.get("company") ?? null);
  const { primaryHex } = useMemo(() => parseGlpIntakeQueryBranding(sp), [sp]);
  const accent = primaryHex || "#0f172a";
  const hover = useIntakeDemoHover(reduceMotion ?? false);

  const [stripDismissed, setStripDismissed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(INTAKE_DEMO_BANNER_DISMISS_KEY) === "1") setStripDismissed(true);
    } catch {
      /* ignore */
    }
  }, []);

  const dismissStrip = useCallback(() => {
    try {
      sessionStorage.setItem(INTAKE_DEMO_BANNER_DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setStripDismissed(true);
    window.dispatchEvent(new Event(INTAKE_DEMO_BANNER_DISMISS_EVENT));
  }, []);

  const copyDemoLink = useCallback(() => {
    void navigator.clipboard.writeText(window.location.href);
    track("cta_click", { event: "cta_click", cta_type: "copy_link" });
  }, []);

  const brandVarStyle = useMemo(
    (): CSSProperties => ({
      ["--brand-primary" as string]: accent,
    }),
    [accent],
  );

  const homeHref = useMemo(() => buildMarketingHomeHref(sp), [sp]);

  const pricingHref = useMemo(() => buildIntakePricingHref(sp, companyLabel), [sp, companyLabel]);

  /** Preview strip: exclusive preview row + nav + disclaimer (reset dismiss key in lib if it hides forever). */
  const showDemoStrip = b.enabled && !stripDismissed && marketing;
  const showLaunchCta = marketing;

  const brandNavRow = (
    <div
      className="mx-auto flex h-auto min-h-[4rem] w-full max-w-2xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:min-h-[5rem]"
    >
      <Link
        href={homeHref}
        className="flex min-w-0 items-center gap-3 rounded-lg outline-none ring-offset-2 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-slate-900/20 md:gap-4"
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm md:h-12 md:w-12"
          style={{ backgroundColor: accent }}
          aria-hidden
        >
          GP
        </div>
        <div className="min-w-0 text-left">
          <p className="truncate text-lg font-black tracking-tight text-slate-900 md:text-2xl">{PRODUCT_NAME}</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 md:text-xs">
            {INTAKE_TAGLINE}
          </p>
        </div>
      </Link>

      {showLaunchCta ? (
        <motion.a
          href={pricingHref}
          className="intake-nav-activate relative inline-flex max-w-[min(100%,20rem)] shrink-0 items-center gap-2 overflow-hidden rounded-xl px-3 py-2.5 text-xs font-semibold text-white shadow-md transition-shadow hover:shadow-lg sm:gap-3 sm:px-5 sm:py-3 sm:text-sm"
          style={{ backgroundColor: accent }}
          data-intake-nav-activate
          aria-label={LAUNCH_BRANDED_CTA_LABEL}
          {...hover}
        >
          <span className="relative z-10 shrink-0 text-base sm:text-lg" aria-hidden>
            ⚡
          </span>
          <span className="relative z-10 min-w-0 text-center leading-snug">{LAUNCH_BRANDED_CTA_LABEL}</span>
        </motion.a>
      ) : null}
    </div>
  );

  return (
    <header
      className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md"
      data-intake-site-header
      style={brandVarStyle}
    >
      {showDemoStrip ? (
        <div
          data-intake-demo-banner-strip
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)",
            borderBottom: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Top: exclusive preview + runs + copy + dismiss */}
          {/* Mobile — DemoChrome */}
          <div className="block px-4 py-3 md:hidden">
            <div className="flex flex-col items-center gap-2.5 text-center">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "5px 12px",
                  background: "color-mix(in srgb, var(--brand-primary, #0f172a) 10%, white)",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--brand-primary, #0f172a)",
                  letterSpacing: "-0.01em",
                  lineHeight: "1.4",
                }}
              >
                {b.brand} Preview
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontSize: 12,
                  color: "#6B7280",
                  fontWeight: 500,
                  lineHeight: "1.5",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ whiteSpace: "nowrap" }}>
                  {remaining} {remaining === 1 ? "run" : "runs"} left
                </span>
                <span style={{ color: "#D1D5DB", fontSize: 10 }}>•</span>
                <span style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                  Expires {countdown.days}d {countdown.hours}h
                </span>
              </div>
            </div>
          </div>

          {/* Desktop — preview + runs + Copy demo link + ✕ (DemoChrome.tsx) */}
          <div
            className="hidden md:flex"
            style={{
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                alignItems: "center",
                minWidth: 0,
                flex: "1 1 auto",
              }}
              className="justify-start"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  background: "color-mix(in srgb, var(--brand-primary, #0f172a) 8%, white)",
                  borderRadius: 8,
                  border: "1px solid color-mix(in srgb, var(--brand-primary, #0f172a) 20%, white)",
                }}
              >
                <strong
                  style={{
                    whiteSpace: "nowrap",
                    fontSize: 15,
                    color: "var(--brand-primary, #0f172a)",
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  Exclusive preview for {b.brand} — expires in {countdown.days}d{" "}
                  {countdown.hours.toString().padStart(2, "0")}:{countdown.minutes.toString().padStart(2, "0")}:
                  {countdown.seconds.toString().padStart(2, "0")}
                </strong>
              </div>
              <span
                style={{
                  fontSize: 15,
                  color: "#6B7280",
                  whiteSpace: "nowrap",
                  fontWeight: 500,
                }}
              >
                {remaining} {remaining === 1 ? "run" : "runs"} left
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
              }}
              className="w-full justify-center md:w-auto md:justify-end"
            >
              <button
                type="button"
                className="btn"
                onClick={copyDemoLink}
                style={{
                  fontSize: 13,
                  padding: "8px 14px",
                  whiteSpace: "nowrap",
                  fontWeight: 500,
                  background: "white",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                Copy demo link
              </button>
              <button
                type="button"
                onClick={dismissStrip}
                aria-label="Dismiss"
                style={{
                  padding: "6px 10px",
                  fontSize: 18,
                  cursor: "pointer",
                  border: "none",
                  background: "transparent",
                  color: "#9CA3AF",
                  borderRadius: 6,
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f3f4f6";
                  e.currentTarget.style.color = "#6B7280";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#9CA3AF";
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Middle: GP / GLPConvert / Launch — between preview strip and private disclaimer */}
          <div className="border-t border-slate-100/90 bg-white/60">{brandNavRow}</div>

          {/* Bottom: private disclaimer */}
          <div
            className="border-t border-slate-100 px-4 py-2.5 text-center md:px-5 md:py-2"
            data-intake-private-demo-disclaimer
          >
            <p style={{ fontSize: 12, color: "#6B7280", fontWeight: 500, lineHeight: 1.5 }}>
              Private demo for <span style={{ color: "#374151", fontWeight: 500 }}>{companyLabel}</span>. Not
              affiliated.
            </p>
          </div>
        </div>
      ) : (
        brandNavRow
      )}
    </header>
  );
}
