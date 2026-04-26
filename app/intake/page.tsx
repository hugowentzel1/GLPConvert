/* @cache-bust: 2026-04-25T21:35 redo pass: darker rules, owner block rebuild, nav unification, lead-save fallback */

import { Suspense } from "react";
import GlpSimulationFunnel from "@/components/intake/GlpSimulationFunnel";
import AttributionPixels from "@/components/attribution/AttributionPixels";
import IntakeDemoQuoteStrip from "@/components/intake/IntakeDemoQuoteStrip";
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
      {demo ? (
        <div
          className="w-full border-t border-slate-300/80 pt-10 pb-6 md:pt-12 md:pb-8"
          data-intake-demo-social-proof
        >
          <IntakeDemoQuoteStrip />
        </div>
      ) : null}
      <AttributionPixels />
      <GlpSimulationFunnel />
    </IntakePageFrame>
  );
}
