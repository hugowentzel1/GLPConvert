"use client";

import { glpIntakeUi } from "@/lib/glp-intake-ui";

const DEFAULT_BRAND = "#0f172a";

/**
 * Shared owner-panel surface — same border / shadow / ring as other step-2 cards.
 * (Stripe-style: one surface token; "winner" column = thin brand top bar only.)
 */
const OWNER_PANEL_SURFACE =
  "rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.04]";

type Props = {
  companyName: string;
  monthlySessions: number;
  brandPrimary?: string;
  brandSecondary?: string | null;
  pricingHref?: string;
  /** Preserves UTMs + branding; fallback is encodeURIComponent company only. */
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

/**
 * Demo-only owner block. Copy kept short; one primary CTA (NN/g primary-action hierarchy).
 * We do not show drug/product pack photography here: FTC health-ad presentation and buyer
 * trust are better served by the Path tiles + "illustrative" framing than by stock Rx imagery.
 */
export default function GlpDemoOwnerPanels({
  companyName,
  monthlySessions,
  brandPrimary = DEFAULT_BRAND,
  brandSecondary: _brandSecondary = null,
  pricingHref,
  supportHref,
}: Props) {
  const { low, high } = estimateIllustrativeLeakMonthly(monthlySessions);
  const ctaHref = pricingHref ?? `/pricing?company=${encodeURIComponent(companyName)}`;
  const helpHref = supportHref ?? `/support?company=${encodeURIComponent(companyName)}`;

  return (
    <div className="space-y-5" data-owner-demo-panels>
      <p className="text-center text-[11px] leading-relaxed text-slate-500">
        Owner preview · illustrative only. Not medical, legal, or financial advice.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div className={OWNER_PANEL_SURFACE}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Today (without this)</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Clicks from ads and your site often bounce before a clear next step. Consults stall when cost and timing stay
            fuzzy.
          </p>
        </div>
        <div className={`relative overflow-hidden ${OWNER_PANEL_SURFACE}`}>
          <span
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
            style={{ backgroundColor: brandPrimary }}
            aria-hidden
          />
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">With GLPConvert</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-800">
            A short, branded path with clear ranges, then your scheduling link—same traffic, less leakage.
          </p>
        </div>
      </div>

      <div className={`${OWNER_PANEL_SURFACE} space-y-4`} data-demo-owner-value>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">For your practice</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">Book more consults from the same traffic</p>
          <p className={`${glpIntakeUi.bodyMuted} mt-2 text-xs leading-relaxed`}>
            {companyName}&apos;s logo, color, and booking link on site, ads, and landing pages. The Path row above
            reflects the direction the patient chose—your team prescribes, packages, and prices care.
          </p>
        </div>
        <p className="text-xs font-medium text-slate-600">
          ~${low.toLocaleString()}–${high.toLocaleString()}/mo modeled monthly upside on this traffic (illustrative) — not
          a guarantee.
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
