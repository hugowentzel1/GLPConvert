"use client";

/**
 * Trust signals for healthcare-adjacent B2B SaaS: accurate, non-overclaiming.
 * GLPConvert is software for clinics — covered entities remain responsible for PHI programs under their BAAs.
 */
export default function IntakeTrustRibbon() {
  const items = [
    { t: "HTTPS encryption", d: "Data moves over TLS in the browser." },
    { t: "Your leads, your follow-up", d: "Submissions route to your team and tools." },
    { t: "Educational layer", d: "Not a medical device; no diagnosis or dosing." },
    { t: "Compliance is shared", d: "Use BAAs with your CRM, email, and EHR as you already do." },
  ] as const;

  return (
    <div
      data-intake-trust
      className="mx-auto mb-8 w-full max-w-2xl rounded-2xl border border-slate-200/90 bg-white/80 px-4 py-3 shadow-sm ring-1 ring-slate-900/[0.03] backdrop-blur-[2px] md:px-5"
    >
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Trust & operations
      </p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map(({ t, d }) => (
          <li key={t} className="flex gap-2.5 text-left">
            <span
              className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/90"
              aria-hidden
            />
            <span className="min-w-0">
              <span className="block text-xs font-semibold text-slate-800">{t}</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">{d}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
