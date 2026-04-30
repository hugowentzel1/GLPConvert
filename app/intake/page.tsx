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
           * Social-proof signals on the cold-email landing — same set
           * that the home demo card uses, mirrored here because cold-
           * email URLs land on /intake (per the canonical demo URL
           * pattern in MASTER_TODO). Without these, the cold-email
           * buyer never sees the trust signals before scrolling into
           * the intake funnel itself. CXL 2024: trust signals must
           * appear ABOVE the conversion ask, not buried below.
           */}
          <div
            className="mx-auto mt-8 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-500"
            data-testid="intake-shipping-indicator"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>Active development · last shipped April 2026</span>
          </div>

          <div
            className="mx-auto mt-6 max-w-3xl space-y-3 px-4 text-center"
            data-testid="intake-vertical-specificity"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Made for the GLP-1 clinic stack
            </p>
            <p className="text-[14px] leading-relaxed text-slate-700">
              Built specifically for clinics running GLP-1 / medical weight-loss programs — not adapted from
              generic intake software. Plugs into the tools you already pay for:
            </p>
            <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12px] font-semibold text-slate-700">
              <span>HubSpot</span>
              <span aria-hidden className="text-slate-300">·</span>
              <span>Salesforce</span>
              <span aria-hidden className="text-slate-300">·</span>
              <span>Pipedrive</span>
              <span aria-hidden className="text-slate-300">·</span>
              <span>GoHighLevel</span>
              <span aria-hidden className="text-slate-300">·</span>
              <span>Calendly</span>
              <span aria-hidden className="text-slate-300">·</span>
              <span>Zapier</span>
            </p>
          </div>

          <div
            className="mx-auto mt-6 flex max-w-3xl flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-6"
            data-testid="intake-tech-stack-proof"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Built on infrastructure clinics already trust
            </p>
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[12px] font-medium text-slate-600">
              <span className="font-semibold text-slate-800">Stripe</span>
              <span aria-hidden className="text-slate-300">·</span>
              <span className="font-semibold text-slate-800">Supabase</span>
              <span aria-hidden className="text-slate-300">·</span>
              <span className="font-semibold text-slate-800">Resend</span>
              <span aria-hidden className="text-slate-300">·</span>
              <span className="font-semibold text-slate-800">Vercel</span>
              <span aria-hidden className="text-slate-300">·</span>
              <span className="font-semibold text-slate-800">Sentry</span>
            </p>
          </div>

          <div
            className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-4 sm:gap-3"
            data-testid="intake-capability-strip"
          >
            {[
              { stat: "<24h", label: "Time-to-live after checkout" },
              { stat: "1-line", label: "Embed snippet for any site" },
              { stat: "3-channel", label: "Lead delivery (dashboard + email + CRM)" },
              { stat: "HIPAA-ready", label: "Encrypted in transit · BAA available" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200/70 bg-white px-3 py-3 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              >
                <p className="text-[15px] font-semibold tracking-tight text-slate-900">{item.stat}</p>
                <p className="mt-1 text-[11px] leading-snug text-slate-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <AttributionPixels />
      <IntakeIframeAutoResize />
      <GlpSimulationFunnel />
    </IntakePageFrame>
  );
}
