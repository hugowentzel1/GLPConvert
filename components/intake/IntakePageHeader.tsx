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

function clinicMonogramLetters(name: string): string {
  const clean = name.replace(/\s+/g, " ").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0][0] ?? "";
    const b = parts[1][0] ?? "";
    return (a + b).toUpperCase() || "?";
  }
  const slice = clean.slice(0, 2).toUpperCase();
  return slice || "?";
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
      <div className="mx-auto mb-8 max-w-2xl md:mb-10">
        <div
          className="relative overflow-hidden rounded-3xl border bg-white px-5 py-7 text-center shadow-[0_2px_6px_rgba(15,23,42,0.04),0_20px_44px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/[0.04] md:px-9 md:py-9"
          style={{
            borderColor: `${accent}40`,
            boxShadow: `0 2px 6px rgba(15,23,42,0.04), 0 20px 44px rgba(15,23,42,0.08), 0 0 0 1px ${accent}18`,
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-1 rounded-t-3xl"
            style={{
              background: `linear-gradient(90deg, ${accent} 0%, ${accent2} 55%, ${accent} 100%)`,
            }}
            aria-hidden
          />

          <div
            className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full opacity-[0.09] blur-3xl"
            style={{ backgroundColor: accent }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-14 -right-14 h-40 w-40 rounded-full opacity-[0.07] blur-3xl"
            style={{ backgroundColor: accent2 }}
            aria-hidden
          />

          <div className="relative">
            <p
              data-intake-demo-badge
              className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em]"
              style={{
                borderColor: `${accent}4d`,
                color: accent,
                backgroundColor: `${accent}0f`,
              }}
            >
              <span
                className="h-1 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: accent }}
                aria-hidden
              />
              Demo
            </p>

            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt=""
                className="mx-auto mt-5 h-11 w-auto max-w-[200px] object-contain md:h-[52px]"
                loading="eager"
              />
            ) : (
              <div
                className="mx-auto mt-5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl text-sm font-bold tracking-tight text-white shadow-md ring-2 ring-white"
                style={{ backgroundColor: accent }}
                aria-hidden
              >
                {clinicMonogramLetters(companyLabel)}
              </div>
            )}

            <h1 className="mt-4 text-balance text-2xl font-bold tracking-tight text-slate-900 md:text-[1.85rem] md:leading-tight">
              {companyLabel}
            </h1>
            <p className="mt-1.5 text-sm font-medium text-slate-600">Branded patient intake</p>

            <div className="mx-auto mt-5 max-w-lg space-y-3.5 text-left text-sm leading-relaxed text-slate-600 md:text-[15px]">
              <p>
                Same steps patients see on your live link: inputs, a brief build screen, an educational overview,
                light readiness questions, then contact. Not medical advice.
              </p>
              <p>
                <span className="font-medium text-slate-800">Demo only:</span> after the overview we show a short
                clinic-owner section. Patients on production never see it.
              </p>
              <p className="rounded-xl border border-slate-200/90 bg-slate-50/90 px-3.5 py-2.5 text-[13px] text-slate-700">
                <span className="font-semibold text-slate-800">Go live:</span>{" "}
                <code className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[11px] text-slate-800 ring-1 ring-slate-200/80">
                  /intake
                </code>{" "}
                without{" "}
                <code className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[11px] text-slate-800 ring-1 ring-slate-200/80">
                  demo=1
                </code>
                .
              </p>
            </div>

            <p
              data-intake-attribution
              className="relative mt-6 border-t border-slate-200/80 pt-5 text-center text-[11px] font-medium text-slate-500"
            >
              {PRODUCT_NAME} — a product of {PARENT_COMPANY_LEGAL_NAME}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-10 max-w-2xl space-y-4 text-center md:mb-12">
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
