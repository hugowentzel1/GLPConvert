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
  brandSecondary: _brandSecondary = null,
}: {
  companyName: string;
  monthlySessions: number;
  brandPrimary?: string;
  brandSecondary?: string | null;
}) {
  const { low, high } = estimateIllustrativeLeakMonthly(monthlySessions);

  return (
    <div className="space-y-4" data-owner-demo-panels>
      <p className="text-center text-[10px] text-slate-500">
        Owner preview · illustrative — not medical, legal, or financial advice.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Without this step</p>
          <p className="mt-2 text-sm text-slate-600">Traffic guesses cost and timing; consults stay colder.</p>
        </div>
        <div
          className="rounded-xl border p-4 shadow-sm"
          style={{ borderColor: `${brandPrimary}30`, background: `linear-gradient(180deg, white, ${brandPrimary}05)` }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">With this flow</p>
          <p className="mt-2 text-sm text-slate-800">
            Branded path, ranges, and readiness — then your booking link.
          </p>
        </div>
      </div>

      <div
        className="rounded-xl border border-slate-200/90 bg-white px-4 py-5 text-center shadow-sm sm:px-6"
        data-demo-owner-value
      >
        <p className={`${glpIntakeUi.bodyMuted} text-xs`}>
          Runs on your site, ads, or landing pages. Uses your logo, color, and scheduling link.
        </p>
        <p className="mt-2 text-[11px] font-medium text-slate-600">
          ~${low.toLocaleString()}–${high.toLocaleString()}/mo modeled upside (example traffic) — not a guarantee.
        </p>
        <a
          href={`/pricing?company=${encodeURIComponent(companyName)}`}
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
