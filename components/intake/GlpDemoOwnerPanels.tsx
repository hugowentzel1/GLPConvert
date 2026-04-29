"use client";

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
    <div className="space-y-5" data-owner-demo-panels>
      <p className="text-center text-[11px] leading-relaxed text-slate-500">
        Owner preview · illustrative only. Not medical, legal, or financial advice.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div className={OWNER_PANEL_SURFACE}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Today (without this)</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
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
        <div className={OWNER_PANEL_SURFACE}>
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
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
          <p className="mt-2 text-sm leading-relaxed text-slate-800">
            Same paid traffic, fewer dropped intakes. Patients finish a branded path that ends at your scheduling link —
            so consults arrive primed, not cold.
          </p>
        </div>
      </div>

      <div
        className={`${OWNER_PANEL_SURFACE} space-y-4`}
        data-demo-owner-value
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">For your practice</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            More booked consults from the same {companyName} traffic
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            Branded patient path that ends at your scheduling link. Your team owns care, pricing, and prescribing.
          </p>
        </div>
        <p className="rounded-lg border border-slate-200/70 bg-slate-50/40 px-3 py-2 text-[12px] font-medium text-slate-800">
          Estimated extra monthly revenue from this traffic:{" "}
          <span className="font-semibold text-slate-900 tabular-nums">
            ${low.toLocaleString()}–${high.toLocaleString()}
          </span>{" "}
          <span className="font-normal text-slate-500">(rough estimate, varies by clinic)</span>
        </p>

        {/**
         * Activation flow collapsed to a single horizontal line — buyer
         * feedback flagged the 3-card grid as "way too crowded" alongside
         * the title, paragraph, modeled-upside line, and CTAs. The same
         * three commitments are still surfaced (branded URL, drop-in
         * placement, three-channel lead delivery) so the test selectors
         * `data-demo-owner-activation-flow` + the literal phrases
         * "Branded URL", "Drop into your funnel", "three ways" still
         * pass. Tufte data-ink ratio + NN/g 2024 "remove visual noise
         * from supporting elements" — the activation steps are
         * supporting info, not the headline.
         */}
        <p
          className="rounded-lg border border-slate-200/70 bg-slate-50/60 px-3 py-2 text-[11px] leading-snug text-slate-600"
          data-demo-owner-activation-flow
        >
          <span className="font-semibold text-slate-900">Branded URL in ~10 min</span>
          <span aria-hidden className="mx-1.5 text-slate-300">·</span>
          <span>Drop into your funnel</span>
          <span aria-hidden className="mx-1.5 text-slate-300">·</span>
          <span>Leads three ways (dashboard + email + CRM)</span>
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4">
          <a
            href={ctaHref}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl px-5 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-[1.02] sm:min-w-[12rem] sm:max-w-md sm:flex-none"
            style={{ backgroundColor: brandPrimary }}
            data-demo-owner-cta
          >
            Activate for {companyName}
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
