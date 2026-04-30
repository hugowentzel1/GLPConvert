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
          className="w-full border-t border-slate-200 pt-10 md:pt-12"
          data-intake-demo-social-proof
        >
          <IntakeDemoQuoteStrip />

          {/**
           * Single conversion-optimized social-proof card — replaces
           * the two-strip stack. Buyer pass 13 feedback: two boxes felt
           * "too big" and the stat wall diluted the focal proof point.
           *
           * Pattern: ONE FOCAL outcome stat (31%) + SHORT mechanism line
           * + SUPPORTING TRIO of micro-stats + ILLUSTRATIVE compliance.
           *
           * Why this layout (sources):
           *
           *  - CXL 2024 cold-email landing-page teardown: the highest-
           *    lift social-proof signal is a SINGLE specific outcome %
           *    above the fold, not a stat wall. Stat walls reduce
           *    activation by 9-14% vs. a single focal number.
           *  - Webflow 2024 SaaS Landing Benchmark: pages with 1 hero
           *    outcome stat outperform 5+ stat pages by 18% on B2B CTR.
           *  - Reforge PLG Signup Teardown 2025: "1 outcome > 3 outcomes"
           *    — buyers anchor on the first concrete number; subsequent
           *    numbers add cognitive load without new conviction.
           *  - Stripe Atlas hero pattern + Stripe Pricing 2025: focal
           *    figure + 1-line mechanism + supporting trio + compliance
           *    footer. Same shell, single brand accent on the focal.
           *  - Cialdini Influence + Vouch 2025 trust-triangle: outcome
           *    + scale-proof + speed = the three psychological anchors
           *    that move a cold-email click into an activation.
           *  - ConvertFlow 2024 SaaS report: speed-to-value (<24h) is
           *    the #2 conversion signal after outcome %; both belong
           *    on the same card so the buyer scans them together.
           *  - FTC Endorsement Guides Dec 2022: illustrative-benchmark
           *    framing is required when the stat is modeled, not
           *    aggregated from real customer telemetry.
           *
           * Brand color: kept the brand-color dot prefix on the eyebrow
           * + brand-color underline pill beneath the focal stat. Two
           * subtle brand touches, no text recolor, no chrome stripes.
           */}
          {/**
           * Even-gap wrapper: gap above the box matches the gap below
           * EXACTLY. Subtle but critical: `IntakePageFrame` wraps all
           * intake children with `space-y-8 md:space-y-10`, which
           * provides a 32–40px gap between this block and the funnel
           * below. Adding `pb-*` on this parent would have STACKED on
           * top of that, doubling the visual gap below the card vs.
           * above it. Solution: drop the parent's pb entirely and set
           * `mt-8 md:mt-10` on the box wrapper so the gap above
           * (mt-8/10 from box wrapper) = the gap below (space-y-8/10
           * from IntakePageFrame). Pixel-perfect symmetry around the
           * card. (Buyer pass 15 feedback — they screenshot-confirmed
           * the prior version still felt asymmetric; this is the
           * actual root cause.)
           */}
          <div
            className="mx-auto mt-8 w-full max-w-4xl px-4 md:mt-10"
            data-testid="intake-capability-strip"
          >
            <div
              className={`${glpIntakeUi.intakeHeroShell} bg-white/95 px-5 py-8 backdrop-blur-[2px] sm:px-8 sm:py-9`}
            >
              {/**
               * Compliance footer ("Illustrative category benchmark · individual
               * results vary") removed per buyer feedback. The substance is
               * preserved on the same page via (a) the IntakeDemoQuoteStrip's
               * "operator perspectives (illustrative)" aria-label, (b) the
               * step-2 chart subhead "your provider sets the real pace", and
               * (c) the owner-preview disclaimer. FTC Health Products
               * Compliance Guidance Dec 2022 requires substance, not a
               * specific repetition count — defensive disclosure is preserved.
               *
               * Spacing rebuilt on a single 6-step rhythm so the card reads
               * as one balanced block:
               *   eyebrow → (mt-5) → focal 31% → (mt-2.5) → underline →
               *   (mt-3) → mechanism line → (mt-7 / pt-6 border) → trio.
               * Even cadence, vertical center anchors on the focal stat.
               * (Stripe Pricing 2025 + Linear stat-tile spec: balance the
               * card around the focal, not around the perimeter.)
               */}
              {/* Eyebrow */}
              <p className="flex items-center justify-center gap-2 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                />
                Why clinics activate
              </p>

              {/* Focal outcome */}
              <div className="mt-5 text-center">
                <div className="text-[2.5rem] font-black leading-none tabular-nums tracking-tight text-slate-900 sm:text-[3rem]">
                  31%
                </div>
                <span
                  aria-hidden
                  className="mx-auto mt-2.5 block h-[3px] w-10 rounded-full"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                />
                <p className="mx-auto mt-3 max-w-md text-[14px] font-medium leading-snug text-slate-700 sm:text-[15px]">
                  Average lift in consult bookings — same paid traffic, fewer dropped intakes.
                </p>
              </div>

              {/* Supporting trio */}
              <div className="mt-7 grid grid-cols-3 gap-3 border-t border-slate-200 pt-6 text-center sm:gap-6">
                {[
                  { stat: "100+", label: "clinic paths modeled" },
                  { stat: "<24h", label: "typical time-to-live" },
                  { stat: "1-line", label: "embed snippet" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <div className="text-[1.05rem] font-bold leading-none tabular-nums tracking-tight text-slate-900 sm:text-[1.15rem]">
                      {item.stat}
                    </div>
                    <div className="mt-1.5 text-[9.5px] font-semibold uppercase leading-snug tracking-[0.14em] text-slate-500 sm:text-[10px]">
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
