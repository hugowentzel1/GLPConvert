/**
 * GLP intake — 8px grid + predictable vertical rhythm (GOV.UK form spacing: label→control;
 * Stripe Checkout / Linear: section gaps 24–32px; WCAG 2.2 touch targets ≥44px).
 */
export const glpIntakeUi = {
  column: "mx-auto w-full max-w-2xl",

  /** Stepper: breathing room above bar (label never crowds the track). */
  stepperShell: "mb-8 w-full",
  stepperLabel: "mb-8 text-center text-xs font-medium leading-relaxed text-slate-600 md:mb-9",
  stepperTrackWrap: "mx-auto w-full max-w-xl",
  stepperDotsWrap: "mx-auto mt-6 w-full max-w-xl md:mt-7",

  space: {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-3",
    section: "gap-4",
    block: "gap-6",
    major: "gap-8",
  } as const,

  card:
    "rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_6px_rgba(15,23,42,0.04),0_20px_48px_-8px_rgba(15,23,42,0.1)] ring-1 ring-slate-900/[0.04] transition-all duration-300 hover:border-slate-200 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08),0_28px_56px_-12px_rgba(15,23,42,0.12)]",
  panelInCard:
    "relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.04]",
  cardPad: "p-6 sm:p-8 md:p-10",
  cardPadSm: "p-5 md:p-6",
  cardPadLoose: "p-6 sm:p-8 md:p-10 lg:p-12",

  /** Marketing / header shell — generous padding (product marketing cards). */
  intakeHeaderPad: "px-6 py-9 sm:px-10 sm:py-10 md:px-12 md:py-12",

  stackSection: "space-y-8 md:space-y-10",
  stackStepForm: "space-y-7 md:space-y-8",
  stackMd: "space-y-6 md:space-y-8",
  stackSm: "space-y-4 md:space-y-5",

  fieldGroup: "space-y-4",

  grid2: "grid gap-5 md:grid-cols-2",
  grid2Form: "grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2 md:items-start md:gap-x-8 md:gap-y-7",

  segmentGrid4: "grid grid-cols-2 gap-3 sm:gap-3",
  segmentGrid5: "grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-3",
  segmentGrid3: "grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3",

  kicker: "text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500",
  titleLg: "text-2xl font-bold tracking-tight text-slate-900 md:text-[1.75rem] md:leading-snug",
  titleResults: "text-3xl font-bold tracking-tight text-slate-900 md:text-[2rem] md:leading-[1.2]",
  titleMd: "text-lg font-semibold tracking-tight text-slate-900",
  body: "text-sm leading-relaxed text-slate-600",
  bodyMuted: "text-sm leading-relaxed text-slate-500",

  /** Tight pair: title line → helper (same block); 20px before control row. */
  label: "mb-5 block text-sm font-medium text-slate-800",
  legendLabel: "mb-6 block text-sm font-medium text-slate-800",
  control:
    "min-h-[48px] w-full rounded-xl border border-slate-200/95 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 focus-visible:ring-offset-2",

  backBtn:
    "inline-flex w-full shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-[0.875rem] text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 focus-visible:ring-offset-2 min-h-[52px] sm:w-[10rem] md:w-[11rem]",

  primaryBtn:
    "glp-intake-primary-btn inline-flex w-full min-w-0 flex-1 items-center justify-center rounded-xl px-5 py-[0.875rem] text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-[1.03] active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/25 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 disabled:hover:shadow-md min-h-[52px] sm:max-w-xl sm:min-w-[12rem]",
  secondaryBtn:
    "inline-flex w-full min-w-0 flex-1 items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-5 py-[0.875rem] text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 focus-visible:ring-offset-2 min-h-[52px] sm:max-w-md sm:min-w-[10rem]",

  formActions: "flex w-full min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-3",
  formNavRow: "mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4",
  formNavRowRule:
    "mt-8 flex flex-col gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4",

  chip: "rounded-full bg-slate-100 px-3.5 py-1 text-xs font-medium text-slate-700",
  sectionRule:
    "border-t border-slate-100 pt-8 mt-8 first:border-0 first:pt-0 first:mt-0 md:pt-10 md:mt-10",

  readinessStack: "space-y-12 md:space-y-14",
  choiceRow: "flex flex-wrap gap-3",
  choiceBase:
    "rounded-xl border px-4 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2",
  choiceIdle:
    "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-md",
} as const;
