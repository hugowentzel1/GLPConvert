/**
 * GLP intake — spacing scale (all map to Tailwind / 4px base):
 *
 * | Token        | px   | Use |
 * |--------------|------|-----|
 * | space-2      | 8px  | Tight related lines (subtitle under title) |
 * | space-3      | 12px | Dense stacks |
 * | space-4      | 16px | Label → input/control (WCAG form patterns; M3 density) |
 * | space-5      | 20px | Legend → option row (fieldset) |
 * | space-6      | 24px | Between form groups / subsections |
 * | space-8      | 32px | Between major sections in a step |
 * | space-10     | 40px | Rare: long-step section breaks |
 *
 * References: Material Design 3 layout (8dp grid); GOV.UK “spacing between form elements”;
 * USWDS 2.14+ form field spacing; Stripe Checkout field stack rhythm;
 * Nielsen Norman Group: group related fields with consistent vertical spacing to reduce perceived density.
 */
export const glpIntakeUi = {
  column: "mx-auto w-full max-w-2xl",

  stepperShell: "mb-8 w-full",
  /** 24px above progress track — text never touches bar */
  stepperLabel: "mb-6 text-center text-xs font-medium leading-relaxed text-slate-600 md:mb-7",
  stepperTrackWrap: "mx-auto w-full max-w-xl",
  /** 20px below bar before dots */
  stepperDotsWrap: "mx-auto mt-5 w-full max-w-xl",

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
  /** Step cards: airier padding (product forms: Stripe / Linear use ~32–40px horizontal at md) */
  cardPad: "p-7 sm:p-9 md:p-10",
  cardPadSm: "p-6 md:p-7",
  cardPadLoose: "p-7 sm:p-9 md:p-10 lg:p-12",

  /** Marketing header: balanced inset (tighter than before to reduce dead space in demo hero) */
  intakeHeaderPad: "px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-9",

  /** Match clinic hero card: used for trust strip inner, quote cards, premium chart shell */
  intakeHeroShell:
    "relative overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08),0_12px_40px_-12px_rgba(15,23,42,0.1)] ring-1 ring-slate-900/[0.04]",

  stackSection: "space-y-9 md:space-y-10",
  /** 32px between intro, field clusters, footer — less cramped than 24px-only stacks */
  stackStepForm: "space-y-8 md:space-y-9",
  stackMd: "space-y-7 md:space-y-8",
  stackSm: "space-y-5 md:space-y-5",

  fieldGroup: "space-y-5",

  grid2: "grid gap-5 md:grid-cols-2",
  grid2Form: "grid grid-cols-1 gap-x-6 gap-y-7 md:grid-cols-2 md:items-start md:gap-x-10 md:gap-y-8",

  segmentGrid4: "grid grid-cols-2 gap-3.5 sm:gap-4",
  segmentGrid5: "grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4",
  segmentGrid3: "grid grid-cols-1 gap-3.5 sm:grid-cols-3 sm:gap-4",

  kicker: "text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500",
  titleLg: "text-2xl font-bold tracking-tight text-slate-900 md:text-[1.75rem] md:leading-snug",
  titleResults: "text-3xl font-bold tracking-tight text-slate-900 md:text-[2rem] md:leading-[1.2]",
  titleMd: "text-lg font-semibold tracking-tight text-slate-900",
  body: "text-sm leading-relaxed text-slate-600",
  bodyMuted: "text-sm leading-relaxed text-slate-500",

  /** 20px below label before control — clearer separation from options */
  label: "mb-5 block text-sm font-medium text-slate-800",
  legendLabel: "mb-6 block text-sm font-medium text-slate-800",
  control:
    "min-h-[48px] w-full rounded-xl border border-slate-200/95 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 focus-visible:ring-offset-2",

  backBtn:
    "inline-flex w-full shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-[0.875rem] text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 focus-visible:ring-offset-2 min-h-[52px] sm:w-[10rem] md:w-[11rem]",

  primaryBtn:
    "glp-intake-primary-btn inline-flex w-full min-w-0 flex-1 items-center justify-center rounded-xl px-5 py-[0.875rem] text-sm font-semibold text-white shadow-md transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg hover:brightness-[1.03] active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/25 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 disabled:hover:shadow-md min-h-[52px] sm:max-w-xl sm:min-w-[12rem]",
  secondaryBtn:
    "inline-flex w-full min-w-0 flex-1 items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-5 py-[0.875rem] text-sm font-semibold text-slate-800 shadow-sm transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-md active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 focus-visible:ring-offset-2 min-h-[52px] sm:max-w-md sm:min-w-[10rem]",

  /**
   * Step 2 summary tiles — three-row metric cards (Stripe Dashboard, Linear Insights, Material 3
   * "stat tile"): per-tile *category* overline → single dominant headline value → consistent
   * supporting line → footer disclaimer. Every tile shares the same vertical rhythm so all three
   * read as a single comparative scan, not a "long card / metric card / metric card" mismatch.
   *
   * References: Stripe Dashboard metric tiles; Linear Insights cards; Material 3 "stat tile";
   * IBM Carbon "tile patterns" — tile titles & primary values must share size and color across
   * the row to support visual scanning.
   */
  resultsSummaryCard:
    "flex min-h-[200px] flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_24px_rgba(15,23,42,0.07)] ring-1 ring-slate-900/[0.05] sm:min-h-[212px] sm:p-6",
  resultsSummaryOverline:
    "text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500",
  /**
   * Primary value (number OR short text) — uniform size/weight/color across all 3 tiles.
   *
   * Sized responsively because the parent column is `max-w-2xl` (~672px) and at md+
   * the 3-tile grid gives each tile only ~130–180px of usable width. A flat 1.65rem
   * headline causes "$149–$699 /mo" and "GLP-1 injectable" to wrap awkwardly. We step
   * down to ~1.125rem at md (3-col kicks in) and ~1.25rem at lg.
   *
   * `min-h-[3.25rem]` reserves the vertical space of *two lines* even when the headline
   * is a single line — so all 3 tiles share an identical visual hierarchy and the
   * supporting line / footer always align horizontally across the row (Material 3
   * stat-tile rule: "consistent baseline within a comparison row").
   */
  resultsSummaryHeadline:
    "mt-3 min-h-[3.25rem] text-[1.5rem] font-semibold leading-[1.15] tracking-tight text-slate-900 tabular-nums sm:text-[1.65rem] md:min-h-[3rem] md:text-[1.125rem] lg:min-h-[3.5rem] lg:text-[1.375rem]",
  /** Optional inline unit ("/mo", "weeks") — inline next to headline, smaller, muted */
  resultsSummaryHeadlineUnit:
    "ml-1 text-sm font-medium text-slate-500 md:text-[0.7rem] lg:text-sm",
  /** Single supporting line under headline — same weight & color everywhere */
  resultsSummarySupport:
    "mt-2 text-sm leading-relaxed text-slate-600",
  /** Footer disclaimer — consistent voice/length, divider above */
  resultsSummaryMeta:
    "mt-auto border-t border-slate-200/70 pt-3 text-xs leading-relaxed text-slate-500",

  /** Step 2 results: generous vertical rhythm (M3-style section spacing) */
  resultsStack: "space-y-12 md:space-y-14",
  /**
   * Section divider weight (revised after buyer pass 4 feedback): the prior
   * `slate-300/80` read as too dark — it competed with the section
   * headlines for visual weight. The original `slate-100` was too faint to
   * register as a real divider. We landed on `slate-200` (#e2e8f0) at full
   * opacity — visibly more present than slate-100 but lighter than
   * slate-300/80, the "soft hairline" weight Material 3 and IBM Carbon
   * actually recommend for primary section separators on white. Same
   * border is reused by `formNavRowRule` so the closing nav row reads as
   * a section break, not a separate element.
   */
  resultsSectionRule:
    "border-t border-slate-200 pt-11 mt-11 first:mt-0 first:border-0 first:pt-0 md:pt-12 md:mt-12",

  /**
   * Step 2 content card — shared style for Path & Expectations cards so they read as
   * the same component (previously: Path used p-6 + heavier shadow + hover lift, while
   * Expectations used p-5 sm:p-6 + lighter shadow and no hover, breaking the row's
   * visual rhythm). Single source of truth for surface, padding, and motion across
   * both grids.
   */
  resultsContentCard:
    "flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.04] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] sm:p-6",
  /** Per-card eyebrow (e.g. "Weeks 1–4", "Early") — same uppercase 11px overline */
  resultsCardEyebrow:
    "text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500",
  /** Per-card sub-headline (e.g. "Getting oriented", "Routine settles in") */
  resultsCardTitle:
    "mt-2 text-sm font-semibold leading-snug tracking-tight text-slate-900",
  /** Per-card description body */
  resultsCardDescription:
    "mt-2 text-sm leading-relaxed text-slate-600",

  /**
   * Step 2 large content surface — same flat-white aesthetic as `resultsContentCard`
   * (border, ring, shadow, hover) but with extra padding for blocks that hold a
   * structured stack of sub-rows (Investment / Price clarity, Owner value strip).
   * Stripe Checkout, Linear payment cards, and Calendly payoff cards all use *one*
   * surface token so the page reads as a single composition instead of a deck of
   * mismatched tints. (NN/g 2024 "Visual Hierarchy & Consistency".)
   */
  resultsContentCardLg:
    "rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.04] sm:p-7 md:p-8",
  /**
   * Collapsible detail surface (Trajectory checkpoints, Common questions). Same
   * border weight as `resultsContentCard` so the closed state reads like the rest
   * of the deck; opens with a light shadow lift to signal interactivity.
   */
  resultsDetailsCard:
    "group rounded-2xl border border-slate-200/90 bg-white px-5 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] ring-1 ring-slate-900/[0.04] transition-shadow open:shadow-[0_8px_24px_rgba(15,23,42,0.07)]",

  formActions: "flex w-full min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-3",
  formNavRow: "mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4",
  /**
   * Form nav row with a top divider — same `slate-300/80` weight as
   * `resultsSectionRule` so the nav row reads as the closing section of every
   * step, not a free-floating button bar. Reused on every step (1–5) so the
   * Continue/Previous footer is *visually identical* across the wizard
   * (PatternFly Wizard guideline: "button footer must hold the same
   * structural position across every step").
   */
  formNavRowRule:
    "mt-8 flex flex-col gap-3 border-t border-slate-200 pt-8 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4",

  chip: "rounded-full bg-slate-100 px-3.5 py-1 text-xs font-medium text-slate-700",
  sectionRule:
    "border-t border-slate-200 pt-8 mt-8 first:border-0 first:pt-0 first:mt-0 md:pt-10 md:mt-10",

  readinessStack: "space-y-11 md:space-y-12",
  choiceRow: "flex flex-wrap gap-3",
  choiceBase:
    "rounded-xl border px-4 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2",
  choiceIdle:
    "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-md",
} as const;
