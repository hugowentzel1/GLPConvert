import { Suspense } from "react";
import GlpSimulationFunnel from "@/components/intake/GlpSimulationFunnel";
import AttributionPixels from "@/components/attribution/AttributionPixels";
import { PLATFORM_DISPLAY_NAME, PRODUCT_NAME } from "@/lib/product-identity";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Intake — ${PRODUCT_NAME}`,
  description:
    "White-label pre-consult path: clarity, expectations, and consult readiness before you share contact details.",
};

export default function IntakePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_90%_50%_at_50%_-8%,rgba(99,102,241,0.08),transparent)] bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-10 md:py-16">
      <div className="mx-auto mb-12 max-w-2xl space-y-5 text-center md:mb-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{PLATFORM_DISPLAY_NAME}</p>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900 md:text-[2.125rem] md:leading-snug">
          Pre-consult clarity through to your booking link
        </h1>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-600 md:text-[15px]">
          White-label path for GLP-1 programs: set expectations and typical ranges before contact, then hand off to{" "}
          <span className="font-medium text-slate-800">your</span> scheduler. Educational only — not medical advice.
        </p>
        <p className="mx-auto max-w-xl text-xs leading-relaxed text-slate-500">
          <strong className="font-semibold text-slate-600">Demo link</strong> (<code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px]">demo=1</code>
          ): buyer preview with owner insights. <strong className="font-semibold text-slate-600">Paid link</strong> (no demo flag): patient-facing
          intake for ads, site, or embed.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="max-w-lg mx-auto text-center text-slate-500 text-sm">Loading intake…</div>
        }
      >
        <AttributionPixels />
        <GlpSimulationFunnel />
      </Suspense>
    </main>
  );
}
