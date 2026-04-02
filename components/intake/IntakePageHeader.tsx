"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PLATFORM_DISPLAY_NAME } from "@/lib/product-identity";

function isIntakeDemoMode(sp: URLSearchParams | null): boolean {
  if (!sp) return false;
  return (
    sp.get("demo") === "1" || sp.get("preview") === "1" || sp.get("mode") === "demo"
  );
}

function IntakePageHeaderInner() {
  const sp = useSearchParams();
  const demo = isIntakeDemoMode(sp);

  return (
    <div className="mx-auto mb-12 max-w-2xl space-y-5 text-center md:mb-14">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
        {PLATFORM_DISPLAY_NAME}
      </p>

      {demo ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-900/80">
            Clinic buyer preview
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900 md:text-[2.125rem] md:leading-snug">
            Preview the intake your patients will use
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-600 md:text-[15px]">
            Same steps as your production link, plus short <strong className="font-medium text-slate-800">owner-only</strong>{" "}
            context on the results screen (before/after framing, activation). For live traffic, use{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px]">/intake</code> without{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px]">demo=1</code>.
          </p>
        </>
      ) : (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-900/80">
            Patient intake
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900 md:text-[2.125rem] md:leading-snug">
            Pre-consult clarity through to your booking link
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-600 md:text-[15px]">
            White-label path for GLP-1 programs: set expectations and typical ranges before contact, then hand off to{" "}
            <span className="font-medium text-slate-800">your</span> scheduler. Use on ads, landing pages, or your site.
            Educational only — not medical advice.
          </p>
        </>
      )}
    </div>
  );
}

export default function IntakePageHeader() {
  return (
    <Suspense
      fallback={
        <div
          className="mx-auto mb-12 max-w-2xl h-36 rounded-2xl bg-slate-100/90 ring-1 ring-slate-200/80"
          aria-busy
          aria-label="Loading intake header"
        />
      }
    >
      <IntakePageHeaderInner />
    </Suspense>
  );
}
