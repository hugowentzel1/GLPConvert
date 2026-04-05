"use client";

/**
 * Horizontal “path preview” — milestone framing (not a medical forecast).
 * Premium white-label centerpiece; works with any accent color.
 */
export type MilestoneItem = { title: string; caption: string; detail: string };

export default function GlpPathMilestonePreview({
  items,
  brandFill,
}: {
  items: MilestoneItem[];
  brandFill: string;
}) {
  if (!items.length) return null;

  return (
    <div
      data-results-milestones
      className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/80 px-4 py-6 shadow-[0_2px_12px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.04] sm:px-6 sm:py-8"
    >
      <div className="mb-5 text-center sm:mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Path preview
        </p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
          What the journey often looks like
        </h3>
        <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-slate-500 sm:text-sm">
          Illustrative phases many clinics discuss before a consult — pace and plan are set by your provider.
        </p>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute left-[8%] right-[8%] top-[18px] hidden h-0.5 sm:block"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${brandFill}55 15%, ${brandFill}55 85%, transparent 100%)`,
          }}
          aria-hidden
        />
        <ul className="grid gap-6 sm:grid-cols-3 sm:gap-4">
          {items.map((m, i) => (
            <li key={m.title} className="relative flex flex-col items-center text-center">
              <span
                className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-md ring-4 ring-white"
                style={{ backgroundColor: brandFill }}
                aria-hidden
              >
                {i + 1}
              </span>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                {m.caption}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{m.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{m.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
