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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/80 px-4 py-12 md:py-16">
      <div className="max-w-xl mx-auto space-y-3 mb-12 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">{PLATFORM_DISPLAY_NAME}</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          Pre-consult clarity → consult readiness → your booking link
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          White-label revenue layer for GLP-1 programs: expectations and typical ranges first, then save and hand off to{" "}
          <em>your</em> scheduler — not medical advice.
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
