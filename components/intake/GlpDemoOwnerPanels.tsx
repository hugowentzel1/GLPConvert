"use client";

import { glpIntakeUi } from "@/lib/glp-intake-ui";

const DEFAULT_BRAND = "#0f172a";

/**
 * Shared owner-panel surface — same border / shadow / ring as `resultsContentCard`
 * so the owner block reads like *the same* surface deck as Path / Expectations /
 * Investment above it. The previous version mixed `bg-slate-50/80` and a brand-
 * tinted `linear-gradient` panel, which created the "scattered" feel the buyer
 * flagged. (Stripe Checkout & Linear billing cards: one surface token; "winner"
 * cards differentiate via a thin top accent bar, not a full background tint.)
 */
const OWNER_PANEL_SURFACE =
  "rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.04]";

/** Optional precomputed pricing href that preserves attribution (`buildIntakePricingHref` upstream). */
type Props = {
  companyName: string;
  monthlySessions: number;
  brandPrimary?: string;
  brandSecondary?: string | null;
  pricingHref?: string;
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
}: Props) {
  const { low, high } = estimateIllustrativeLeakMonthly(monthlySessions);
  /** Fallback preserves company only — caller should pass `pricingHref` from `buildIntakePricingHref(sp, company)` so UTMs/brand/logo persist. */
  const ctaHref = pricingHref ?? `/pricing?company=${encodeURIComponent(companyName)}`;

  return (
    <div className="space-y-4" data-owner-demo-panels>
      <p className="text-center text-[10px] text-slate-500">
        Owner preview · illustrative — not medical, legal, or financial advice.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className={OWNER_PANEL_SURFACE}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Today (without this)</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Cold clicks bounce. Cost and timing stay unclear. Consults stall at the form.
          </p>
        </div>
        {/**
         * "With this flow" reads as the *winner* via a 2px brand-colored top bar
         * (Stripe primary-card pattern), not a full background tint. Same flat
         * white surface as every other card on the page → cohesive deck.
         */}
        <div className={`relative overflow-hidden ${OWNER_PANEL_SURFACE}`}>
          <span
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
            style={{ backgroundColor: brandPrimary }}
            aria-hidden
          />
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">With this flow</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-800">
            Branded path, clear ranges, ready-to-book — straight to your scheduling link.
          </p>
        </div>
      </div>

      <div
        className={`${OWNER_PANEL_SURFACE} text-center sm:px-6 sm:py-6`}
        data-demo-owner-value
      >
        <p className={`${glpIntakeUi.bodyMuted} text-xs`}>
          Embeds in your site, ads, and landing pages — your logo, your colors, your booking link. Same traffic, more
          consults that turn into revenue.
        </p>
        <p className="mt-2 text-[11px] font-medium text-slate-600">
          ~${low.toLocaleString()}–${high.toLocaleString()}/mo modeled monthly upside on this traffic (illustrative) —
          not a guarantee.
        </p>
        <a
          href={ctaHref}
          className="mt-4 inline-flex min-h-[48px] w-full max-w-sm items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-[1.02] sm:w-auto"
          style={{ backgroundColor: brandPrimary }}
          data-demo-owner-cta
        >
          Activate for {companyName}
        </a>
      </div>

      <p className="text-center text-[10px] text-slate-400">Implementation questions? — contact from pricing.</p>
    </div>
  );
}
