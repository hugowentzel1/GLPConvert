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
    <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:gap-3">
      <span className="sr-only" aria-live="polite">
        {copied ? "Demo link copied to clipboard" : ""}
      </span>
      <a
        href={`/pricing?company=${encodeURIComponent(companyLabel)}`}
        className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-center text-xs font-semibold text-white shadow-sm transition hover:opacity-95 sm:flex-initial sm:min-w-[12rem]"
        style={{ backgroundColor: accent }}
        data-demo-activate-intake
      >
        Activate for {companyLabel}
      </a>
      <button
        type="button"
        onClick={() => void onCopy()}
        className="inline-flex min-h-[44px] min-w-[8.5rem] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        data-demo-copy-link
      >
        {copied ? "Copied" : "Copy demo link"}
      </button>
      <p
        data-intake-demo-badge
        className="inline-flex min-h-[44px] min-w-[4rem] shrink-0 items-center justify-center rounded-full border px-3 py-1.5 text-center text-[9px] font-bold uppercase tracking-[0.12em]"
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

/**
 * Two stacked bands (Linear / Stripe-style): identity never shares a row with CTAs → no overlap at any width.
 */
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
      <div className="flex items-start gap-3 px-4 py-4 sm:gap-4 sm:px-5 sm:py-4">
        <BrandMark logoUrl={logoUrl} companyLabel={companyLabel} accent={accent} size="sm" />
        <div className="min-w-0 flex-1 text-left">
          <p className="text-base font-semibold leading-snug tracking-tight text-slate-900">{companyLabel}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            {demo ? "Private branded preview — ready to place on your site or funnel" : "Your next step before the consult"}
          </p>
        </div>
      </div>
      {demo ? (
        <div className="border-t border-slate-100 bg-slate-50/40 px-4 py-3 sm:px-5 sm:py-3.5">
          <DemoClinicBarActions companyLabel={companyLabel} accent={accent} />
        </div>
      ) : null}
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

        {!demo ? (
          <div className="relative flex justify-center">
            <BrandMark logoUrl={logoUrl} companyLabel={companyLabel} accent={accent} size="lg" />
          </div>
        ) : null}

        <h1
          className={`text-balance text-xl font-bold tracking-tight text-slate-900 md:text-2xl ${demo ? "relative pt-1" : "mt-5"}`}
        >
          {demo ? "The patient-facing path, under your brand" : "Before you book"}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600 md:mt-4 md:text-[15px]">
          {demo
            ? "Clarity on timing, typical ranges, and next steps — then your scheduling link."
            : "See what to expect, typical ranges, and a clear next step — general information only."}
        </p>

        {process.env.NODE_ENV === "development" ? (
          <details
            className="mx-auto mt-6 max-w-lg rounded-xl border border-slate-200/80 bg-slate-50/90 px-4 py-3 text-left shadow-inner"
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
