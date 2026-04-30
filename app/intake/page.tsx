/* @cache-bust: 2026-04-28 pass 8: patient-view banner, embed preview page, step-2 WOW order, chart % counter */

import { Suspense } from "react";
import GlpSimulationFunnel from "@/components/intake/GlpSimulationFunnel";
import AttributionPixels from "@/components/attribution/AttributionPixels";
import IntakeDemoQuoteStrip from "@/components/intake/IntakeDemoQuoteStrip";
import IntakeIframeAutoResize from "@/components/intake/IntakeIframeAutoResize";
import IntakePageFrame from "@/components/intake/IntakePageFrame";
import IntakePageHeader from "@/components/intake/IntakePageHeader";
import IntakeSearchParamsSanitizer from "@/components/intake/IntakeSearchParamsSanitizer";
import {
  isIntakeBrandedMarketingMode,
  toUrlSearchParamsFromIntakePage,
} from "@/lib/glp-intake-demo-mode";
import { PRODUCT_NAME } from "@/lib/product-identity";
import type { Metadata } from "next";

/**
 * Intake is per-visitor: copy, branding, logo, color, and CTA targets are all driven by
 * `?company=`, `?brand=`, `?logo=`, UTMs, etc. Force dynamic SSR so Vercel never caches a
 * stale prerendered HTML at the edge — every cold-email click should see the *current* build.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Intake — ${PRODUCT_NAME}`,
  description:
    "Branded pre-consult path: clarity, typical ranges, then your scheduling link. General information only.",
};

export default function IntakePage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const demo = isIntakeBrandedMarketingMode(toUrlSearchParamsFromIntakePage(searchParams));

  return (
    <IntakePageFrame demoServerHint={demo}>
      <Suspense fallback={null}>
        <IntakeSearchParamsSanitizer />
      </Suspense>
      <IntakePageHeader />
      {/**
       * Removed inline IntakePatientViewBanner. Cold-email buyers are
       * already oriented by (a) the top demo strip with company name +
       * countdown, (b) the IntakePageHeader showing the brand logo +
       * "Branded intake", and (c) the explicit "Private demo for X.
       * Not affiliated." line. CXL 2024 trust-vs-noise: stack the
       * orientation cues, don't repeat them. The dedicated banner was
       * the third orientation surface in the same column inch and
       * read as visual chrome rather than as content.
       */}
      {demo ? (
        <div
          className="w-full border-t border-slate-200 pt-10 pb-6 md:pt-12 md:pb-8"
          data-intake-demo-social-proof
        >
          <IntakeDemoQuoteStrip />

          {/**
           * Stat tiles — Sunspire-style hero stats pattern (3-up grid,
           * monumental tabular-nums numbers + small uppercase descriptor
           * below; brand-color visible by default on the number, lifts
           * to deeper brand on hover). Honest: every claim sourced in
           * data/trust.json (category-norm time-to-live, illustrative
           * modeled lift, demo-led motion). NO fabricated customer
           * counts. CXL 2024 + FTC 2024 Endorsement Guides: at pre-
           * PMF stage, surface category-norm + illustrative-lift +
           * mechanism stats instead of unverifiable usage numbers.
           *
           * Pattern source: `/Users/hugowentzel/sunspire-clean/app/page.tsx`
           * hero stats — `text-4xl font-black font-mono` + brand-color
           * hover transition. Same three-row rhythm that anchored
           * Sunspire's home conversion.
           */}
          <div
            className="mx-auto mt-12 max-w-4xl px-4"
            data-testid="intake-capability-strip"
          >
            <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50/50 to-white px-6 py-10 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:px-12 sm:py-12">
              <div className="grid grid-cols-1 gap-y-10 text-center sm:grid-cols-3 sm:gap-x-12 sm:gap-y-0 sm:divide-x sm:divide-slate-200/70">
                {[
                  { stat: "10–30%", label: "Illustrative lift in funnel completions" },
                  { stat: "<24h", label: "Typical time-to-live for white-label intake" },
                  { stat: "1-line", label: "Embed snippet works on any site or LP" },
                ].map((item) => (
                  <div key={item.label} className="group sm:px-6">
                    <div
                      className="text-[2.75rem] font-black leading-none tracking-tight tabular-nums transition-all duration-300 group-hover:scale-[1.04] sm:text-[3rem]"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      {item.stat}
                    </div>
                    <div className="mt-3 text-[11px] font-semibold uppercase leading-snug tracking-[0.14em] text-slate-500">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-center text-[11px] leading-relaxed text-slate-400">
                Category-norm references — not guaranteed outcomes for any individual clinic.
              </p>
            </div>
          </div>
        </div>
      ) : null}
      <AttributionPixels />
      <IntakeIframeAutoResize />
      <GlpSimulationFunnel />
    </IntakePageFrame>
  );
}
