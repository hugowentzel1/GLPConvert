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
  const h = size === "sm" ? "h-10 w-10" : size === "md" ? "h-12 w-12" : "h-16 w-16";
  const imgCls =
    size === "sm"
      ? "h-10 max-h-10 w-auto max-w-[140px] shrink-0 object-contain"
      : size === "md"
        ? "h-12 max-h-12 w-auto max-w-[160px] shrink-0 object-contain"
        : "h-16 max-h-16 w-auto max-w-[220px] shrink-0 object-contain sm:max-w-[260px]";
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logoUrl} alt="" className={imgCls} loading="eager" />
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
    <div className="flex w-full min-w-0 flex-shrink-0 flex-col gap-2 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-2">
      <span className="sr-only" aria-live="polite">
        {copied ? "Demo link copied to clipboard" : ""}
      </span>
      <a
        href={`/pricing?company=${encodeURIComponent(companyLabel)}`}
        className="inline-flex min-h-[44px] items-center justify-center rounded-xl px-4 py-2.5 text-center text-xs font-semibold text-white shadow-sm transition hover:opacity-95"
        style={{ backgroundColor: accent }}
        data-demo-activate-intake
      >
        Activate for {companyLabel}
      </a>
      <button
        type="button"
        onClick={() => void onCopy()}
        className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        data-demo-copy-link
      >
        {copied ? "Copied" : "Copy demo link"}
      </button>
      <p
        data-intake-demo-badge
        className="inline-flex shrink-0 items-center justify-center self-start rounded-full border px-3 py-1.5 text-center text-[9px] font-bold uppercase tracking-[0.12em] sm:self-center"
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
      className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-5 sm:py-4"
      style={{ borderColor: `${accent}28` }}
      data-intake-clinic-bar={demo ? "demo" : "paid"}
      {...(demo ? { "data-intake-demo-strip": "1" } : {})}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
        <BrandMark logoUrl={logoUrl} companyLabel={companyLabel} accent={accent} size="sm" />
        <div className="min-w-0 flex-1 text-left">
          <p className="text-base font-semibold leading-snug tracking-tight text-slate-900">{companyLabel}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            {demo ? "Preview ready for your clinic — private branded path" : "Your next step before the consult"}
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
    <div className="w-full">
      <ClinicTopBar demo={demo} companyLabel={companyLabel} logoUrl={logoUrl} accent={accent} />

      <div
        className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white px-6 py-8 text-center shadow-sm sm:px-8 sm:py-10 md:px-10 md:py-12"
        style={{
          boxShadow: `0 1px 0 rgba(15,23,42,0.04), 0 16px 40px -12px rgba(15,23,42,0.07), 0 0 0 1px ${accent}10`,
        }}
        data-intake-hero
      >
        <div
          className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, ${accent} 0%, ${accent2} 55%, ${accent} 100%)`,
          }}
          aria-hidden
        />

        <div className="relative flex justify-center">
          <BrandMark logoUrl={logoUrl} companyLabel={companyLabel} accent={accent} size="lg" />
        </div>

        <h1 className="mt-6 text-balance text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          {demo ? "The patient-facing path, under your brand" : "Before you book"}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-600 md:text-[15px]">
          {demo
            ? "Clarity on timing, typical ranges, and next steps — then your scheduling link. Built to drop into your site or funnel."
            : "See what to expect, typical ranges, and a clear next step — general information only."}
        </p>

        {process.env.NODE_ENV === "development" ? (
          <details
            className="mx-auto mt-8 max-w-lg rounded-xl border border-slate-200/80 bg-slate-50/90 px-4 py-3 text-left shadow-inner"
            data-intake-local-urls
          >
            <summary className="cursor-pointer list-none text-[11px] font-semibold text-slate-600 [&::-webkit-details-marker]:hidden">
              Local URLs (dev)
            </summary>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
              Demo adds <code className="rounded bg-white px-1 font-mono text-[10px]">demo=1</code>. Production omits it.
              Use <code className="rounded bg-white px-1 font-mono text-[10px]">logo=</code> or{" "}
              <code className="rounded bg-white px-1 font-mono text-[10px]">domain=</code> for logo.
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
          className="mx-auto mb-8 h-32 w-full max-w-2xl rounded-2xl bg-slate-100/90 ring-1 ring-slate-200/80"
          aria-busy
          aria-label="Loading intake header"
        />
      }
    >
      <IntakePageHeaderInner />
    </Suspense>
  );
}
