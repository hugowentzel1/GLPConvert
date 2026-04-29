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
        </div>
      ) : null}
      <AttributionPixels />
      <IntakeIframeAutoResize />
      <GlpSimulationFunnel />
    </IntakePageFrame>
  );
}
