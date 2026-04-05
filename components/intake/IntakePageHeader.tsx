"use client";

import { Suspense, useMemo, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { parseGlpIntakeQueryBranding } from "@/lib/glp-intake-query-branding";
import { glpIntakeUi } from "@/lib/glp-intake-ui";

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
      className={`flex ${h} shrink-0 items-center justify-center rounded-2xl text-sm font-bold tracking-tight text-white shadow-md ring-2 ring-white`}
      style={{ backgroundColor: accent }}
      aria-hidden
    >
      {clinicMonogramLetters(companyLabel)}
    </div>
  );
}

function DemoHeaderActions({
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
    <div className="mx-auto w-full max-w-md space-y-3">
      <span className="sr-only" aria-live="polite">
        {copied ? "Demo link copied to clipboard" : ""}
      </span>
      <a
        href={`/pricing?company=${encodeURIComponent(companyLabel)}`}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-x-3 rounded-xl px-4 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:brightness-[1.02] active:scale-[0.998]"
        style={{ backgroundColor: accent }}
        data-demo-activate-intake
        aria-label={`Activate GLPConvert for ${companyLabel}`}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">Activate</span>
        <span className="h-4 w-px shrink-0 bg-white/35" aria-hidden />
        <span className="line-clamp-2 min-w-0 flex-1 text-left leading-snug">{companyLabel}</span>
      </a>
      {/* 12px gap; equal-width columns (same min height) — matches 8px grid × 1.5 */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => void onCopy()}
          className="inline-flex min-h-[44px] w-full min-w-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-center text-[11px] font-semibold leading-snug text-slate-700 shadow-sm transition hover:bg-slate-50 sm:text-xs"
          data-demo-copy-link
        >
          {copied ? "Copied" : "Copy link to this preview"}
        </button>
        <p
          data-intake-demo-badge
          className="inline-flex min-h-[44px] w-full min-w-0 items-center justify-center rounded-xl border px-2 py-2.5 text-center text-[10px] font-bold uppercase leading-tight tracking-[0.1em]"
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

function IntakePageHeaderInner() {
  const sp = useSearchParams();
  const demo = isIntakeDemoMode(sp);
  const reduceMotion = useReducedMotion();
  const companyLabel = safeCompanyLabel(sp?.get("company") ?? null);
  const { logoUrl, primaryHex } = useMemo(() => parseGlpIntakeQueryBranding(sp), [sp]);
  const accent = primaryHex || DEFAULT_DEMO_ACCENT;

  const heroMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className="w-full">
      <motion.div
        className={`relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-center shadow-[0_2px_8px_rgba(15,23,42,0.06),0_16px_40px_-12px_rgba(15,23,42,0.1)] ring-1 ring-slate-900/[0.05] ${glpIntakeUi.intakeHeaderPad}`}
        data-intake-clinic-bar={demo ? "demo" : "paid"}
        {...(demo ? { "data-intake-demo-strip": "1" } : {})}
        data-intake-hero
        {...heroMotion}
      >
        <div className="relative mx-auto flex max-w-lg flex-col items-center">
          {/* 16px below logo — 8dp × 2 */}
          <div className="mb-4 flex justify-center">
            <BrandMark logoUrl={logoUrl} companyLabel={companyLabel} accent={accent} size="lg" />
          </div>

          {/* 8px name → tagline */}
          <p className="text-pretty text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{companyLabel}</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
            {demo ? "Branded patient preview — embed on your site or ad funnel" : "Your next step before the consult"}
          </p>

          {demo ? (
            <>
              {/* 24px tagline → actions */}
              <div className="mt-6 w-full">
                <DemoHeaderActions companyLabel={companyLabel} accent={accent} />
              </div>
              {/* 24px + divider + 24px = clear subsection without huge dead space */}
              <div className="mt-6 w-full border-t border-slate-100 pt-6">
                <h1 className="text-pretty text-xl font-bold tracking-tight text-slate-900 sm:text-[1.35rem] sm:leading-snug">
                  The patient-facing path, under your brand
                </h1>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                  Clarity on timing, typical ranges, and next steps — then your scheduling link.
                </p>
              </div>
            </>
          ) : (
            <div className="mt-6 w-full">
              <h1 className="text-pretty text-xl font-bold tracking-tight text-slate-900 sm:text-[1.35rem] sm:leading-snug">
                Before you book
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                See what to expect, typical ranges, and a clear next step — general information only.
              </p>
            </div>
          )}
        </div>
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
