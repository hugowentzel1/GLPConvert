import { Suspense } from "react";
import GlpSimulationFunnel from "@/components/intake/GlpSimulationFunnel";
import AttributionPixels from "@/components/attribution/AttributionPixels";
import IntakePageHeader from "@/components/intake/IntakePageHeader";
import { PRODUCT_NAME } from "@/lib/product-identity";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Intake — ${PRODUCT_NAME}`,
  description:
    "White-label pre-consult path: clarity, expectations, and consult readiness before you share contact details.",
};

export default function IntakePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_90%_50%_at_50%_-8%,rgba(99,102,241,0.08),transparent)] bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-10 md:py-16">
      <IntakePageHeader />
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
