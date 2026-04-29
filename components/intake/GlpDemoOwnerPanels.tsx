"use client";

import { glpIntakeUi } from "@/lib/glp-intake-ui";

const DEFAULT_BRAND = "#0f172a";

const PANEL =
  "rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.04] sm:p-6";

type Props = {
  companyName: string;
  monthlySessions: number;
  brandPrimary?: string;
  brandSecondary?: string | null;
  pricingHref?: string;
  supportHref?: string;
};

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
  const ctaHref = pricingHref ?? `/pricing?company=${encodeURIComponent(companyName)}`;
  const helpHref = supportHref ?? `/support?company=${encodeURIComponent(companyName)}`;

  return (
    <div className="space-y-4" data-owner-demo-panels>
      <p className="text-center text-[11px] leading-relaxed text-slate-500">
        Clinic owner preview (demo). Illustrative positioning only — not medical, legal, or financial advice.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div className={PANEL}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Without this layer</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Cold clicks bounce before a clear next step. Cost and timing stay fuzzy, and consults stall at the form.
          </p>
        </div>
        <div className={PANEL}>
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
            Same paid traffic, fewer dropped intakes. Patients finish a branded path that ends at your scheduling link.
          </p>
        </div>
      </div>

      <div className={`${PANEL} space-y-4`} data-demo-owner-value>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">For your practice</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            Book more consults from the same {companyName} traffic
          </p>
          <p className={`${glpIntakeUi.bodyMuted} mt-2 text-xs leading-relaxed`}>
            Hosted page or embed; your logo, color, and booking link. The chart above reflects the patient&apos;s inputs —
            your team still prescribes, packages, and prices care.
          </p>
        </div>
        <p className="text-xs font-medium text-slate-700">
          ~${low.toLocaleString()}–${high.toLocaleString()}/mo modeled upside on this traffic (illustrative) — not a
          guarantee.
        </p>

        <ol
          className="list-none space-y-3 border-t border-slate-100 pt-4 text-[12px] leading-snug text-slate-600"
          data-demo-owner-activation-flow
        >
          <li className="flex gap-2">
            <span className="mt-0.5 font-semibold text-slate-900">1.</span>
            <span>
              <strong className="font-medium text-slate-800">Go-live assets in ~10 minutes</strong> — hosted link +
              embed snippet after checkout.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 font-semibold text-slate-900">2.</span>
            <span>
              <strong className="font-medium text-slate-800">Drop into any funnel</strong> — ads, email, site, or{' '}
              <span className="whitespace-nowrap">book.yourclinic.com</span>.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 font-semibold text-slate-900">3.</span>
            <span>
              <strong className="font-medium text-slate-800">Leads everywhere you work</strong> — dashboard, inbox, CRM
              webhook.
            </span>
          </li>
        </ol>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
          <a
            href={helpHref}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:order-1 sm:min-w-[10.5rem] sm:flex-none"
            data-demo-owner-support
          >
            Contact support
          </a>
          <a
            href={ctaHref}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl px-5 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-[1.02] sm:order-2 sm:min-w-[12rem] sm:flex-none"
            style={{ backgroundColor: brandPrimary }}
            data-demo-owner-cta
          >
            Activate for {companyName}
          </a>
        </div>
      </div>
    </div>
  );
}
