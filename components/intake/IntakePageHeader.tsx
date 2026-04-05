"use client";

import { Suspense, useMemo, useState, useCallback } from "react";
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

function DemoClinicBarActions({
  companyLabel,
  accent,
}: {
  companyLabel: string;
  accent: string;
}) {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:max-w-[min(100%,22rem)] sm:flex-row sm:items-center sm:justify-end">
      <span className="sr-only" aria-live="polite">
        {copied ? "Demo link copied to clipboard" : ""}
      </span>
      <a
        href={`/pricing?company=${encodeURIComponent(companyLabel)}`}
        className="inline-flex min-h-[40px] items-center justify-center rounded-xl px-3.5 py-2 text-center text-xs font-semibold text-white shadow-sm transition hover:opacity-95"
        style={{ backgroundColor: accent }}
        data-demo-activate-intake
      >
        Activate for {companyLabel}
      </a>
      <button
        type="button"
        onClick={() => void onCopy()}
        className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        data-demo-copy-link
      >
        {copied ? "Copied" : "Copy demo link"}
      </button>
      <p
        data-intake-demo-badge
        className="inline-flex shrink-0 items-center justify-center rounded-full border px-2.5 py-1 text-center text-[9px] font-bold uppercase tracking-[0.12em]"
        style={{
          borderColor: `${accent}55`,
          color: accent,
          backgroundColor: `${accent}0f`,
        }}
      >
        Demo
      </p>
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
      className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white/90 px-3 py-2.5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:py-3"
      style={{ borderColor: `${accent}24` }}
      data-intake-clinic-bar={demo ? "demo" : "paid"}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
        <BrandMark logoUrl={logoUrl} companyLabel={companyLabel} accent={accent} size="sm" />
        <div className="min-w-0 text-left">
          <p className="truncate text-sm font-semibold tracking-tight text-slate-900 sm:text-base">{companyLabel}</p>
          <p className="text-[11px] leading-snug text-slate-500">
            {demo ? "Preview ready for your clinic" : "Clarity before you schedule"}
          </p>
        </div>
      </div>
      {demo ? <DemoClinicBarActions companyLabel={companyLabel} accent={accent} /> : null}
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
        className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white px-5 py-6 text-center shadow-sm md:px-8 md:py-8"
        style={{
          boxShadow: `0 1px 0 rgba(15,23,42,0.04), 0 16px 40px -12px rgba(15,23,42,0.07), 0 0 0 1px ${accent}10`,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, ${accent} 0%, ${accent2} 55%, ${accent} 100%)`,
          }}
          aria-hidden
        />

        <h1 className="text-balance text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          {demo ? "The patient path your traffic sees" : "Path, range, then scheduling"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
          {demo
            ? "Branded steps: expectations, cost band, readiness — then your booking link."
            : "Short, calm steps — general information only, not medical advice."}
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
