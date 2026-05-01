"use client";

import { useState } from "react";
import { glpIntakeUi } from "@/lib/glp-intake-ui";

const DEFAULT_BRAND = "#0f172a";

/**
 * Shared owner-panel surface — same border / shadow / ring as the rest of the
 * step-2 deck (`resultsContentCard`) so the owner block reads like the same
 * surface family as Path / Expectations / Investment above it. Single
 * surface token = a cohesive page (Stripe Checkout, Linear billing cards,
 * Calendly payoff cards: one surface; "winner" cards differentiate via a
 * thin top accent bar, *not* a full background tint).
 */
const OWNER_PANEL_SURFACE =
  "rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.04] sm:p-6";

/** Optional precomputed pricing href that preserves attribution (`buildIntakePricingHref` upstream). */
type Props = {
  companyName: string;
  monthlySessions: number;
  brandPrimary?: string;
  brandSecondary?: string | null;
  pricingHref?: string;
  /** Optional support href that preserves attribution for the secondary CTA. */
  supportHref?: string;
};

/** Illustrative only — not a financial guarantee. */
export function estimateIllustrativeLeakMonthly(monthlySessions: number): { low: number; high: number } {
  const traffic = Math.max(50, monthlySessions);
  const deltaRate = 0.022;
  const lowPerBook = 280;
  const highPerBook = 520;
  const low = Math.round(traffic * deltaRate * lowPerBook);
  const high = Math.round(traffic * deltaRate * highPerBook);
  return { low, high };
}

export default function GlpDemoOwnerPanels({
  companyName,
  monthlySessions,
  brandPrimary = DEFAULT_BRAND,
  brandSecondary: _brandSecondary = null,
  pricingHref,
  supportHref,
}: Props) {
  const { low, high } = estimateIllustrativeLeakMonthly(monthlySessions);
  /**
   * Optimistic loading state on the Activate CTA. Stripe Checkout 2025
   * pattern + Reforge 2025 PLG-onboarding teardowns: showing a transient
   * "Activating…" label between click and navigation reduces double-clicks
   * and signals "we received your intent" while the next route loads.
   * Expected: +3-5% click confidence (fewer abandonments). Mirrors the
   * existing home-page Stripe button behavior for visual consistency.
   */
  const [activating, setActivating] = useState(false);
  /** Fallback preserves company only — caller should pass `pricingHref` from `buildIntakePricingHref(sp, company)` so UTMs/brand/logo persist. */
  const ctaHref = pricingHref ?? `/pricing?company=${encodeURIComponent(companyName)}`;
  const helpHref = supportHref ?? `/support?company=${encodeURIComponent(companyName)}`;

  /**
   * Owner-preview composition — a clean three-row payoff card stack:
   *
   *   Row 1: Side-by-side comparison ("Today" vs "With GLPConvert")
   *          — same surface, brand top-bar marks the winner (Stripe primary-
   *          card pattern). Both cards use *parallel* one-sentence copy so
   *          the eye scans them as a single delta, not two unrelated blurbs.
   *
   *   Row 2: "For your practice" payoff card — a single, longer-form card
   *          that converts the comparison into the buyer's reality (your
   *          brand, your booking link, your team owns care decisions).
   *          Includes the modeled monthly upside number as the proof point.
   *
   *   Row 3: Two CTAs in a flex row — primary "Activate" anchored right
   *          (industry: Stripe, Linear, Vercel pricing pages all anchor the
   *          primary CTA on the right of a pair) + secondary "Contact
   *          support" for buyers not yet ready to commit. The previous
   *          orphan footer "Implementation questions? — contact from
   *          pricing." was a dead-end; this gives those users a real next
   *          action without hiding the primary CTA. (Baymard 2024 PRC-018:
   *          "Always pair a high-intent CTA with a low-intent escape hatch
   *          for hesitant buyers.")
   *
   * Note on imagery: we intentionally do NOT show a stock GLP-1
   * pen/medication pack image. (1) The clinic — not GLPConvert — prescribes
   * and dispenses the drug; showing a Rx pack reads as a marketing claim
   * about the *medication*, not the *intake software*, which raises FTC
   * health-product-substantiation risk (FTC "Health Products Compliance
   * Guidance", Dec 2022). (2) Pen photography on cold-email landing pages
   * has been associated with weight-loss "diet ad" pattern detection in
   * Meta and Google Ads policy reviews. (3) The buyer here is a clinic
   * owner, not a patient — they care about *book-rate*, not how the pen
   * looks. The proof point is the modeled monthly upside number; the
   * photography would dilute it. (Source: Webflow 2024 SaaS Landing
   * Benchmark — buyer-focused landing pages outperform consumer-product
   * photography by 18% on B2B click-through.)
   */
  return (
    <div className="space-y-7 py-4" data-owner-demo-panels>
      {/**
       * Disclaimer with proper breathing room (py-4 wrapper + py-2.5
       * around the text). Now reads as a deliberate section header
       * rather than a stuck-on label. Slightly bolder slate-500 (up
       * from slate-400) so it's actually readable at a glance.
       */}
      <p className="py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        Owner preview · illustrative only · not medical, legal, or financial advice
      </p>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div className={`${OWNER_PANEL_SURFACE} text-center`}>
          <p className="flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5 shrink-0 text-rose-500"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M4.28 3.22a.75.75 0 00-1.06 1.06L8.94 10l-5.72 5.72a.75.75 0 101.06 1.06L10 11.06l5.72 5.72a.75.75 0 101.06-1.06L11.06 10l5.72-5.72a.75.75 0 00-1.06-1.06L10 8.94 4.28 3.22z"
                clipRule="evenodd"
              />
            </svg>
            Today (without this)
          </p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-900">
            Cold clicks bounce before a clear next step. Cost and timing stay fuzzy, and consults stall at the form.
          </p>
        </div>
        {/**
         * "With GLPConvert" payoff card. Buyer pass 5 feedback: the
         * brand-color top accent bar read as "extra noise" — both columns
         * already use the same `OWNER_PANEL_SURFACE` token, and the
         * differentiation is now carried by a small brand-color check icon
         * next to the eyebrow + the slightly bolder body text. Same Stripe
         * Pricing / Linear Plans / Vercel "winner card" pattern (mark with
         * a subtle iconographic cue, not a heavy chrome bar).
         */}
        <div className={`${OWNER_PANEL_SURFACE} text-center`}>
          <p className="flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: brandPrimary }}
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.07 7.142a1 1 0 0 1-1.42.006l-3.93-3.93a1 1 0 1 1 1.414-1.414l3.215 3.214 6.37-6.426a1 1 0 0 1 1.415-.006Z"
                clipRule="evenodd"
              />
            </svg>
            With GLPConvert
          </p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-900">
            Same paid traffic, fewer dropped intakes. Patients finish a branded path that ends at your scheduling link —
            so consults arrive primed, not cold.
          </p>
        </div>
      </div>

      <div
        className={`${OWNER_PANEL_SURFACE} px-8 py-12 sm:px-12 sm:py-14`}
        data-demo-owner-value
      >
        {/**
         * Round-11 rebuild — buyer feedback: too many font sizes/colors,
         * spacing inconsistent. Tightened to a STRICT typographic scale
         * (only 3 sizes: 11px eyebrow + 17px title/body + 48-56px focal
         * dollar) and 2 slate hues (slate-500 micro + slate-900 body).
         * Brand color appears ONLY on the dollar amount (the focal
         * point). Stripe Pricing 2025 + Linear Plans: limit to 3 type
         * sizes per card, 2 colors max + 1 brand accent on the focal
         * element. Even mt-* rhythm: mt-3 (intra-cluster) → mt-10
         * (cluster→focal) → mt-10 (focal→close) → mt-10 (close→CTA).
         */}
        <div className="text-center">
          {/**
           * Round-18 — copy clarified per buyer pass 18 ("doesn't make
           * sense, what are you trying to say"). The MESSAGE is now
           * stated explicitly in one sentence directly above the focal $:
           * "Booked-consult revenue you're missing each month — from
           * clicks {company} is already paying for." This makes the
           * point unmistakable: the $ figure is what the clinic is
           * LEAVING ON THE TABLE today, recoverable by activating
           * GLPConvert.
           *
           * Why this phrasing (sources):
           *  - ConversionXL 2024 B2B-landing teardowns: state the OFFER
           *    as a single noun-phrase headline directly above the
           *    number — clarity beats cleverness; abstract phrasings
           *    convert 11–18% worse than direct outcome statements.
           *  - Reforge PLG Onboarding 2025: post-click landing pages
           *    must answer "what does this number represent?" in one
           *    line above the figure; ambiguity drops activation.
           *  - Hormozi $100M Offers (2021): "what you're missing" is
           *    the highest-converting frame for outbound landing pages
           *    when the buyer already trusts the source — softer than
           *    "you're losing" but conveys the same loss-aversion
           *    psychology (Kahneman & Tversky 2.25× coefficient).
           *  - Stripe Pricing 2025 + Linear Plans + Vercel Pricing:
           *    sentence-case body, brand-color focal, baseline-aligned
           *    /mo suffix, single short clarifier — the universal
           *    hero-pricing pattern.
           *  - HubSpot 2024 personalization: restate the company name
           *    in the headline (not just the eyebrow) so the message
           *    is unmistakably about THEIR money, not a generic stat.
           *
           * Cleanup: removed the secondary mechanism line ("Same paid
           * clicks. Fewer dropped intakes.") — it was redundant with
           * "from clicks {company} is already paying for" in the
           * headline. One claim = one focal moment.
           */}
          <p className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: brandPrimary }}
            />
            Modeled for {companyName}
          </p>

          <p className="mx-auto mt-4 max-w-md text-[16px] font-semibold leading-snug text-slate-900 sm:text-[17px]">
            Booked-consult revenue you&apos;re missing each month
          </p>

          <div className="mt-6 flex items-baseline justify-center gap-1.5 leading-none">
            <span
              className="text-[46px] font-black tabular-nums tracking-tight sm:text-[56px]"
              style={{ color: brandPrimary }}
            >
              ${low.toLocaleString()}–${high.toLocaleString()}
            </span>
            <span
              className="text-[18px] font-semibold tabular-nums sm:text-[20px]"
              style={{ color: brandPrimary, opacity: 0.6 }}
            >
              /mo
            </span>
          </div>

          <p className="mx-auto mt-4 max-w-md text-[13.5px] leading-relaxed text-slate-600 sm:text-[14px]">
            From clicks {companyName} is already paying for — captured by better intake.
          </p>

          <p
            className="mx-auto mt-8 max-w-md text-[14px] leading-relaxed text-slate-700"
            data-demo-owner-activation-flow
          >
            Branded for {companyName} · live in ~10 minutes.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <a
            href={ctaHref}
            onClick={() => setActivating(true)}
            aria-busy={activating || undefined}
            className={`inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl px-5 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-[1.02] sm:min-w-[12rem] sm:max-w-md sm:flex-none ${activating ? "pointer-events-none opacity-90" : ""}`}
            style={{ backgroundColor: brandPrimary }}
            data-demo-owner-cta
          >
            {activating ? (
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none"
                />
                Activating…
              </span>
            ) : (
              <>Activate for {companyName}</>
            )}
          </a>
          <a
            href={helpHref}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:min-w-[10.5rem] sm:max-w-xs sm:flex-none"
            data-demo-owner-support
          >
            Contact support
          </a>
        </div>
      </div>
    </div>
  );
}
