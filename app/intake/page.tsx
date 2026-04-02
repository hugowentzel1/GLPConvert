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

function isDemoFromSearchParams(
  sp: Record<string, string | string[] | undefined> | undefined,
): boolean {
  if (!sp) return false;
  const demo = sp.demo;
  const demoStr = Array.isArray(demo) ? demo[0] : demo;
  const preview = sp.preview;
  const previewStr = Array.isArray(preview) ? preview[0] : preview;
  const mode = sp.mode;
  const modeStr = Array.isArray(mode) ? mode[0] : mode;
  return (
    demoStr === "1" ||
    demoStr === "true" ||
    previewStr === "1" ||
    modeStr === "demo"
  );
}

export default function IntakePage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const demo = isDemoFromSearchParams(searchParams);
  return (
    <main
      className="min-h-screen bg-[radial-gradient(ellipse_95%_55%_at_50%_-10%,rgba(99,102,241,0.07),transparent_55%)] bg-gradient-to-b from-slate-50 via-white to-slate-100/95 px-4 py-10 md:py-16"
      data-intake-mode={demo ? "demo" : "paid"}
    >
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
