"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { parseGlpIntakeQueryBranding } from "@/lib/glp-intake-query-branding";
import { isIntakeBrandedMarketingMode } from "@/lib/glp-intake-demo-mode";
import { buildIntakePricingHref } from "@/lib/glp-intake-nav-href";
import { redirectToStripeCheckout } from "@/lib/stripe-checkout-client";
import { LAUNCH_BRANDED_CTA_LABEL } from "@/lib/product-identity";
import { glpIntakeUi } from "@/lib/glp-intake-ui";
import { getAccessibleBrandFill } from "@/lib/glp-intake-brand-contrast";

const DEFAULT_DEMO_ACCENT = "#0f172a";

/** Primary CTA hover: subtle lift + scale (Framer); respects reduced motion. */
function useMarketingHover(reduceMotion: boolean | null | undefined) {
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
  pricingHref,
}: {
  companyLabel: string;
  accent: string;
  reduceMotion: boolean | null | undefined;
  pricingHref: string;
}) {
  const [copied, setCopied] = useState(false);
  const [activating, setActivating] = useState(false);
  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  /**
   * Buyer pass 22: top intake CTA "Launch Your Branded Version Now"
   * now POSTs directly to Stripe Checkout (one click, no /pricing
   * intermediate). Cold-email landings convert best when the hero
   * CTA goes straight to commitment — Stripe Atlas, Linear, Pipe,
   * Ramp 2025 SaaS teardowns all converge on this. Falls back to
   * `pricingHref` if the request fails so the buyer never dead-ends.
   */
  const onActivateClick = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (activating) return;
      setActivating(true);
      await redirectToStripeCheckout({ fallbackHref: pricingHref });
    },
    [activating, pricingHref],
  );

  const hover = useMarketingHover(reduceMotion);

  return (
    <div className="mx-auto w-full max-w-sm space-y-3">
      <span className="sr-only" aria-live="polite">
        {copied ? "Demo link copied to clipboard" : ""}
      </span>
      <motion.a
        href={pricingHref}
        onClick={onActivateClick}
        aria-busy={activating || undefined}
        className={`${glpIntakeUi.primaryBtn} relative w-full !inline-flex !min-h-[52px] !flex-row !items-center !justify-center !gap-0 !rounded-xl !px-5 !py-3.5 !shadow-md ring-offset-white ${activating ? "pointer-events-none opacity-90" : ""}`}
        style={{ backgroundColor: accent }}
        data-demo-activate-intake
        data-intake-hero-activate
        aria-label={LAUNCH_BRANDED_CTA_LABEL}
        {...hover.primary}
      >
        {activating ? (
          <span className="relative z-10 inline-flex items-center gap-2 text-sm font-semibold sm:text-base">
            <span
              aria-hidden
              className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none"
            />
            Activating…
          </span>
        ) : (
          <>
            <span className="relative z-10 mr-3 shrink-0 text-xl leading-none sm:text-2xl" aria-hidden>
              ⚡
            </span>
            <span className="relative z-10 text-center text-sm font-semibold leading-snug sm:text-base">
              {LAUNCH_BRANDED_CTA_LABEL}
            </span>
          </>
        )}
      </motion.a>

      <motion.button
        type="button"
        onClick={() => void onCopy()}
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-slate-200/95 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-shadow duration-200 hover:border-slate-300 hover:shadow-md"
        data-demo-copy-link
        {...hover.secondary}
      >
        {copied ? "Copied" : "Copy link to this preview"}
      </motion.button>
    </div>
  );
}

function IntakePageHeaderInner() {
  const sp = useSearchParams();
  const demo = isIntakeBrandedMarketingMode(sp);
  const reduceMotion = useReducedMotion();
  const prefersReducedMotion = reduceMotion ?? false;
  const companyLabel = safeCompanyLabel(sp?.get("company") ?? null);
  const { logoUrl, primaryHex } = useMemo(() => parseGlpIntakeQueryBranding(sp), [sp]);
  /**
   * `?brand=` is user-controlled — guard the CTA against AA contrast failures (slate-900 fallback
   * keeps text readable on white). Same helper used inside `GlpSimulationFunnel`.
   */
  const accent = useMemo(() => getAccessibleBrandFill(primaryHex || DEFAULT_DEMO_ACCENT), [primaryHex]);
  const heroPricingHref = useMemo(() => buildIntakePricingHref(sp, companyLabel), [sp, companyLabel]);

  return (
    <div className="w-full">
      <div
        className={`${glpIntakeUi.intakeHeroShell} text-center ${glpIntakeUi.intakeHeaderPad}`}
        data-intake-clinic-bar={demo ? "demo" : "paid"}
        {...(demo ? { "data-intake-demo-strip": "1" } : {})}
        data-intake-hero
      >
        <div className="relative mx-auto w-full max-w-[min(100%,36rem)]">
          {demo ? (
            <>
              <div className="flex flex-col items-center gap-3 text-center sm:gap-3.5">
                <BrandMark logoUrl={logoUrl} companyLabel={companyLabel} accent={accent} size="md" />
                <p className="text-pretty text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{companyLabel}</p>
              </div>

              <p className="mx-auto mt-4 max-w-md text-pretty text-sm leading-relaxed text-slate-600 sm:mt-5 sm:text-[15px]">
                Right now, paid clicks for{" "}
                <span className="font-medium text-slate-800">{companyLabel}</span> leak revenue at every step:
                abandoned intakes, no-shows, missed callbacks. This branded path closes the gap: your logo, your book
                link, more consults from the same ad spend, more revenue kept in-house. Embed it on your site or send
                your paid ads straight to it. <span className="font-medium text-slate-800">You stay the prescriber and own the patient</span>. GLPConvert is the branded front-door funnel, not the clinic.
              </p>
              <div className="mt-4 flex w-full justify-center sm:mt-5">
                <DemoHeaderActions
                  companyLabel={companyLabel}
                  accent={accent}
                  reduceMotion={prefersReducedMotion}
                  pricingHref={heroPricingHref}
                />
              </div>

              <div className="mt-5 w-full space-y-4 border-t border-slate-200 pt-5 text-center sm:mt-6 sm:pt-6">
                <h1 className="text-pretty text-lg font-bold leading-snug tracking-tight text-slate-900 sm:text-xl">
                  Stop leaking paid clicks. Turn the same traffic into more booked consults.
                </h1>
                <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-600">
                  Your colors, your logo, your booking link, wrapped around a short funnel patients actually finish.
                  Use it as your homepage intake, your ad landing page, or a recovery link for no-shows. Same paid
                  traffic, fewer dropped intakes, more consults that turn into revenue. You stay the
                  prescriber. Not medical advice.
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex justify-center sm:mb-5">
                <BrandMark logoUrl={logoUrl} companyLabel={companyLabel} accent={accent} size="lg" />
              </div>
              <p className="text-pretty text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{companyLabel}</p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500 sm:mt-3 sm:text-[15px]">
                Your next step before the consult
              </p>
              <div className="mt-7 w-full sm:mt-8">
                <h1 className="text-pretty text-[1.35rem] font-bold leading-snug tracking-tight text-slate-900 sm:text-2xl">
                  Before you book
                </h1>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600 sm:mt-4">
                  See what to expect, typical ranges, and a clear next step — general information only.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
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
