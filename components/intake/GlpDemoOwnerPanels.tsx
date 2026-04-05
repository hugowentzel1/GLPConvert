"use client";

import { glpIntakeUi } from "@/lib/glp-intake-ui";

const DEFAULT_BRAND = "#0f172a";

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
  brandSecondary = null,
}: {
  companyName: string;
  monthlySessions: number;
  brandPrimary?: string;
  brandSecondary?: string | null;
}) {
  const { low, high } = estimateIllustrativeLeakMonthly(monthlySessions);
  const secondary = brandSecondary || brandPrimary;

  return (
    <div className="space-y-4" data-owner-demo-panels>
      <p className="text-center text-[11px] text-slate-500">
        Owner preview · illustrative — not medical, legal, or financial advice.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Without this step</p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
            <li>Visitors guess cost and timing</li>
            <li>Colder consults</li>
          </ul>
        </div>
        <div
          className="rounded-xl border p-4 shadow-sm"
          style={{ borderColor: `${brandPrimary}35`, background: `linear-gradient(180deg, white, ${brandPrimary}06)` }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">With this flow</p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-800">
            <li>Branded path + range before the ask</li>
            <li>Light readiness signals</li>
          </ul>
        </div>
      </div>

      <div
        className="rounded-2xl border border-white/10 px-4 py-6 text-center text-white shadow-md sm:px-6"
        style={{
          background: `linear-gradient(145deg, ${brandPrimary} 0%, ${secondary} 48%, #0f172a 100%)`,
        }}
      >
        <p className={`${glpIntakeUi.body} text-sm text-white/95`}>
          ~${low.toLocaleString()}–${high.toLocaleString()}/mo modeled upside (example traffic) — not a guarantee.
        </p>
        <div className="mt-4 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:justify-center">
          <a
            href={`/pricing?company=${encodeURIComponent(companyName)}`}
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold shadow-md transition hover:bg-white/95"
            style={{ color: brandPrimary }}
            data-demo-owner-cta
          >
            Activate for {companyName}
          </a>
          <a
            href={`/contact?subject=${encodeURIComponent(`GLPConvert — ${companyName}`)}`}
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/25 px-4 py-3 text-xs font-medium text-white/90 hover:bg-white/10"
          >
            Questions first
          </a>
        </div>
      </div>
    </div>
  );
}
