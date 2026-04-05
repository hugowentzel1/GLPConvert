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
    <div className={`${glpIntakeUi.stackSection}`} data-owner-demo-panels>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm md:p-6">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-slate-100/80 blur-3xl" aria-hidden />
        <p className={glpIntakeUi.kicker}>Owner-only · illustrative</p>
        <h3 className={`${glpIntakeUi.titleMd} mt-1`}>Clearer expectations → stronger consult intent</h3>
        <p className={`${glpIntakeUi.body} mt-3`}>
          Rough example using{" "}
          <span className="font-semibold tabular-nums text-slate-900">{monthlySessions.toLocaleString()}</span>{" "}
          sessions/mo: if even a small share of visitors books sooner when cost and timing are clearer first, modeled
          upside is on the order of{" "}
          <span className="font-semibold tabular-nums text-slate-900">
            ${low.toLocaleString()}–${high.toLocaleString()}/mo
          </span>{" "}
          in consult value — not a guarantee; depends on offer and ops.
        </p>
        <p className={`${glpIntakeUi.bodyMuted} mt-3 text-[11px]`}>
          For discussion with {companyName} only. Not medical, legal, or financial advice.
        </p>
        <p className={`${glpIntakeUi.body} mt-4 text-sm`}>
          <span className="font-semibold text-slate-800">Setup:</span> your domain, logo, and booking link — most teams
          ship live in one sitting.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Without a clarity layer</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Visitors guess timing and cost</li>
            <li>Consults can land cold or misaligned</li>
          </ul>
        </div>
        <div
          className="rounded-2xl border p-5 shadow-sm"
          style={{ borderColor: `${brandPrimary}40`, background: `linear-gradient(180deg, white, ${brandPrimary}08)` }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">With this flow</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-800">
            <li>Branded path matches your ads and site</li>
            <li>Process + range before the ask</li>
            <li>Light readiness signals for your team</li>
          </ul>
        </div>
      </div>

      <div
        className="rounded-2xl border border-white/10 px-5 py-7 text-center text-white shadow-lg md:px-8"
        style={{
          background: `linear-gradient(145deg, ${brandPrimary} 0%, ${secondary} 48%, #0f172a 100%)`,
        }}
      >
        <p className="text-sm font-medium leading-relaxed text-white/95">
          Same patient steps as production. Activate to run on your domain, embed, or landing pages.
        </p>
        <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={`/pricing?company=${encodeURIComponent(companyName)}`}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-semibold leading-snug shadow-md transition hover:bg-white/95"
            style={{ color: brandPrimary }}
            data-demo-owner-cta
          >
            <span>Activate for {companyName}</span>
          </a>
          <a
            href={`/contact?subject=${encodeURIComponent(`GLPConvert — ${companyName}`)}`}
            className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-white/30 bg-white/10 px-5 py-4 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/15"
          >
            Talk to us first
          </a>
        </div>
      </div>
    </div>
  );
}
