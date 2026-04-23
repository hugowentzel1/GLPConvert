"use client";

import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import { isIntakeBrandedMarketingMode } from "@/lib/glp-intake-demo-mode";
import IntakePageFooter from "@/components/intake/IntakePageFooter";

/**
 * Branded cold-email / demo flows: same minimal chrome as `/intake`. Otherwise default marketing footer.
 */
export default function BrandedDemoOrDefaultFooter() {
  const sp = useSearchParams();
  const br = isIntakeBrandedMarketingMode(new URLSearchParams(sp?.toString() ?? ""));
  if (br) return <IntakePageFooter />;
  return <Footer />;
}
