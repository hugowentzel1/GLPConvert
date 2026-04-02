"use client";

import { glpIntakeUi } from "@/lib/glp-intake-ui";

const DEFAULT_BRAND = "#0f172a";

/** Illustrative only — not a financial guarantee. Conservative uplift assumptions for owner conversations. */
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
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.06)] md:p-8">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-slate-100/80 blur-3xl" aria-hidden />
        <p className={glpIntakeUi.kicker}>Owner view · illustrative math</p>
        <h3 className={`${glpIntakeUi.titleMd} mt-2`}>Revenue left on the table when the path stays vague</h3>
        <p className={`${glpIntakeUi.body} mt-4`}>
          Clinics often pay for clicks, then lose people to uncertainty—what happens next, what it costs, whether they’re
          ready. Using{" "}
          <span className="font-semibold tabular-nums text-slate-900">{monthlySessions.toLocaleString()}</span> sessions
          /mo as a <span className="font-semibold text-slate-900">working example only</span>, a{" "}
          <span className="font-semibold">conservative</span> illustrative model (~2.2% of sessions that might book at a
          higher intent if expectations were clearer) suggests on the order of{" "}
          <span className="font-semibold tabular-nums text-slate-900">
            ${low.toLocaleString()}–${high.toLocaleString()}/mo
          </span>{" "}
          in consult value not captured vs a clarity-first path. Actuals depend on offer, traffic quality, and ops—not a
          promise.
        </p>
        <p className={`${glpIntakeUi.bodyMuted} mt-4 text-[11px] leading-relaxed`}>
          For discussion with {companyName} only. Not medical, legal, or financial advice. Individual results vary.
        </p>
      </div>

      <div>
        <p className={`${glpIntakeUi.kicker} mb-4 text-center`}>Before vs after</p>
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-stretch md:gap-2">
          <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-slate-50/90 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Typical static funnel</p>
            <ul className={`${glpIntakeUi.stackSm} mt-4 flex-1 text-sm text-slate-700`}>
              <li className="flex gap-3 border-l-2 border-slate-300 pl-3">
                Generic landing copy → visitor uncertainty
              </li>
              <li className="flex gap-3 border-l-2 border-slate-300 pl-3">Price shock or mismatch at consult</li>
              <li className="flex gap-3 border-l-2 border-slate-300 pl-3">Low-intent bookings and no-shows</li>
            </ul>
          </div>
          <div className="hidden items-center justify-center md:flex" aria-hidden>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-lg font-semibold text-slate-400">
              →
            </span>
          </div>
          <div className="flex flex-col rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/95 to-white p-6 shadow-sm ring-1 ring-emerald-100/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">With this layer</p>
            <ul className={`${glpIntakeUi.stackSm} mt-4 flex-1 text-sm text-slate-800`}>
              <li className="flex gap-2 border-l-2 border-emerald-400 pl-3">
                <span className="font-bold text-emerald-600" aria-hidden>
                  ✓
                </span>
                Branded, calm intake — feels native to your ads and site
              </li>
              <li className="flex gap-2 border-l-2 border-emerald-400 pl-3">
                <span className="font-bold text-emerald-600" aria-hidden>
                  ✓
                </span>
                Process + price band before the ask
              </li>
              <li className="flex gap-2 border-l-2 border-emerald-400 pl-3">
                <span className="font-bold text-emerald-600" aria-hidden>
                  ✓
                </span>
                Consult readiness signals for your team
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={`${glpIntakeUi.card} ${glpIntakeUi.cardPadSm} border-slate-200/90 !shadow-sm`}>
        <h3 className={glpIntakeUi.titleMd}>Why clinics use this layer (directional)</h3>
        <ul className={`${glpIntakeUi.stackSm} mt-4 text-sm text-slate-700`}>
          <li className="flex gap-3">
            <span className="text-slate-400" aria-hidden>
              →
            </span>
            Clearer expectations before the consult (reduces anxiety and mismatch)
          </li>
          <li className="flex gap-3">
            <span className="text-slate-400" aria-hidden>
              →
            </span>
            Higher-intent bookings; fewer price surprises
          </li>
          <li className="flex gap-3">
            <span className="text-slate-400" aria-hidden>
              →
            </span>
            Same flow in demo and production — demo adds this owner summary only
          </li>
          <li className="flex gap-3">
            <span className="text-slate-400" aria-hidden>
              →
            </span>
            UTM persistence + webhook-ready leads for attribution (see docs)
          </li>
        </ul>
      </div>

      <div
        className="rounded-2xl border border-white/10 px-6 py-8 text-center text-white shadow-[0_12px_40px_rgba(15,23,42,0.18)] md:px-10"
        style={{
          background: `linear-gradient(145deg, ${brandPrimary} 0%, ${secondary} 50%, #0f172a 100%)`,
        }}
      >
        <p className="text-sm font-medium leading-relaxed text-white/95">
          Patients see the same steps above. Activate to run this on your domain, embed, or landing pages.
        </p>
        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
          <a
            href={`/pricing?company=${encodeURIComponent(companyName)}`}
            className="inline-flex justify-center rounded-xl bg-white px-5 py-3.5 text-sm font-semibold shadow-md transition hover:bg-white/95 hover:shadow-lg"
            style={{ color: brandPrimary }}
          >
            View plans &amp; activate
          </a>
          <a
            href={`/contact?subject=${encodeURIComponent(`GLPConvert — ${companyName}`)}`}
            className="inline-flex justify-center rounded-xl border border-white/35 bg-white/5 px-5 py-3.5 text-sm font-medium text-white backdrop-blur-[2px] transition hover:bg-white/15"
          >
            Question before checkout
          </a>
        </div>
      </div>
    </div>
  );
}
