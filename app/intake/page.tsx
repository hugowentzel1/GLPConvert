import { Suspense } from "react";
import GlpIntakeFlow from "@/components/intake/GlpIntakeFlow";
import { PLATFORM_DISPLAY_NAME, PRODUCT_NAME } from "@/lib/product-identity";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Intake — ${PRODUCT_NAME}`,
  description: "Educational and booking intake — not medical advice.",
};

export default function IntakePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-12">
      <div className="max-w-xl mx-auto space-y-2 mb-10 text-center">
        <p className="text-sm text-slate-500">{PLATFORM_DISPLAY_NAME}</p>
        <h1 className="text-2xl font-bold text-slate-900">A few quick questions</h1>
        <p className="text-slate-600 text-sm">
          Help us route you to the right consult — a licensed provider determines final eligibility.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="max-w-lg mx-auto text-center text-slate-500 text-sm">Loading intake…</div>
        }
      >
        <GlpIntakeFlow />
      </Suspense>
    </main>
  );
}
