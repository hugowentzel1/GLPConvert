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
      className="rounded-lg border border-slate-200/70 bg-slate-50/70 px-4 py-2.5 text-center text-[13px] leading-snug text-slate-600 sm:text-left"
    >
      <p>
        <span className="font-semibold text-slate-900">You&apos;re previewing the patient view</span>
        <span aria-hidden className="mx-1.5 text-slate-300">·</span>
        <span>the same path leads see when you drop the link or embed on your site.</span>
        <span className="ml-1 text-slate-500">Owner dashboard (leads, settings, embed, branded URL) opens after checkout.</span>
      </p>
    </aside>
  );
}
