import { Suspense } from "react";
import GlpSimulationFunnel from "@/components/intake/GlpSimulationFunnel";
import AttributionPixels from "@/components/attribution/AttributionPixels";
import IntakePageFrame from "@/components/intake/IntakePageFrame";
import IntakePageHeader from "@/components/intake/IntakePageHeader";
import IntakeTrustRibbon from "@/components/intake/IntakeTrustRibbon";
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
    <IntakePageFrame demoServerHint={demo}>
      <IntakePageHeader />
      <IntakeTrustRibbon />
      <Suspense
        fallback={
          <div className="mx-auto max-w-lg text-center text-sm text-slate-500">Loading intake…</div>
        }
      >
        <AttributionPixels />
        <GlpSimulationFunnel />
      </Suspense>
    </IntakePageFrame>
  );
}
