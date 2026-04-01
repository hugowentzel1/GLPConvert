import { Suspense } from "react";
import GlpSimulationFunnel from "@/components/intake/GlpSimulationFunnel";
import { PLATFORM_DISPLAY_NAME, PRODUCT_NAME } from "@/lib/product-identity";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Intake — ${PRODUCT_NAME}`,
  description: "Instant GLP transformation simulation + clinic-reviewed next step.",
};

export default function IntakePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-12">
      <div className="max-w-xl mx-auto space-y-2 mb-10 text-center">
        <p className="text-sm text-slate-500">{PLATFORM_DISPLAY_NAME}</p>
        <h1 className="text-2xl font-bold text-slate-900">See where you could be</h1>
        <p className="text-slate-600 text-sm">
          Most funnels collect your contact details first. We show your estimated path first, then offer clinic-reviewed next steps.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="max-w-lg mx-auto text-center text-slate-500 text-sm">Loading intake…</div>
        }
      >
        <GlpSimulationFunnel />
      </Suspense>
    </main>
  );
}
