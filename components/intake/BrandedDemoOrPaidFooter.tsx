"use client";

import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import PaidFooter from "@/components/PaidFooter";
import { useIsDemo } from "@/src/lib/isDemo";
import { isIntakeBrandedMarketingMode } from "@/lib/glp-intake-demo-mode";
import IntakePageFooter from "@/components/intake/IntakePageFooter";

/**
 * For shells that previously did `isDemo ? Footer : PaidFooter`: add branded demo → intake-matched footer.
 */
export default function BrandedDemoOrPaidFooter() {
  const sp = useSearchParams();
  const isDemo = useIsDemo();
  if (isIntakeBrandedMarketingMode(new URLSearchParams(sp?.toString() ?? ""))) {
    return <IntakePageFooter />;
  }
  return isDemo ? <Footer /> : <PaidFooter />;
}
