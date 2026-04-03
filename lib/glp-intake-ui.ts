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

  /** Major sections inside one card (results, readiness) */
  stackSection: "space-y-7",
  /** Step 1: even rhythm between intro copy, field grid, actions */
  stackStepForm: "space-y-5",
  stackMd: "space-y-6",
  stackSm: "space-y-5",

  grid2: "grid gap-5 md:grid-cols-2",
  /** Form fields: uniform 28px row rhythm (7 × 4px grid) */
  grid2Form: "grid grid-cols-1 gap-y-5 gap-x-5 md:grid-cols-2 md:items-start md:gap-x-7 md:gap-y-5",

  kicker: "text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500",
  titleLg: "text-2xl font-bold tracking-tight text-slate-900 md:text-[1.75rem] md:leading-snug",
  /** Results hero — editorial weight without shouting */
  titleResults: "text-3xl font-bold tracking-tight text-slate-900 md:text-[2rem] md:leading-[1.2]",
  titleMd: "text-lg font-semibold tracking-tight text-slate-900",
  body: "text-sm leading-relaxed text-slate-600",
  bodyMuted: "text-sm leading-relaxed text-slate-500",

  label: "mb-2 block text-sm font-medium text-slate-700",
  control:
    "min-h-[48px] w-full rounded-xl border border-slate-200/95 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 focus-visible:ring-offset-2",

  /** Wizard back — same min height as primary for aligned rows (WCAG touch target ≥44px) */
  backBtn:
    "inline-flex w-full shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-[0.875rem] text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 focus-visible:ring-offset-2 sm:w-[8.75rem] sm:min-w-[8.75rem] min-h-[52px]",

  primaryBtn:
    "glp-intake-primary-btn inline-flex w-full items-center justify-center rounded-xl px-5 py-[0.875rem] text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-[1.03] active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/25 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 disabled:hover:shadow-md min-h-[52px]",
  secondaryBtn:
    "inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-5 py-[0.875rem] text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 focus-visible:ring-offset-2 min-h-[52px]",

  /** Primary + optional secondary stack; pair with back row */
  formActions: "flex min-w-0 flex-1 flex-col gap-3 sm:max-w-md sm:ml-auto sm:items-stretch",
  /** Row: Previous (left) + actions (right on sm+) */
  formNavRow:
    "mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4",
  /** Wizard actions after body copy — top rule separates from content */
  formNavRowRule:
    "mt-8 flex flex-col gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
  chip: "rounded-full bg-slate-100 px-3.5 py-1 text-xs font-medium text-slate-700",
  sectionRule: "border-t border-slate-100 pt-7 first:border-0 first:pt-0 first:mt-0 mt-7",

  /** Readiness fieldsets — uniform 32px between questions */
  readinessStack: "space-y-8",
  choiceRow: "flex flex-wrap gap-3",
  choiceBase:
    "rounded-xl border px-4 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2",
  choiceIdle:
    "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-md",
} as const;
