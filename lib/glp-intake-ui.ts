/**
 * GLP intake — spacing aligned to an 8px grid (Material Design layout guidelines; IBM Carbon density tokens).
 * Section rhythm: 16–24px within groups, 32–40px between sections (Stripe Dashboard / Linear app patterns).
 * Touch targets ≥44×44px (Apple HIG; WCAG 2.2 target size).
 * Use these tokens sitewide so rhythm stays predictable.
 */
export const glpIntakeUi = {
  /** Main column — max readable width; outer frame supplies horizontal padding */
  column: "mx-auto w-full max-w-2xl",

  /** Stepper: label sits in its own band above the track (clear hierarchy, not cramped to the bar) */
  stepperShell: "mb-8 w-full",
  stepperLabel: "mb-5 text-center text-xs font-medium leading-relaxed text-slate-600",
  stepperTrackWrap: "mx-auto w-full max-w-xl",
  stepperDotsWrap: "mx-auto mt-5 w-full max-w-xl",

  space: {
    xs: "gap-1", // 4
    sm: "gap-2", // 8
    md: "gap-3", // 12
    section: "gap-4", // 16
    block: "gap-6", // 24
    major: "gap-8", // 32
  } as const,

  /** Neutral chrome only — brand color lives in CTAs/progress, not card outlines (Notion/Stripe-style surfaces). */
  card:
    "rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_6px_rgba(15,23,42,0.04),0_20px_48px_-8px_rgba(15,23,42,0.1)] ring-1 ring-slate-900/[0.04] transition-all duration-300 hover:border-slate-200 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08),0_28px_56px_-12px_rgba(15,23,42,0.12)]",
  /** In-flow panels (results headers, chart shells) — same elevation language as `card`. */
  panelInCard:
    "relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.04]",
  /** Card interior — generous rhythm so step 2+ never feels cramped */
  cardPad: "p-6 sm:p-8 md:p-10",
  cardPadSm: "p-5 md:p-6",
  /** Results / long steps: extra vertical air */
  cardPadLoose: "p-6 sm:p-8 md:p-10 lg:p-12",

  stackSection: "space-y-8 md:space-y-10",
  /** Step 1: 24px between intro, fields, optional, footer */
  stackStepForm: "space-y-6 md:space-y-7",
  stackMd: "space-y-6 md:space-y-8",
  stackSm: "space-y-4 md:space-y-5",

  /** One logical field (label + control + 16px gap to next field in a group) */
  fieldGroup: "space-y-4",

  grid2: "grid gap-5 md:grid-cols-2",
  grid2Form: "grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2 md:items-start md:gap-x-8 md:gap-y-5",

  /** Segmented choices: equal cells, no orphan wraps */
  segmentGrid4: "grid grid-cols-2 gap-2 sm:gap-3",
  segmentGrid5: "grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3",
  /** Readiness: three options in one row on sm+ */
  segmentGrid3: "grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3",

  kicker: "text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500",
  titleLg: "text-2xl font-bold tracking-tight text-slate-900 md:text-[1.75rem] md:leading-snug",
  titleResults: "text-3xl font-bold tracking-tight text-slate-900 md:text-[2rem] md:leading-[1.2]",
  titleMd: "text-lg font-semibold tracking-tight text-slate-900",
  body: "text-sm leading-relaxed text-slate-600",
  bodyMuted: "text-sm leading-relaxed text-slate-500",

  label: "mb-2 block text-sm font-medium text-slate-700",
  control:
    "min-h-[48px] w-full rounded-xl border border-slate-200/95 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 focus-visible:ring-offset-2",

  /** Secondary / back: fixed readable width; primary flexes (NN/g: primary wider, secondary equal height) */
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

  readinessStack: "space-y-10 md:space-y-12",
  choiceRow: "flex flex-wrap gap-3",
  choiceBase:
    "rounded-xl border px-4 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2",
  choiceIdle:
    "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-md",
} as const;
