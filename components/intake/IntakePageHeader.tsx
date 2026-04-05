"use client";

import { Suspense, useMemo, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { parseGlpIntakeQueryBranding } from "@/lib/glp-intake-query-branding";
import { glpIntakeUi } from "@/lib/glp-intake-ui";

const DEFAULT_DEMO_ACCENT = "#0f172a";

/** Primary CTA hover: subtle lift + scale (Apple HIG “playful” feedback; respects reduced motion). */
function useMarketingHover(reduceMotion: boolean) {
  if (reduceMotion) {
    return { primary: {}, secondary: {} } as const;
  }
  return {
    primary: {
      whileHover: { y: -3, scale: 1.02 },
      whileTap: { scale: 0.99 },
      transition: { type: "spring" as const, stiffness: 420, damping: 28 },
    },
    secondary: {
      whileHover: { y: -2, scale: 1.02 },
      whileTap: { scale: 0.99 },
      transition: { type: "spring" as const, stiffness: 480, damping: 32 },
    },
  } as const;
}

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
  reduceMotion,
}: {
  companyLabel: string;
  accent: string;
  reduceMotion: boolean;
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

  const hover = useMarketingHover(reduceMotion);

  return (
    <div className="mx-auto w-full max-w-sm space-y-4">
      <span className="sr-only" aria-live="polite">
        {copied ? "Demo link copied to clipboard" : ""}
      </span>
      {/* Centered stacked label + clinic (no horizontal “activate | name” split — matches hero CTA patterns) */}
      <motion.a
        href={`/pricing?company=${encodeURIComponent(companyLabel)}`}
        className="flex min-h-[52px] w-full flex-col items-center justify-center gap-1 rounded-full px-5 py-3.5 text-center text-white shadow-md outline-none ring-offset-2 ring-offset-white transition-shadow duration-200 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-slate-900/25"
        style={{ backgroundColor: accent }}
        data-demo-activate-intake
        aria-label={`Activate GLPConvert for ${companyLabel}`}
        {...hover.primary}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90">Activate</span>
        <span className="line-clamp-2 max-w-[16rem] text-sm font-semibold leading-snug">{companyLabel}</span>
      </motion.a>

      <div className="grid grid-cols-2 gap-3">
        <motion.button
          type="button"
          onClick={() => void onCopy()}
          className="inline-flex min-h-[46px] w-full min-w-0 items-center justify-center rounded-full border border-slate-200/95 bg-white px-2 py-2.5 text-center text-[11px] font-semibold leading-snug text-slate-700 shadow-sm transition-shadow duration-200 hover:border-slate-300 hover:shadow-md sm:text-xs"
          data-demo-copy-link
          {...hover.secondary}
        >
          {copied ? "Copied" : "Copy link to this preview"}
        </motion.button>
        <motion.div
          className="inline-flex min-h-[46px] w-full min-w-0 items-center justify-center rounded-full border px-2 py-2.5 text-center text-[10px] font-bold uppercase leading-tight tracking-[0.1em] shadow-sm transition-shadow duration-200 hover:shadow-md"
          style={{
            borderColor: `${accent}44`,
            color: accent,
            backgroundColor: `${accent}0f`,
          }}
          data-intake-demo-badge
          {...hover.secondary}
        >
          Demo preview
        </motion.div>
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
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className="w-full">
      <motion.div
        className={`relative overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white text-center shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08),0_12px_40px_-12px_rgba(15,23,42,0.1)] ring-1 ring-slate-900/[0.04] ${glpIntakeUi.intakeHeaderPad}`}
        data-intake-clinic-bar={demo ? "demo" : "paid"}
        {...(demo ? { "data-intake-demo-strip": "1" } : {})}
        data-intake-hero
        {...heroMotion}
      >
        <div className="relative mx-auto flex max-w-[min(100%,26rem)] flex-col items-center">
          <div className="mb-5 flex justify-center sm:mb-6">
            <BrandMark logoUrl={logoUrl} companyLabel={companyLabel} accent={accent} size="lg" />
          </div>

          <p className="text-pretty text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{companyLabel}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500 sm:text-[15px]">
            {demo ? "Branded patient preview — embed on your site or ad funnel" : "Your next step before the consult"}
          </p>

          {demo ? (
            <>
              <div className="mt-8 w-full sm:mt-9">
                <DemoHeaderActions companyLabel={companyLabel} accent={accent} reduceMotion={reduceMotion} />
              </div>
              <div className="mt-8 w-full border-t border-slate-100 pt-8 sm:mt-9 sm:pt-9">
                <h1 className="text-pretty text-[1.35rem] font-bold leading-snug tracking-tight text-slate-900 sm:text-2xl">
                  The patient-facing path, under your brand
                </h1>
                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600">
                  Clarity on timing, typical ranges, and next steps — then your scheduling link.
                </p>
              </div>
            </>
          ) : (
            <div className="mt-8 w-full sm:mt-9">
              <h1 className="text-pretty text-[1.35rem] font-bold leading-snug tracking-tight text-slate-900 sm:text-2xl">
                Before you book
              </h1>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600">
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
          className="mx-auto mb-8 h-36 w-full max-w-2xl rounded-[1.75rem] bg-slate-100/90 ring-1 ring-slate-200/80"
          aria-busy
          aria-label="Loading intake header"
        />
      }
    >
      <IntakePageHeaderInner />
    </Suspense>
  );
}
