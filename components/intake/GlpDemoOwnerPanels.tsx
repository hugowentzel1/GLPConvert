"use client";

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
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">Owner preview — illustrative</p>
        <h3 className="text-lg font-bold text-slate-900">Where revenue leaks today</h3>
        <p className="text-sm text-slate-700">
          Many GLP programs pay for traffic, but visitors leave before they understand the path, price band, or next step.
          If roughly <span className="font-semibold">{monthlySessions.toLocaleString()}</span> sessions/month hit a typical
          vague funnel, <span className="font-semibold">illustrative</span> math (not a guarantee) suggests on the order of{" "}
          <span className="font-semibold">
            ${low.toLocaleString()}–${high.toLocaleString()}/mo
          </span>{" "}
          in <em>additional</em> consult value left on the table vs a clarity-first path—actuals depend on offer, traffic
          quality, and ops.
        </p>
        <p className="text-xs text-amber-900/90">
          For discussion with {companyName} only. Not medical or financial advice. Individual results vary.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase">Typical static funnel</p>
          <ul className="mt-2 text-sm text-slate-700 space-y-1 list-disc list-inside">
            <li>Vague promises → hesitation</li>
            <li>Price shock at consult</li>
            <li>High no-show / low intent</li>
          </ul>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
          <p className="text-xs font-semibold text-emerald-800 uppercase">GLPConvert path</p>
          <ul className="mt-2 text-sm text-slate-800 space-y-1 list-disc list-inside">
            <li>Clear process & expectations</li>
            <li>Price band before the ask</li>
            <li>Consult readiness before booking</li>
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
        <h3 className="text-base font-semibold text-slate-900">Why clinics use this layer</h3>
        <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
          <li>More of your existing traffic understands what happens before the consult.</li>
          <li>Higher-intent bookings with fewer price surprises.</li>
          <li>Branded experience that lives on ads, landers, and your site.</li>
          <li>Attribution-friendly (UTM + optional pixels) for ROI conversations.</li>
        </ul>
      </div>

      <div className="rounded-xl border border-slate-900/10 bg-slate-900 text-white p-4 text-center">
        <p className="text-sm font-medium">Ready to run this for real?</p>
        <a
          href={`/contact?subject=${encodeURIComponent(`Activate GLPConvert for ${companyName}`)}`}
          className="mt-2 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900"
        >
          Activate this for {companyName}
        </a>
      </div>
    </div>
  );
}
