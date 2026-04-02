"use client";

import { glpIntakeUi } from "@/lib/glp-intake-ui";

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
}: {
  companyName: string;
  monthlySessions: number;
}) {
  const { low, high } = estimateIllustrativeLeakMonthly(monthlySessions);

  return (
    <div className={`${glpIntakeUi.stackSection}`}>
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-orange-50/30 p-6 md:p-8 shadow-sm">
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-amber-200/25 blur-3xl" aria-hidden />
        <p className={glpIntakeUi.kicker}>Owner-only · illustrative</p>
        <h3 className={`${glpIntakeUi.titleMd} mt-2`}>Where clarity converts</h3>
        <p className={`${glpIntakeUi.body} mt-4`}>
          Many programs invest in traffic, but visitors bounce when the path, price band, and next step stay vague. With
          roughly <span className="font-semibold tabular-nums text-slate-900">{monthlySessions.toLocaleString()}</span>{" "}
          sessions/mo as a working example, <span className="font-semibold text-slate-900">illustrative</span> math
          (not a guarantee) points to on the order of{" "}
          <span className="font-semibold tabular-nums text-amber-950">
            ${low.toLocaleString()}–${high.toLocaleString()}/mo
          </span>{" "}
          in consult value left on the table vs a clarity-first path—actuals depend on offer, traffic quality, and ops.
        </p>
        <p className={`${glpIntakeUi.bodyMuted} mt-4 text-[11px]`}>
          For discussion with {companyName} only. Not medical or financial advice. Individual results vary.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-6 shadow-sm">
          <p className={glpIntakeUi.kicker}>Typical static path</p>
          <ul className={`${glpIntakeUi.stackSm} mt-4 text-sm text-slate-700`}>
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden />
              Vague promises → hesitation
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden />
              Price shock at consult
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden />
              Low-intent or no-show bookings
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50/90 to-white p-6 shadow-sm ring-1 ring-emerald-100/50">
          <p className={`${glpIntakeUi.kicker} text-emerald-800`}>With this layer</p>
          <ul className={`${glpIntakeUi.stackSm} mt-4 text-sm text-slate-800`}>
            <li className="flex gap-2">
              <span className="font-bold text-emerald-600" aria-hidden>
                ✓
              </span>
              Clear process & expectations
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-emerald-600" aria-hidden>
                ✓
              </span>
              Price band before the ask
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-emerald-600" aria-hidden>
                ✓
              </span>
              Consult readiness before booking
            </li>
          </ul>
        </div>
      </div>

      <div className={`${glpIntakeUi.card} ${glpIntakeUi.cardPadSm} !shadow-sm`}>
        <h3 className={glpIntakeUi.titleMd}>Impact you can message (directionally)</h3>
        <ul className={`${glpIntakeUi.stackSm} mt-4 text-sm text-slate-700`}>
          <li className="flex gap-3">
            <span className="text-slate-400" aria-hidden>
              →
            </span>
            Clearer expectations before the consult
          </li>
          <li className="flex gap-3">
            <span className="text-slate-400" aria-hidden>
              →
            </span>
            Higher booking intent and fewer price surprises
          </li>
          <li className="flex gap-3">
            <span className="text-slate-400" aria-hidden>
              →
            </span>
            Branded experience on ads, landers, and site
          </li>
          <li className="flex gap-3">
            <span className="text-slate-400" aria-hidden>
              →
            </span>
            UTM + optional pixels for attribution
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-900/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 text-center text-white shadow-lg md:p-8">
        <p className="text-sm font-medium leading-relaxed text-white/95">
          Patients see the same flow above. Activate to deploy on your site and ads.
        </p>
        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a
            href={`/pricing?company=${encodeURIComponent(companyName)}`}
            className="inline-flex justify-center rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-900 shadow-md transition hover:bg-slate-50"
          >
            Subscribe & activate
          </a>
          <a
            href={`/contact?subject=${encodeURIComponent(`Questions before activating — ${companyName}`)}`}
            className="inline-flex justify-center rounded-xl border border-white/30 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Talk to us first
          </a>
        </div>
      </div>
    </div>
  );
}
