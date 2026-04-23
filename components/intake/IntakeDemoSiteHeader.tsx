"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { isIntakeFlowPath } from "@/lib/marketing-intake-chrome-paths";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { useCountdown } from "@/src/demo/useCountdown";
import { usePreviewQuota } from "@/src/demo/usePreviewQuota";
import { track } from "@/src/demo/track";
import { isIntakeBrandedMarketingMode } from "@/lib/glp-intake-demo-mode";
import { LAUNCH_BRANDED_CTA_LABEL } from "@/lib/product-identity";
import { INTAKE_DEMO_BANNER_DISMISS_EVENT, INTAKE_DEMO_BANNER_DISMISS_KEY } from "@/lib/intake-demo-banner-dismiss";
import { parseGlpIntakeQueryBranding } from "@/lib/glp-intake-query-branding";
import {
  buildAppHomeHref,
  buildBrandedDemoReturnHref,
  buildIntakePricingHref,
  buildMarketingPathHref,
} from "@/lib/glp-intake-nav-href";
import { getProxiedLogoUrl } from "@/lib/logoProxy";

function safeCompanyLabel(raw: string | null): string {
  if (!raw?.trim()) return "Your clinic";
  try {
    return decodeURIComponent(raw.trim());
  } catch {
    return raw.trim();
  }
}

/**
 * Intake site chrome: preview strip (when marketing + brand takeover) and main row aligned with
 * `sunspire-clean` / `SharedNavigation` — `h-20`, `space-x-12`, `btn-primary ml-12` (Privacy lives in
 * the disclaimer line, not the top nav, matching that demo’s three links + CTA).
 */
export default function IntakeDemoSiteHeader() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const b = useBrandTakeover();
  const countdown = useCountdown(b.expireDays || 7);
  const { read } = usePreviewQuota(2);
  const remaining = read();
  const marketing = isIntakeBrandedMarketingMode(sp);
  const companyLabel = safeCompanyLabel(sp?.get("company") ?? null);
  const { primaryHex, logoUrl: queryLogoUrl } = useMemo(() => parseGlpIntakeQueryBranding(sp), [sp]);
  const accent = primaryHex || "#0f172a";
  const rawLogoUrl = b.enabled && b.logo ? b.logo : queryLogoUrl;
  const proxiedLogoUrl = getProxiedLogoUrl(rawLogoUrl);
  const navTitle = b.enabled ? b.brand : companyLabel;
  const navSubtitle = b.enabled ? "Branded intake" : "Branded preview";

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
      ["--brand" as string]: accent,
    }),
    [accent],
  );

  const homeHref = useMemo(
    () => (marketing ? buildBrandedDemoReturnHref(sp) : buildAppHomeHref(sp)),
    [sp, marketing],
  );
  const pricingHref = useMemo(() => buildIntakePricingHref(sp, companyLabel), [sp, companyLabel]);
  const partnersHref = useMemo(() => buildMarketingPathHref(sp, "/partners"), [sp]);
  const supportHref = useMemo(() => buildMarketingPathHref(sp, "/support"), [sp]);
  /** All pages that use this header (intake, partners, privacy, …) get the same preview strip in branded demo mode. */
  const showDemoStrip = b.enabled && !stripDismissed && marketing;
  const showLaunchCta = marketing;
  /** "Private demo…" belongs on the live intake form surface, not on static marketing/legal subpages. */
  const showPrivateDemoDisclaimer = b.enabled && marketing && isIntakeFlowPath(pathname);

  const brandMainRow = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={brandVarStyle}>
      <div className="flex h-20 min-w-0 items-center justify-center gap-4 md:justify-between">
        <Link
          href={homeHref}
          className="flex min-w-0 items-center gap-4 transition-opacity hover:opacity-80 md:min-w-0 md:flex-1"
        >
          {proxiedLogoUrl ? (
            <Image
              src={proxiedLogoUrl}
              unoptimized
              alt={`${navTitle} logo`}
              width={48}
              height={48}
              className="rounded-lg shrink-0"
              style={{
                objectFit: "contain",
                width: "48px",
                height: "48px",
                minWidth: "48px",
                minHeight: "48px",
                maxWidth: "48px",
                maxHeight: "48px",
              }}
            />
          ) : (
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: accent }}
              aria-hidden
            >
              <span className="text-white text-lg font-bold" aria-hidden>
                ⚕️
              </span>
            </div>
          )}
          <div className="min-w-0 text-left">
            <h1 className="text-2xl font-black text-[var(--brand-primary)] truncate">{navTitle}</h1>
            <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
              {navSubtitle}
            </p>
          </div>
        </Link>

        {showLaunchCta ? (
          <nav
            className="relative z-10 hidden shrink-0 items-center gap-5 text-sm md:flex lg:gap-6"
            aria-label="Product links"
          >
            <Link
              href={pricingHref}
              className="shrink-0 font-medium text-gray-600 transition-colors hover:text-[var(--brand-primary)]"
            >
              Pricing
            </Link>
            <Link
              href={partnersHref}
              className="shrink-0 font-medium text-gray-600 transition-colors hover:text-[var(--brand-primary)]"
            >
              Partners
            </Link>
            <Link
              href={supportHref}
              className="shrink-0 font-medium text-gray-600 transition-colors hover:text-[var(--brand-primary)]"
            >
              Support
            </Link>
            <Link
              href={pricingHref}
              className="btn-primary inline-flex shrink-0 items-center justify-center px-5 py-2.5 text-sm font-semibold"
              data-intake-nav-activate
            >
              <span className="mr-3" aria-hidden>
                ⚡
              </span>
              <span>{LAUNCH_BRANDED_CTA_LABEL}</span>
            </Link>
          </nav>
        ) : null}
      </div>
    </div>
  );

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b border-gray-200/30 shadow-sm"
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
                  {countdown.hours.toString().padStart(2, "0")}:
                  {countdown.minutes.toString().padStart(2, "0")}:
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

          <div className="border-t border-gray-200/30 bg-white">{brandMainRow}</div>

          {showPrivateDemoDisclaimer ? (
            <div className="border-t border-gray-100 bg-gray-50/50" data-intake-private-demo-disclaimer>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <p className="text-xs text-gray-500 text-center">
                  Private demo for <span className="text-gray-600 font-medium">{b.brand || companyLabel}</span>. Not
                  affiliated.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div>
          {brandMainRow}
          {showPrivateDemoDisclaimer ? (
            <div className="border-t border-gray-100 bg-gray-50/50" data-intake-private-demo-disclaimer>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <p className="text-xs text-gray-500 text-center">
                  Private demo for <span className="text-gray-600 font-medium">{b.brand || companyLabel}</span>. Not
                  affiliated.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </header>
  );
}
