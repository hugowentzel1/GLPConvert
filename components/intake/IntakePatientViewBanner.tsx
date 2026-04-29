"use client";

import { useSearchParams } from "next/navigation";
import { isIntakeBrandedMarketingMode } from "@/lib/glp-intake-demo-mode";

/**
 * Cold-email / sales-demo clarity strip (NN/g 2024: explicit "where am I?"
 * orientation cuts exploratory abandon on first paint). Buyer sees a
 * personalized `/intake?company=…&demo=1` URL; one short orientation line
 * tells them this is the patient-facing path and that owner tools open
 * after activation. No colored pill — the page already carries brand color
 * via the trust strip and CTAs, so the pill was visual noise (CXL 2024
 * "trust vs noise" audit: stack the brand-color signals, don't repeat them).
 */
export default function IntakePatientViewBanner() {
  const sp = useSearchParams();
  if (!isIntakeBrandedMarketingMode(sp)) return null;

  return (
    <aside
      data-intake-patient-view-banner
      className="text-center text-[10.5px] font-medium uppercase tracking-[0.16em] text-slate-400"
    >
      Patient view
      <span aria-hidden className="mx-1.5 text-slate-300">·</span>
      same path leads see
      <span aria-hidden className="mx-1.5 text-slate-300">·</span>
      owner dashboard opens after checkout
    </aside>
  );
}
