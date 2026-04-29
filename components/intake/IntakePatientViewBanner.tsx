"use client";

import { useSearchParams } from "next/navigation";
import { isIntakeBrandedMarketingMode } from "@/lib/glp-intake-demo-mode";
import { parseGlpIntakeQueryBranding } from "@/lib/glp-intake-query-branding";
import { getAccessibleBrandFill } from "@/lib/glp-intake-brand-contrast";

/**
 * Cold-email / sales-demo clarity strip (NN/g 2024: explicit "where am I?"
 * orientation cuts exploratory abandon on first paint).
 *
 * Buyer sees a *personalized* `/intake?company=…&demo=1` URL. Without this
 * banner, the first scroll reads as "another marketing page" rather than
 * "this is exactly what my patient will flow through" — the #1 confusion
 * unlock identified in the pass-8 CRO review (Unbounce 2024 landing
 * personalization benchmarks: explicit task framing lifts completion).
 */
export default function IntakePatientViewBanner() {
  const sp = useSearchParams();
  if (!isIntakeBrandedMarketingMode(sp)) return null;

  const { primaryHex } = parseGlpIntakeQueryBranding(sp);
  const fill = getAccessibleBrandFill(primaryHex || "#475569");

  return (
    <aside
      data-intake-patient-view-banner
      className="rounded-xl border border-slate-200/90 bg-white/95 px-4 py-3.5 text-center text-[13px] leading-snug text-slate-700 shadow-sm ring-1 ring-slate-900/[0.04] sm:px-5 sm:text-left"
    >
      <p className="sm:flex sm:items-start sm:gap-2">
        <span
          className="inline-flex shrink-0 items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white sm:mt-0.5"
          style={{ backgroundColor: fill }}
        >
          Patient view
        </span>
        <span className="mt-1.5 block sm:mt-0">
          This is the same path leads see after you drop the link or embed on your site.
          <span className="text-slate-500"> Owner tools (links, settings, leads) open after checkout.</span>
        </span>
      </p>
    </aside>
  );
}
