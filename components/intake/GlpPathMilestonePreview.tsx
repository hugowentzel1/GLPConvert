"use client";

import { motion, useReducedMotion } from "framer-motion";

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
  const reduceMotion = useReducedMotion();
  if (!items.length) return null;

  return (
    <motion.div
      data-results-milestones
      /**
       * Flat-white surface to match every other card on step 2 (`resultsContentCard`,
       * `resultsContentCardLg`, `resultsSummaryCard`, `resultsDetailsCard`). Previous
       * version used `bg-gradient-to-b from-white to-slate-50/80`, which made this
       * one card read as "the gradient one" while every other card on the page was
       * flat — i.e. the "scattered shading" the buyer flagged. Stripe / Linear /
       * Vercel pricing decks all use a single surface token so cards read as one
       * cohesive composition (NN/g 2024 "Visual Hierarchy & Consistency").
       */
      className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white px-5 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.04] sm:px-7 sm:py-8 md:px-8"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-6 text-center sm:mb-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Path preview
        </p>
        <h3 className="mt-2 text-base font-semibold tracking-tight text-slate-900 sm:text-lg md:text-xl">
          What the journey often looks like
        </h3>
        <p className="mx-auto mt-2.5 max-w-xl text-xs leading-relaxed text-slate-500 sm:text-sm sm:leading-relaxed">
          Illustrative phases many clinics discuss before a consult — pace and plan are set by your provider.
        </p>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute left-[8%] right-[8%] top-[20px] hidden h-0.5 sm:block"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${brandFill}55 15%, ${brandFill}55 85%, transparent 100%)`,
          }}
          aria-hidden
        />
        <ul className="grid gap-8 sm:grid-cols-3 sm:gap-6 md:gap-7">
          {items.map((m, i) => (
            <li key={m.title} className="relative flex flex-col items-center text-center">
              <span
                className="relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-md ring-4 ring-white"
                style={{ backgroundColor: brandFill }}
                aria-hidden
              >
                {i + 1}
              </span>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {m.caption}
              </p>
              <p className="mt-1.5 text-sm font-semibold leading-snug text-slate-900">{m.title}</p>
              <p className="mt-2.5 max-w-[14rem] text-xs leading-relaxed text-slate-600 sm:max-w-none">
                {m.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
