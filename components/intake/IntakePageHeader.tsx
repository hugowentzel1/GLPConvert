"use client";

import { Suspense, useMemo, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
    <div className="flex w-full min-w-0 flex-col gap-3 lg:max-w-[min(100%,22rem)] lg:shrink-0">
      <span className="sr-only" aria-live="polite">
        {copied ? "Demo link copied to clipboard" : ""}
      </span>
      <a
        href={`/pricing?company=${encodeURIComponent(companyLabel)}`}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-x-2.5 gap-y-1 rounded-xl px-4 py-3 text-center shadow-sm transition hover:opacity-[0.97] active:scale-[0.998] sm:min-h-[44px] sm:flex-row sm:py-2.5"
        style={{ backgroundColor: accent }}
        data-demo-activate-intake
        aria-label={`Activate GLPConvert for ${companyLabel}`}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">Activate</span>
        <span className="hidden h-3.5 w-px shrink-0 bg-white/35 sm:inline" aria-hidden />
        <span className="line-clamp-2 max-w-[18rem] text-sm font-semibold leading-snug text-white sm:line-clamp-1 sm:text-left">
          {companyLabel}
        </span>
      </a>
      <div className="flex flex-wrap items-stretch gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={() => void onCopy()}
          className="inline-flex min-h-[44px] min-w-0 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:min-w-[9.5rem] sm:flex-initial"
          data-demo-copy-link
        >
          {copied ? "Copied" : "Copy link to this preview"}
        </button>
        <p
          data-intake-demo-badge
          className="inline-flex min-h-[44px] min-w-[6.5rem] shrink-0 items-center justify-center rounded-xl border px-3 py-2 text-center text-[10px] font-bold uppercase leading-tight tracking-[0.12em]"
          style={{
            borderColor: `${accent}44`,
            color: accent,
            backgroundColor: `${accent}0f`,
          }}
        >
          Demo preview
        </p>
      </div>
    </div>
  );
}

function ClinicIdentityBlock({
  companyLabel,
  logoUrl,
  accent,
  demo,
}: {
  companyLabel: string;
  logoUrl: string | null;
  accent: string;
  demo: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
      <BrandMark logoUrl={logoUrl} companyLabel={companyLabel} accent={accent} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold leading-snug tracking-tight text-slate-900">{companyLabel}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {demo ? "Branded patient preview — embed on your site or ad funnel" : "Your next step before the consult"}
        </p>
      </div>
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
      className="mb-5 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm"
      style={{ borderColor: `${accent}22` }}
      data-intake-clinic-bar={demo ? "demo" : "paid"}
      {...(demo ? { "data-intake-demo-strip": "1" } : {})}
    >
      {demo ? (
        <div className="px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <ClinicIdentityBlock companyLabel={companyLabel} logoUrl={logoUrl} accent={accent} demo={demo} />
            <DemoClinicBarActions companyLabel={companyLabel} accent={accent} />
          </div>
        </div>
      ) : (
        <div className="px-4 py-5 sm:px-6 sm:py-5">
          <ClinicIdentityBlock companyLabel={companyLabel} logoUrl={logoUrl} accent={accent} demo={demo} />
        </div>
      )}
    </div>
  );
}

function IntakePageHeaderInner() {
  const sp = useSearchParams();
  const demo = isIntakeDemoMode(sp);
  const reduceMotion = useReducedMotion();
  const companyLabel = safeCompanyLabel(sp?.get("company") ?? null);
  const { logoUrl, primaryHex, secondaryHex } = useMemo(
    () => parseGlpIntakeQueryBranding(sp),
    [sp],
  );
  const accent = primaryHex || DEFAULT_DEMO_ACCENT;
  const accent2 = secondaryHex || accent;

  const heroMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className="w-full">
      <ClinicTopBar demo={demo} companyLabel={companyLabel} logoUrl={logoUrl} accent={accent} />

      <motion.div
        className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white px-5 py-6 text-center shadow-sm sm:px-7 sm:py-7 md:px-8 md:py-8"
        style={{
          boxShadow: `0 1px 0 rgba(15,23,42,0.04), 0 12px 32px -12px rgba(15,23,42,0.08), 0 0 0 1px ${accent}0f`,
        }}
        data-intake-hero
        {...heroMotion}
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

        <h1 className="text-balance pt-4 text-xl font-bold tracking-tight text-slate-900 md:pt-5 md:text-2xl">
          {demo ? "The patient-facing path, under your brand" : "Before you book"}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600 md:mt-4 md:text-[15px]">
          {demo
            ? "Clarity on timing, typical ranges, and next steps — then your scheduling link."
            : "See what to expect, typical ranges, and a clear next step — general information only."}
        </p>
      </motion.div>
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
