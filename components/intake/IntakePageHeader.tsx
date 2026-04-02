"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { parseGlpIntakeQueryBranding } from "@/lib/glp-intake-query-branding";
import {
  PARENT_COMPANY_LEGAL_NAME,
  PRODUCT_NAME,
} from "@/lib/product-identity";

const DEFAULT_DEMO_ACCENT = "#0f172a";

function isIntakeDemoMode(sp: URLSearchParams | null): boolean {
  if (!sp) return false;
  return (
    sp.get("demo") === "1" || sp.get("preview") === "1" || sp.get("mode") === "demo"
  );
}

function safeCompanyLabel(raw: string | null): string {
  if (!raw?.trim()) return "Your clinic";
  try {
    return decodeURIComponent(raw.trim());
  } catch {
    return raw.trim();
  }
}

function IntakePageHeaderInner() {
  const sp = useSearchParams();
  const demo = isIntakeDemoMode(sp);
  const companyLabel = safeCompanyLabel(sp?.get("company") ?? null);
  const { logoUrl, primaryHex, secondaryHex } = useMemo(
    () => parseGlpIntakeQueryBranding(sp),
    [sp],
  );
  const accent = primaryHex || DEFAULT_DEMO_ACCENT;
  const accent2 = secondaryHex || accent;

  if (demo) {
    return (
      <div className="mx-auto mb-10 max-w-2xl md:mb-12">
        <div
          className="relative overflow-hidden rounded-3xl border bg-white px-6 py-8 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04),0_22px_48px_rgba(15,23,42,0.09)] ring-1 ring-slate-900/[0.04] md:px-10 md:py-10"
          style={{
            borderColor: `${accent}33`,
            boxShadow: `0 1px 2px rgba(15,23,42,0.04), 0 22px 48px rgba(15,23,42,0.09), 0 0 0 1px ${accent}14`,
          }}
        >
          <div
            className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full opacity-[0.14] blur-3xl"
            style={{ backgroundColor: accent }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full opacity-[0.1] blur-3xl"
            style={{ backgroundColor: accent2 }}
            aria-hidden
          />

          <div className="relative">
            <p
              className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em]"
              style={{
                borderColor: `${accent}55`,
                color: accent,
                backgroundColor: `${accent}0d`,
              }}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: accent }}
                aria-hidden
              />
              Demo preview
            </p>

            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt=""
                className="mx-auto mt-6 h-12 w-auto max-w-[220px] object-contain md:h-14"
                loading="eager"
              />
            ) : null}

            <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-slate-900 md:text-[2rem] md:leading-tight">
              {companyLabel}
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-600">Branded patient intake</p>

            <div className="mx-auto mt-6 max-w-lg space-y-4 text-left text-sm leading-relaxed text-slate-600 md:text-[15px]">
              <p>
                This preview uses your{" "}
                <span className="font-medium text-slate-800">logo and colors</span> on the same steps patients see:
                a few inputs, a short &ldquo;building&rdquo; moment, an educational overview, light readiness
                questions, then contact—not medical advice.
              </p>
              <p>
                <span className="font-medium text-slate-800">Only on demo links</span>, after the overview we add a
                short <span className="font-medium text-slate-800">clinic-owner section</span> (positioning and how to
                activate). Real patients never see that block.
              </p>
              <p className="rounded-xl border border-slate-200/90 bg-slate-50/90 px-4 py-3 text-[13px] text-slate-700">
                <span className="font-semibold text-slate-800">Live traffic:</span> use{" "}
                <code className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[11px] text-slate-800 ring-1 ring-slate-200/80">
                  /intake
                </code>{" "}
                without{" "}
                <code className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[11px] text-slate-800 ring-1 ring-slate-200/80">
                  demo=1
                </code>
                — same patient flow, no owner-only panels.
              </p>
            </div>

            <p
              data-intake-attribution
              className="relative mt-8 border-t border-slate-200/80 pt-6 text-center text-[11px] font-medium text-slate-500"
            >
              {PRODUCT_NAME} — a product of {PARENT_COMPANY_LEGAL_NAME}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-12 max-w-2xl space-y-5 text-center md:mb-14">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-900/80">Patient intake</p>
      <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900 md:text-[2.125rem] md:leading-snug">
        Pre-consult clarity through to your booking link
      </h1>
      <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-600 md:text-[15px]">
        White-label path for GLP-1 programs: set expectations and typical ranges before contact, then hand off to{" "}
        <span className="font-medium text-slate-800">your</span> scheduler. Use on ads, landing pages, or your site.
        Educational only — not medical advice.
      </p>
      <p
        data-intake-attribution
        className="mx-auto max-w-xl text-center text-[11px] font-medium text-slate-500"
      >
        {PRODUCT_NAME} — a product of {PARENT_COMPANY_LEGAL_NAME}
      </p>
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
