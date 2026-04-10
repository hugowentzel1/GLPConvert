"use client";

import { useMemo, useState } from "react";

/** Illustrative only — not a performance guarantee. */
export default function DemoRoiTeaser() {
  const [adSpend, setAdSpend] = useState(8000);
  const [liftPct, setLiftPct] = useState(12);

  const extra = useMemo(() => {
    const v = (adSpend * (liftPct / 100)) / 30;
    return Number.isFinite(v) ? Math.max(0, v) : 0;
  }, [adSpend, liftPct]);

  return (
    <div
      className="mx-auto mt-6 max-w-xl rounded-2xl border border-slate-200/90 bg-slate-50/80 px-5 py-4 text-left shadow-sm"
      data-home-roi-teaser
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Illustrative math (not a guarantee)
      </p>
      <p className="mt-2 text-sm text-slate-700">
        If a modest lift in click-to-booked rate recovered even part of monthly ad spend, what would that mean for your clinic?
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-xs text-slate-600">
          Monthly ad spend ($)
          <input
            type="number"
            min={0}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            value={adSpend}
            onChange={(e) => setAdSpend(Number(e.target.value))}
          />
        </label>
        <label className="block text-xs text-slate-600">
          Hypothetical booking-rate lift (%)
          <input
            type="number"
            min={0}
            max={100}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            value={liftPct}
            onChange={(e) => setLiftPct(Number(e.target.value))}
          />
        </label>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-800">
        ≈ ${extra.toFixed(0)}/day in recovered pipeline value at those assumptions (before fees) — varies widely by offer and market.
      </p>
    </div>
  );
}
