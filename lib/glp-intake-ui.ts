/**
 * GLP intake funnel — single spacing + surface scale for a cohesive B2B look.
 * Scale: 4 (xs) · 5 (sm) · 6 (md) · 8 (section) · 10 (card padding)
 */
export const glpIntakeUi = {
  /** Main column width — readable on desktop, full on mobile */
  column: "mx-auto w-full max-w-2xl",

  /** Primary surface — calm elevation + hover lift (white-label SaaS norm) */
  card:
    "rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_4px_rgba(15,23,42,0.04),0_16px_40px_rgba(15,23,42,0.07)] transition-shadow duration-300 hover:shadow-[0_8px_16px_rgba(15,23,42,0.05),0_28px_48px_rgba(15,23,42,0.1)]",
  cardPad: "p-8 md:p-10",
  cardPadSm: "p-6 md:p-8",

  stackSection: "space-y-8",
  /** Step 1: even rhythm between intro copy, field grid, actions (8pt grid) */
  stackStepForm: "space-y-6",
  stackMd: "space-y-6",
  stackSm: "space-y-5",

  grid2: "grid gap-5 md:grid-cols-2",
  /** Form fields: uniform 28px row rhythm (7 × 4px grid) */
  grid2Form: "grid grid-cols-1 gap-y-6 gap-x-6 md:grid-cols-2 md:items-start md:gap-x-8",

  kicker: "text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500",
  titleLg: "text-2xl font-bold tracking-tight text-slate-900 md:text-[1.75rem] md:leading-snug",
  /** Results hero — editorial weight without shouting */
  titleResults: "text-3xl font-bold tracking-tight text-slate-900 md:text-[2rem] md:leading-[1.2]",
  titleMd: "text-lg font-semibold tracking-tight text-slate-900",
  body: "text-sm leading-relaxed text-slate-600",
  bodyMuted: "text-sm leading-relaxed text-slate-500",

  label: "mb-2 block text-sm font-medium text-slate-700",
  control:
    "min-h-[48px] w-full rounded-xl border border-slate-200/95 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition placeholder:text-slate-400",

  /** Wizard back — always visible affordance (NNG: users fear dead-ends) */
  backBtn:
    "inline-flex w-full shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 min-h-[48px] sm:w-auto sm:min-w-[8.5rem]",

  primaryBtn:
    "glp-intake-primary-btn inline-flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-[1.03] active:scale-[0.995] disabled:pointer-events-none disabled:opacity-45 disabled:hover:shadow-md min-h-[48px]",
  secondaryBtn:
    "inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-md min-h-[48px]",

  /** Primary + optional secondary stack; pair with back row */
  formActions: "flex min-w-0 flex-1 flex-col gap-3 sm:max-w-md sm:ml-auto sm:items-stretch",
  /** Row: Previous (left) + actions (right on sm+) */
  formNavRow:
    "mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4",
  /** Wizard actions after body copy — top rule separates from content */
  formNavRowRule: "mt-8 flex flex-col gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4",
  chip: "rounded-full bg-slate-100 px-3.5 py-1 text-xs font-medium text-slate-700",
  sectionRule: "border-t border-slate-100 pt-8 first:border-0 first:pt-0 first:mt-0 mt-8",

  choiceRow: "flex flex-wrap gap-3",
  choiceBase:
    "rounded-xl border px-4 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15",
  choiceIdle:
    "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-md",
} as const;
