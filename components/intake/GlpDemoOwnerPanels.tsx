"use client";

import { glpIntakeUi } from "@/lib/glp-intake-ui";

const DEFAULT_BRAND = "#0f172a";

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

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Today (without this)</p>
          <p className="mt-2 text-sm text-slate-600">
            Cold clicks bounce. Cost and timing stay unclear. Consults stall at the form.
          </p>
        </div>
        <div
          className="rounded-xl border p-4 shadow-sm"
          style={{ borderColor: `${brandPrimary}30`, background: `linear-gradient(180deg, white, ${brandPrimary}05)` }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">With this flow</p>
          <p className="mt-2 text-sm text-slate-800">
            Branded path, clear ranges, ready-to-book — straight to your scheduling link.
          </p>
        </div>
      </div>

      <div
        className="rounded-xl border border-slate-200/90 bg-white px-4 py-5 text-center shadow-sm sm:px-6"
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
