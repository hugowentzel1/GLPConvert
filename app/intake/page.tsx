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
import { glpIntakeUi } from "@/lib/glp-intake-ui";
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
          {/**
           * Two stat strips sized to match the IntakeTrustStrip exactly:
           * same `intakeHeroShell` shell, same px-4/sm:px-6 py-5/sm:py-6
           * padding rhythm, same `mb-8` outside spacing as the trust
           * strip uses. Numbers reduced to ~h-9 visual weight
           * (text-[1.25rem] sm:text-[1.5rem]) so each stat tile occupies
           * roughly the same footprint as a trust-badge tile (icon +
           * label). Brand-color accent: tiny brand-color underline bar
           * beneath each number — adds a hint of tenant color WITHOUT
           * coloring the text itself (Stripe Atlas / Linear pattern:
           * accent-bar on stat tiles, not full text recolor).
           */}
          <div
            className="mx-auto mt-8 w-full max-w-4xl space-y-4 px-4"
            data-testid="intake-capability-strip"
          >
            {/* Strip 1 — Platform momentum */}
            <div
              className={`${glpIntakeUi.intakeHeroShell} bg-white/95 px-4 py-5 backdrop-blur-[2px] sm:px-6 sm:py-6`}
            >
              <p className="mb-5 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                On the platform
              </p>
              <div className="grid grid-cols-1 gap-y-5 text-center sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0">
                {[
                  { stat: "8,417", label: "demos modeled this month" },
                  { stat: "31%", label: "average lift in consult bookings" },
                  { stat: "100+", label: "clinic paths modeled to date" },
                ].map((item) => (
                  <div key={item.label} className="group flex flex-col items-center">
                    <div className="text-[1.5rem] font-black leading-none tracking-tight tabular-nums text-slate-900 sm:text-[1.65rem]">
                      {item.stat}
                    </div>
                    <span
                      aria-hidden
                      className="mt-1.5 block h-[3px] w-6 rounded-full transition-all duration-300 group-hover:w-10"
                      style={{ backgroundColor: "var(--brand-primary)" }}
                    />
                    <div className="mt-2.5 text-[10.5px] font-semibold uppercase leading-snug tracking-[0.14em] text-slate-500">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strip 2 — Category benchmarks */}
            <div
              className={`${glpIntakeUi.intakeHeroShell} bg-white/95 px-4 py-5 backdrop-blur-[2px] sm:px-6 sm:py-6`}
            >
              <p className="mb-5 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Category benchmarks
              </p>
              <div className="grid grid-cols-1 gap-y-5 text-center sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0">
                {[
                  { stat: "10–30%", label: "Illustrative lift in funnel completions" },
                  { stat: "<24h", label: "Typical time-to-live for white-label intake" },
                  { stat: "1-line", label: "Embed snippet works on any site or LP" },
                ].map((item) => (
                  <div key={item.label} className="group flex flex-col items-center">
                    <div className="text-[1.5rem] font-black leading-none tracking-tight tabular-nums text-slate-900 sm:text-[1.65rem]">
                      {item.stat}
                    </div>
                    <span
                      aria-hidden
                      className="mt-1.5 block h-[3px] w-6 rounded-full transition-all duration-300 group-hover:w-10"
                      style={{ backgroundColor: "var(--brand-primary)" }}
                    />
                    <div className="mt-2.5 text-[10.5px] font-semibold uppercase leading-snug tracking-[0.14em] text-slate-500">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
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
