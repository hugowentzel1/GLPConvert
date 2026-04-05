"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { parseGlpIntakeQueryBranding } from "@/lib/glp-intake-query-branding";

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

function BrandMark({
  logoUrl,
  companyLabel,
  accent,
  size = "md",
}: {
  logoUrl: string | null;
  companyLabel: string;
  accent: string;
  size?: "sm" | "md" | "lg";
}) {
  const h = size === "sm" ? "h-10 w-10" : size === "md" ? "h-12 w-12" : "h-14 w-14";
  const imgH = size === "sm" ? "h-10 max-h-10" : size === "md" ? "h-12 max-h-12" : "h-14 max-h-14";
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt=""
        className={`${imgH} w-auto max-w-[140px] shrink-0 object-contain md:max-w-[160px]`}
        loading="eager"
      />
    );
  }
  return (
    <div
      className={`flex ${h} shrink-0 items-center justify-center rounded-xl text-sm font-bold tracking-tight text-white shadow-md ring-2 ring-white`}
      style={{ backgroundColor: accent }}
      aria-hidden
    >
      {clinicMonogramLetters(companyLabel)}
    </div>
  );
}

function ClinicTopBar({
  demo,
  companyLabel,
  logoUrl,
  accent,
}: {
  demo: boolean;
  companyLabel: string;
  logoUrl: string | null;
  accent: string;
}) {
  return (
    <div
      className="mb-5 flex items-center justify-between gap-3 rounded-2xl border bg-white/95 px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.04)] ring-1 ring-slate-900/[0.04] backdrop-blur-sm sm:px-5"
      style={{ borderColor: `${accent}30` }}
      data-intake-clinic-bar={demo ? "demo" : "paid"}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <BrandMark logoUrl={logoUrl} companyLabel={companyLabel} accent={accent} size="sm" />
        <div className="min-w-0 text-left">
          <p className="truncate text-base font-semibold tracking-tight text-slate-900">{companyLabel}</p>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
            {demo ? (
              <>
                Preview for <span className="font-semibold text-slate-600">{companyLabel}</span>
              </>
            ) : (
              "Your next step — before the consult"
            )}
          </p>
        </div>
      </div>
      {demo ? (
        <p
          data-intake-demo-badge
          className="shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em]"
          style={{
            borderColor: `${accent}55`,
            color: accent,
            backgroundColor: `${accent}0f`,
          }}
        >
          Demo
        </p>
      ) : null}
    </div>
  );
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

  return (
    <div className="mx-auto max-w-2xl">
      <ClinicTopBar demo={demo} companyLabel={companyLabel} logoUrl={logoUrl} accent={accent} />

      <div
        className="relative overflow-hidden rounded-3xl border bg-white px-5 py-7 text-center shadow-[0_2px_8px_rgba(15,23,42,0.04),0_24px_48px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.04] md:px-8 md:py-8"
        style={{
          borderColor: `${accent}32`,
          boxShadow: `0 2px 8px rgba(15,23,42,0.04), 0 24px 48px rgba(15,23,42,0.06), 0 0 0 1px ${accent}12`,
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
          className="pointer-events-none absolute -left-20 -top-20 h-44 w-44 rounded-full opacity-[0.06] blur-3xl"
          style={{ backgroundColor: accent }}
          aria-hidden
        />

        <div className="relative flex justify-center pt-0.5">
          <BrandMark logoUrl={logoUrl} companyLabel={companyLabel} accent={accent} size="lg" />
        </div>

        <h1 className="mt-5 text-balance text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          {demo ? "How traffic converts before the consult" : "Before you book"}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          {demo
            ? "Your brand and booking link — patients see the path, typical ranges, and a clear next step."
            : "What to expect, typical ranges, then your scheduling link — general information only."}
        </p>

        {demo ? (
          <details className="mx-auto mt-5 max-w-md rounded-xl border border-slate-200/90 bg-slate-50/80 px-4 py-3 text-left">
            <summary className="cursor-pointer list-none text-xs font-semibold text-slate-600 [&::-webkit-details-marker]:hidden">
              Live URL & logo params
            </summary>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
              Production uses <code className="rounded bg-white px-1 py-0.5 font-mono text-[10px]">/intake</code> without{" "}
              <code className="rounded bg-white px-1 py-0.5 font-mono text-[10px]">demo=1</code>. Add{" "}
              <code className="rounded bg-white px-1 py-0.5 font-mono text-[10px]">logo=</code> or{" "}
              <code className="rounded bg-white px-1 py-0.5 font-mono text-[10px]">domain=</code> for automatic logo.
            </p>
          </details>
        ) : null}
      </div>
    </div>
  );
}

export default function IntakePageHeader() {
  return (
    <Suspense
      fallback={
        <div
          className="mx-auto mb-8 max-w-2xl h-32 rounded-2xl bg-slate-100/90 ring-1 ring-slate-200/80"
          aria-busy
          aria-label="Loading intake header"
        />
      }
    >
      <IntakePageHeaderInner />
    </Suspense>
  );
}
