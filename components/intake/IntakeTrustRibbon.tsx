"use client";

/**
 * Minimal trust line — high signal, low visual weight. Full ops detail lives in footer / legal.
 */
export default function IntakeTrustRibbon() {
  return (
    <div
      data-intake-trust
      className="mx-auto mb-5 max-w-2xl border-b border-slate-200/70 pb-4 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400"
    >
      <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <span>Encrypted connection</span>
        <span className="text-slate-300" aria-hidden>
          ·
        </span>
        <span>Routed to your clinic</span>
        <span className="text-slate-300" aria-hidden>
          ·
        </span>
        <span>General information — not medical advice</span>
      </span>
    </div>
  );
}
