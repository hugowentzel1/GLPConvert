"use client";

import { useSearchParams } from "next/navigation";
import { isIntakeBrandedMarketingMode } from "@/lib/glp-intake-demo-mode";

/**
 * Demo-link orientation: one calm line so buyers know they're seeing the patient path,
 * without competing with the hero or quotes below (NN/g: explicit task framing).
 */
export default function IntakePatientViewBanner() {
  const sp = useSearchParams();
  if (!isIntakeBrandedMarketingMode(sp)) return null;

  return (
    <aside
      data-intake-patient-view-banner
      className="rounded-xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 text-center text-[13px] leading-snug text-slate-700 sm:px-5 sm:text-left"
    >
      <p>
        <span className="font-semibold text-slate-900">You&apos;re previewing the patient path</span> — what someone
        sees after they click your link or embed. Owner dashboards and lead tools unlock after you activate.
      </p>
    </aside>
  );
}
