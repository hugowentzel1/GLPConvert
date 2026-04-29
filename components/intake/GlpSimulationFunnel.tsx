"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import GlpDemoOwnerPanels from "@/components/intake/GlpDemoOwnerPanels";
import GlpJourneyProgressChart from "@/components/intake/GlpJourneyProgressChart";
import GlpPathMilestonePreview from "@/components/intake/GlpPathMilestonePreview";
import IntakeStep2CarePackageStrip from "@/components/intake/IntakeStep2CarePackageStrip";
import IntakeTrustStrip from "@/components/intake/IntakeTrustStrip";
import { persistUtmFromSearchParams, getMergedUtm } from "@/lib/glp-attribution";
import { resolveGlpTenantSlug } from "@/lib/glp-tenant-slug";
import { glpIntakeUi } from "@/lib/glp-intake-ui";
import { parseGlpIntakeQueryBranding } from "@/lib/glp-intake-query-branding";
import { isIntakeBrandedMarketingMode } from "@/lib/glp-intake-demo-mode";
import {
  buildIntakePricingHref,
  buildIntakeSupportHref,
  buildBrandedDemoReturnHref,
} from "@/lib/glp-intake-nav-href";
import { getAccessibleBrandFill } from "@/lib/glp-intake-brand-contrast";
import { hexToRgba } from "@/lib/intake-color-helpers";

type TenantIntakePublicJson = {
  ok?: boolean;
  bookingUrl?: string | null;
  logoUrl?: string | null;
  brandColor?: string | null;
  brandColorSecondary?: string | null;
  displayName?: string | null;
  pricingMonthlyLow?: number | null;
  pricingMonthlyHigh?: number | null;
  consultFeeNote?: string | null;
  paymentNote?: string | null;
  /**
   * Up to 3 buyer-configured care packages (Pass 7). When present we
   * render *real* clinic-priced tiles on intake step 2 in the clinic's
   * brand color; when empty, the funnel falls back to the generic
   * "Provider review / Personalized plan / Medication, if prescribed"
   * placeholder strip so the demo URL still has visual content.
   */
  packages?: Array<{
    title: string;
    priceLabel: string | null;
    items: string[];
  }>;
};

type SimInput = {
  currentWeight: number;
  goalWeight: number;
  heightIn: number;
  urgency?: "asap" | "three_months" | "six_months" | "exploring";
  budgetBand?: "under_200" | "200_400" | "400_700" | "unsure";
  priorGlp?: "none" | "stopped" | "active" | "prefer_not";
  biggestStruggle?: "food_noise" | "cravings" | "hunger_control" | "consistency" | "unsure";
  age?: number;
  sex?: "female" | "male";
  medPath?: "semaglutide" | "tirzepatide" | "oral_path" | "unsure";
};

type SimOutput = {
  weeksToGoal: number;
  projectedLoss: number;
  confidenceBand: "conservative" | "typical" | "accelerated";
  pathLabel: string;
  phasePlan: { phase: string; weeks: string; focus: string }[];
  projectedMonthlyRange: { month: number; low: number; mid: number; high: number }[];
  monthlyCostLow: number;
  monthlyCostHigh: number;
  costPerLbLow: number;
  costPerLbHigh: number;
};

type FlowStep = 1 | 2 | 3 | 4 | 5;

const STEP_LABELS = ["Details", "Results", "Readiness", "Contact", "Done"] as const;
const TOTAL_FLOW_STEPS = 5;

type ReadinessAnswers = {
  priceComfort: "comfortable" | "unsure" | "need_to_discuss" | null;
  startTimeline: "soon" | "weeks" | "exploring" | null;
  exploreIntent: "yes" | "maybe" | "later" | null;
};

const DEFAULT_BRAND = "#0f172a";

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function parseHttpsBookingFromSearch(sp: ReturnType<typeof useSearchParams>): string | null {
  if (!sp) return null;
  for (const key of ["booking", "book", "booking_url"] as const) {
    const raw = sp.get(key);
    if (!raw) continue;
    try {
      const u = decodeURIComponent(raw.trim());
      if (/^https:\/\//i.test(u)) return u;
    } catch {
      /* ignore */
    }
  }
  return null;
}

function runSimulation(input: SimInput): SimOutput {
  const lossNeeded = Math.max(0, input.currentWeight - input.goalWeight);
  const medMultiplier =
    input.medPath === "tirzepatide"
      ? 1.2
      : input.medPath === "semaglutide"
        ? 1.0
        : input.medPath === "oral_path"
          ? 0.8
          : 0.9;
  const urgencyBoost =
    input.urgency === "asap" ? 1.08 : input.urgency === "three_months" ? 1.04 : 1.0;
  const baseLbsPerWeek = 1.0 * medMultiplier * urgencyBoost;
  const weeksToGoal = clamp(Math.round(lossNeeded / Math.max(0.6, baseLbsPerWeek)), 8, 72);

  const monthlyCostLow =
    input.medPath === "tirzepatide"
      ? 299
      : input.medPath === "semaglutide"
        ? 149
        : input.medPath === "oral_path"
          ? 99
          : 149;
  const monthlyCostHigh =
    input.medPath === "tirzepatide"
      ? 799
      : input.medPath === "semaglutide"
        ? 599
        : input.medPath === "oral_path"
          ? 349
          : 699;
  const months = Math.ceil(weeksToGoal / 4);
  const totalLow = months * monthlyCostLow;
  const totalHigh = months * monthlyCostHigh;
  const costPerLbLow = lossNeeded > 0 ? totalLow / lossNeeded : 0;
  const costPerLbHigh = lossNeeded > 0 ? totalHigh / lossNeeded : 0;

  const projectedMonthlyRange = Array.from({ length: Math.min(months, 12) }).map((_, i) => {
    const month = i + 1;
    const pct = month / months;
    const expectedLoss = lossNeeded * pct;
    const curve = 0.9 + (month <= 3 ? 0.15 : 0);
    const mid = input.currentWeight - expectedLoss * curve;
    return {
      month,
      low: Math.max(input.goalWeight, Math.round(mid + 4)),
      mid: Math.max(input.goalWeight, Math.round(mid)),
      high: Math.max(input.goalWeight, Math.round(mid - 4)),
    };
  });
  const pathLabel =
    input.medPath === "tirzepatide"
      ? "Discussion often starts around a dual-action injectable path — your provider decides"
      : input.medPath === "semaglutide"
        ? "Discussion often starts around a GLP-1 injectable path — your provider decides"
        : input.medPath === "oral_path"
          ? "Discussion may start with an oral-first plan — your provider decides"
          : "Direction you selected — details confirmed in consult";
  const confidenceBand: SimOutput["confidenceBand"] =
    input.priorGlp === "active" ? "conservative" : input.urgency === "asap" ? "accelerated" : "typical";
  const phasePlan = [
    {
      phase: "Getting oriented",
      weeks: "Weeks 1–4",
      focus: "Comfort with the plan, routine, and how check-ins work",
    },
    {
      phase: "Building momentum",
      weeks: "Weeks 5–16",
      focus: "Regular follow-ups; your provider adjusts based on how you respond",
    },
    {
      phase: "Staying consistent",
      weeks: "Month 5+",
      focus: "Long-term habits and what “steady state” looks like for you",
    },
  ];

  return {
    weeksToGoal,
    projectedLoss: lossNeeded,
    confidenceBand,
    pathLabel,
    phasePlan,
    projectedMonthlyRange,
    monthlyCostLow,
    monthlyCostHigh,
    costPerLbLow: Math.round(costPerLbLow),
    costPerLbHigh: Math.round(costPerLbHigh),
  };
}

function IntakeStepper({
  step,
  brandFill,
  building,
}: {
  step: FlowStep;
  brandFill: string;
  building: boolean;
}) {
  /** Fill aligns to the *center* of the current step dot (5 equal segments), not interval midpoints. */
  const pct = building
    ? 0
    : step >= TOTAL_FLOW_STEPS
      ? 100
      : Math.min(100, ((step - 0.5) / TOTAL_FLOW_STEPS) * 100);
  const labelIdx = building ? 0 : step - 1;
  return (
    <div className={`${glpIntakeUi.column} ${glpIntakeUi.stepperShell}`} data-intake-stepper>
      <p className={glpIntakeUi.stepperLabel}>
        {building ? (
          <>
            Preparing preview… <span className="text-slate-400">(not a step)</span>
          </>
        ) : (
          <>
            Step {step} of {TOTAL_FLOW_STEPS} ·{" "}
            <span className="font-semibold text-slate-900">{STEP_LABELS[labelIdx]}</span>
          </>
        )}
      </p>
      <div className={glpIntakeUi.stepperTrackWrap}>
        <div
          className="h-2 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-900/[0.06]"
          role="progressbar"
          aria-valuenow={building ? 1 : step}
          aria-valuemin={1}
          aria-valuemax={TOTAL_FLOW_STEPS}
          aria-valuetext={
            building
              ? "Preparing plan preview"
              : `Step ${step} of ${TOTAL_FLOW_STEPS}, ${STEP_LABELS[labelIdx]}`
          }
        >
          <div
            className="h-full rounded-full shadow-[0_0_12px_rgba(0,0,0,0.08)] transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%`, backgroundColor: brandFill }}
          />
        </div>
      </div>
      <div className={`${glpIntakeUi.stepperDotsWrap} flex justify-between gap-0.5 px-0.5`} aria-hidden>
        {STEP_LABELS.map((_, i) => {
          const n = i + 1;
          const done = !building && step > n;
          const current = building ? n === 1 : step === n;
          return (
            <div key={n} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <span
                className={`h-2 w-2 shrink-0 rounded-full transition-colors duration-300 ${
                  current ? "ring-2 ring-white ring-offset-1 ring-offset-slate-50" : ""
                } ${done || current ? "" : "bg-slate-200"}`}
                style={done || current ? { backgroundColor: brandFill } : undefined}
              />
              <span
                className={`text-[9px] font-semibold ${done || current ? "text-slate-800" : "text-slate-400"}`}
              >
                {n}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const URGENCY_OPTIONS: { v: NonNullable<SimInput["urgency"]>; l: string }[] = [
  { v: "asap", l: "As soon as possible" },
  { v: "three_months", l: "Within 3 months" },
  { v: "six_months", l: "Within 6 months" },
  { v: "exploring", l: "Exploring" },
];

const STRUGGLE_OPTIONS: { v: NonNullable<SimInput["biggestStruggle"]>; l: string }[] = [
  { v: "food_noise", l: "Food noise" },
  { v: "cravings", l: "Cravings" },
  { v: "hunger_control", l: "Hunger" },
  { v: "consistency", l: "Consistency" },
  { v: "unsure", l: "Not sure" },
];

export default function GlpSimulationFunnel() {
  const sp = useSearchParams();
  const tenantSlug = resolveGlpTenantSlug(sp);
  const companyFromQuery = sp?.get("company")?.trim() || "";
  const [publicCfg, setPublicCfg] = useState<TenantIntakePublicJson | null>(null);
  const company = companyFromQuery || publicCfg?.displayName || "your clinic";
  const isDemoMode = isIntakeBrandedMarketingMode(sp);
  const demoTraffic = Math.min(50_000, Math.max(50, Number(sp?.get("demo_traffic") || 400) || 400));
  const { logoUrl: logoFromQuery, primaryHex, secondaryHex: secondaryFromQuery } = useMemo(
    () => parseGlpIntakeQueryBranding(sp),
    [sp],
  );
  const effectiveLogo = logoFromQuery || publicCfg?.logoUrl || null;
  /**
   * `?brand=` is user-controlled (cold-email URL) — guard against low-contrast values that would
   * fail WCAG AA on the primary white-text CTAs. See `lib/glp-intake-brand-contrast.ts`.
   */
  const rawBrand = primaryHex || publicCfg?.brandColor || DEFAULT_BRAND;
  const brandFill = getAccessibleBrandFill(rawBrand);
  const effectiveSecondary = secondaryFromQuery || publicCfg?.brandColorSecondary || null;
  const [step, setStep] = useState<FlowStep>(1);
  const [input, setInput] = useState<SimInput>({
    currentWeight: 220,
    goalWeight: 180,
    heightIn: 68,
    urgency: "three_months",
    budgetBand: "200_400",
    priorGlp: "none",
    biggestStruggle: "food_noise",
    medPath: "unsure",
  });
  const [readiness, setReadiness] = useState<ReadinessAnswers>({
    priceComfort: null,
    startTimeline: null,
    exploreIntent: null,
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  /** Shown after a failed save when consent (or other fields) block progress — reduces “dead click” friction (NN/g 2024 error recovery). */
  const [consentHint, setConsentHint] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [nextStep, setNextStep] = useState<"book" | "callback" | "save_only">("book");
  const [resolvedBookingUrl, setResolvedBookingUrl] = useState<string | null>(null);
  const [building, setBuilding] = useState(false);

  const output = useMemo(() => {
    const base = runSimulation(input);
    const low = publicCfg?.pricingMonthlyLow;
    const high = publicCfg?.pricingMonthlyHigh;
    if (typeof low === "number" && typeof high === "number" && low > 0 && high >= low) {
      return { ...base, monthlyCostLow: low, monthlyCostHigh: high };
    }
    return base;
  }, [input, publicCfg?.pricingMonthlyLow, publicCfg?.pricingMonthlyHigh]);

  const inputRef = useRef(input);
  const outputRef = useRef(output);
  inputRef.current = input;
  outputRef.current = output;

  /** Step 1 "building" → step 2 delay; must not live in a useEffect (deps can clear the timeout). */
  const step1To2TimerRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (step1To2TimerRef.current != null) {
        window.clearTimeout(step1To2TimerRef.current);
        step1To2TimerRef.current = null;
      }
    };
  }, []);

  const milestoneItems = useMemo(
    () =>
      output.phasePlan.map((p) => ({
        title: p.phase,
        caption: p.weeks,
        detail: p.focus,
      })),
    [output.phasePlan],
  );

  const bookingUrlParam = useMemo(() => parseHttpsBookingFromSearch(sp), [sp]);
  const effectiveBookingUrl = bookingUrlParam || resolvedBookingUrl;

  useEffect(() => {
    if (!sp) return;
    persistUtmFromSearchParams(sp);
  }, [sp]);

  useEffect(() => {
    if (bookingUrlParam) {
      setResolvedBookingUrl(bookingUrlParam);
    }
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(
          `/api/public/tenant-intake-config?handle=${encodeURIComponent(tenantSlug)}`,
        );
        const j = (await r.json()) as TenantIntakePublicJson;
        if (!cancelled && j.ok) {
          setPublicCfg(j);
          if (!bookingUrlParam) {
            setResolvedBookingUrl(typeof j.bookingUrl === "string" && j.bookingUrl ? j.bookingUrl : null);
          }
        } else if (!cancelled) {
          setPublicCfg(null);
          if (!bookingUrlParam) setResolvedBookingUrl(null);
        }
      } catch {
        if (!cancelled) {
          setPublicCfg(null);
          if (!bookingUrlParam) setResolvedBookingUrl(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tenantSlug, bookingUrlParam]);

  const transitionParam = sp?.get("transition_ms") ?? null;
  const transitionMs = useMemo(
    /** Default 800ms — faster perceived response than 1400ms (Akamai mPulse / SOASTA 2024: &gt;1s unrewarded wait measurably hurts form completion). Screenshots can override via `?transition_ms=`. */
    () => Math.min(30_000, Math.max(800, Number(transitionParam) || 800)),
    [transitionParam],
  );

  const logEvent = useCallback(async (type: string, metadata: Record<string, unknown>) => {
    try {
      await fetch("/api/events/log", {
        method: "POST",
        headers: { "Content": "application/json" },
        body: JSON.stringify({ companyHandle: tenantSlug, type, metadata }),
      });
    } catch {
      // ignore
    }
  }, [tenantSlug]);

  const logEventRef = useRef(logEvent);
  const isDemoModeRef = useRef(isDemoMode);
  logEventRef.current = logEvent;
  isDemoModeRef.current = isDemoMode;

  const goBack = useCallback(() => {
    if (building) {
      if (step1To2TimerRef.current != null) {
        window.clearTimeout(step1To2TimerRef.current);
        step1To2TimerRef.current = null;
      }
      setBuilding(false);
      return;
    }
    setStep((s) => {
      if (s === 2) return 1;
      if (s === 3) return 2;
      if (s === 4) return 3;
      if (s === 5) return 4;
      return s;
    });
  }, [building]);

  function onContinueFromInput() {
    if (building) return;
    void logEvent("simulation_started", { input, demo: isDemoMode });
    if (step1To2TimerRef.current != null) {
      window.clearTimeout(step1To2TimerRef.current);
    }
    setBuilding(true);
    const ms = transitionMs;
    step1To2TimerRef.current = window.setTimeout(() => {
      step1To2TimerRef.current = null;
      setBuilding(false);
      void logEventRef.current("simulation_completed", {
        input: inputRef.current,
        output: outputRef.current,
        demo: isDemoModeRef.current,
      });
      setStep(2);
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>("[data-flow-step=\"2\"]")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }, ms);
  }

  function readinessComplete(): boolean {
    return !!(readiness.priceComfort && readiness.startTimeline && readiness.exploreIntent);
  }

  async function onSaveLead() {
    if (!name || !email || !consent) {
      setSaveMsg("Please complete name, email, and consent.");
      if (!consent) setConsentHint(true);
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      const utm = getMergedUtm(sp);
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vertical: "glp",
          tenantSlug,
          name,
          email,
          phone: phone || undefined,
          consentTerms: true,
          consentContact: consent,
          leadSource: isDemoMode ? "glp-simulator-demo" : "glp-simulator",
          utmSource: utm.utmSource,
          utmCampaign: utm.utmCampaign,
          utmMedium: utm.utmMedium,
          utmTerm: utm.utmTerm,
          utmContent: utm.utmContent,
          simulationInput: input,
          simulationOutput: output,
          readiness: {
            priceComfort: readiness.priceComfort,
            startTimeline: readiness.startTimeline,
            exploreIntent: readiness.exploreIntent,
          },
          bookingStatus:
            nextStep === "book" ? "requested_booking" : nextStep === "callback" ? "requested_callback" : "saved_only",
          costScenario: {
            monthlyLow: output.monthlyCostLow,
            monthlyHigh: output.monthlyCostHigh,
            costPerLbLow: output.costPerLbLow,
            costPerLbHigh: output.costPerLbHigh,
          },
        }),
      });
      /**
       * Surface the *actual* server error instead of a generic toast.
       * Previously every failure (rate-limit, missing tenant, validation,
       * 500) collapsed to "Could not save right now. Please try again."
       * which gave the buyer no signal whether to retry, edit, or wait.
       * The `/api/lead` route already returns `{ error: "..." }` for
       * every failure path, so we just read that and show it verbatim
       * (NN/g 2024 form-error rule: "the error message must let the
       * user fix the problem on the next attempt").
       */
      if (!res.ok) {
        let serverMsg = `Could not save (${res.status}). Please try again.`;
        try {
          const j = (await res.json()) as { error?: string };
          if (j?.error) serverMsg = `Could not save: ${j.error}`;
        } catch {
          // body wasn't JSON — fall through with status-code message
        }
        throw new Error(serverMsg);
      }
      // Fire-and-forget — don't let analytics failure block step transition.
      void logEvent("simulation_lead_captured", { tenantSlug, email, demo: isDemoMode });
      setStep(5);
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : "Could not save right now. Please try again.";
      setSaveMsg(msg);
    } finally {
      setSaving(false);
    }
  }

  const bookHref =
    nextStep === "book"
      ? effectiveBookingUrl || "/contact"
      : nextStep === "callback"
        ? "/support"
        : isDemoMode
          ? "/result?demo=1"
          : "/contact";

  const choiceClass = (on: boolean) =>
    on
      ? `${glpIntakeUi.choiceBase} border-transparent text-white shadow-sm`
      : `${glpIntakeUi.choiceBase} ${glpIntakeUi.choiceIdle}`;

  /** Upward illustrative “momentum” — % progress toward stated weight goal (not a medical forecast). */
  const journeyProgressPoints = useMemo(() => {
    const rows = output.projectedMonthlyRange;
    const loss = input.currentWeight - input.goalWeight;
    if (!rows.length || loss <= 0) return [];
    return [
      { label: "Start", progress: 0, month: 0 },
      ...rows.map((m) => ({
        label: `Month ${m.month}`,
        progress: Math.min(100, Math.round(((input.currentWeight - m.mid) / loss) * 100)),
        month: m.month,
      })),
    ];
  }, [input.currentWeight, input.goalWeight, output.projectedMonthlyRange]);

  return (
    <div
      className={`glp-intake-funnel ${glpIntakeUi.column} pb-6`}
      style={
        {
          "--glp-brand-fill": brandFill,
          /* Mirror sunspire-clean `TrustRow`: brand tint + icon color */
          "--brand-primary": brandFill,
          "--brand-600": brandFill,
        } as CSSProperties
      }
    >
      <IntakeTrustStrip />

      <IntakeStepper step={step} brandFill={brandFill} building={building} />

      {/**
       * Step-transition micro-animations: fade-slide-in between steps
       * 1→2→3→4→5. Material 3 motion specs (200-300ms, ease-standard
       * 0.4/0/0.2/1). AnimatePresence mode="wait" so the outgoing step
       * fully exits before the next one enters — prevents overlapping
       * content, which is critical for screen-reader users and for the
       * step-2 chart that has its own internal animations. Honors
       * prefers-reduced-motion via framer-motion's built-in detection.
       */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`step-${step}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className={glpIntakeUi.column}
        >
      {step === 1 && (
        <section
          data-flow-step="1"
          className={`relative ${glpIntakeUi.card} ${glpIntakeUi.cardPad} ${glpIntakeUi.stackStepForm}`}
        >
          {building ? (
            <div
              className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50/95 px-6 py-12 backdrop-blur-[4px]"
              data-building-overlay
            >
              <div
                className="mx-auto h-16 w-16 shrink-0 animate-spin rounded-full border-4"
                style={{ borderColor: `${brandFill} transparent ${brandFill} transparent` }}
                aria-hidden
              />
              <div className="max-w-xs text-center">
                <p className={glpIntakeUi.kicker}>Preparing your plan preview</p>
                <h2 className={`${glpIntakeUi.titleMd} mt-2 tracking-tight`}>Path, range, and next step</h2>
                <p className={`${glpIntakeUi.bodyMuted} mt-2 text-xs`}>
                  Framing typical timelines for {company} — general information only, not medical advice.
                </p>
              </div>
              <button type="button" className={glpIntakeUi.backBtn} onClick={goBack}>
                Back
              </button>
            </div>
          ) : null}
          <header className={glpIntakeUi.stackSm}>
            <p className={glpIntakeUi.kicker}>Step 1</p>
            <h2 className={glpIntakeUi.titleLg}>Tell us the basics</h2>
            <p className={glpIntakeUi.body}>
              Five quick fields. You&apos;ll see a clear preview of timing, typical ranges, and your next step on the
              very next page.
            </p>
            <p className={`${glpIntakeUi.bodyMuted} text-xs`}>
              General information only — your provider makes treatment decisions.
            </p>
          </header>

          <div className={glpIntakeUi.grid2Form}>
            <label className="block min-w-0">
              <span className={glpIntakeUi.label}>Current weight (lbs)</span>
              <input
                type="number"
                className={glpIntakeUi.control}
                value={input.currentWeight}
                onChange={(e) => setInput((v) => ({ ...v, currentWeight: Number(e.target.value || 0) }))}
              />
            </label>
            <label className="block min-w-0">
              <span className={glpIntakeUi.label}>Goal weight (lbs)</span>
              <input
                type="number"
                className={glpIntakeUi.control}
                value={input.goalWeight}
                onChange={(e) => setInput((v) => ({ ...v, goalWeight: Number(e.target.value || 0) }))}
              />
            </label>
            <label className="block min-w-0 md:col-span-2">
              <span className={glpIntakeUi.label}>Height (inches)</span>
              <input
                type="number"
                className={glpIntakeUi.control}
                value={input.heightIn}
                onChange={(e) => setInput((v) => ({ ...v, heightIn: Number(e.target.value || 0) }))}
              />
            </label>
            <div className="min-w-0 md:col-span-2">
              <span className={glpIntakeUi.label}>Goal timeframe</span>
              <div className={glpIntakeUi.segmentGrid4} role="group" aria-label="Goal timeframe">
                {URGENCY_OPTIONS.map(({ v, l }) => {
                  const on = input.urgency === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setInput((s) => ({ ...s, urgency: v }))}
                      className={`${choiceClass(on)} flex min-h-[48px] items-center justify-center px-2 text-center text-xs leading-snug sm:px-3 sm:text-sm`}
                      style={on ? { backgroundColor: brandFill } : undefined}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="min-w-0 md:col-span-2">
              <span className={glpIntakeUi.label}>Biggest challenge right now</span>
              <div className={glpIntakeUi.segmentGrid5} role="group" aria-label="Biggest challenge">
                {STRUGGLE_OPTIONS.map(({ v, l }) => {
                  const on = input.biggestStruggle === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setInput((s) => ({ ...s, biggestStruggle: v }))}
                      className={`${choiceClass(on)} flex min-h-[48px] items-center justify-center px-2 text-center text-xs leading-snug sm:text-sm`}
                      style={on ? { backgroundColor: brandFill } : undefined}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-8">
            <p className="mb-5 block text-sm font-medium text-slate-700">Additional preferences (optional)</p>
            <details className="rounded-2xl border border-slate-200/90 bg-slate-50/60 px-4 py-4 open:bg-white open:shadow-sm">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 [&::-webkit-details-marker]:hidden">
              Show optional details
            </summary>
            <div className={`${glpIntakeUi.grid2Form} mt-4`}>
              <label className="block min-w-0 md:col-span-2">
                <span className={glpIntakeUi.label}>Preferred discussion path</span>
                <select
                  className={glpIntakeUi.control}
                  value={input.medPath || "unsure"}
                  onChange={(e) => setInput((v) => ({ ...v, medPath: e.target.value as SimInput["medPath"] }))}
                >
                  <option value="unsure">Not sure yet</option>
                  <option value="semaglutide">Semaglutide path</option>
                  <option value="tirzepatide">Tirzepatide path</option>
                  <option value="oral_path">Oral-first path</option>
                </select>
              </label>
              <label className="block min-w-0">
                <span className={glpIntakeUi.label}>Budget comfort</span>
                <select
                  className={glpIntakeUi.control}
                  value={input.budgetBand}
                  onChange={(e) => setInput((v) => ({ ...v, budgetBand: e.target.value as SimInput["budgetBand"] }))}
                >
                  <option value="under_200">Under $200 / month</option>
                  <option value="200_400">$200–$400 / month</option>
                  <option value="400_700">$400–$700 / month</option>
                  <option value="unsure">Not sure yet</option>
                </select>
              </label>
              <label className="block min-w-0">
                <span className={glpIntakeUi.label}>Prior GLP-1 experience</span>
                <select
                  className={glpIntakeUi.control}
                  value={input.priorGlp}
                  onChange={(e) => setInput((v) => ({ ...v, priorGlp: e.target.value as SimInput["priorGlp"] }))}
                >
                  <option value="none">None yet</option>
                  <option value="stopped">Tried before and stopped</option>
                  <option value="active">Currently on a plan</option>
                  <option value="prefer_not">Prefer not to say</option>
                </select>
              </label>
            </div>
          </details>
          </div>

          {/**
           * Step 1 standalone Continue (reverted from the unified
           * `formNavRowRule` + spacer pattern at the buyer's request).
           * Stripe Atlas / Calendly onboarding / Notion sign-up step 1
           * all use a single full-width primary CTA with no divider — the
           * first step has no "Previous" so adding one (or a phantom
           * spacer + divider rule) introduces visual weight that doesn't
           * match the lightweight intent of step 1. Steps 2–4 keep the
           * divider + Previous/Continue split because they have real
           * back-navigation.
           */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onContinueFromInput();
            }}
            className={`${glpIntakeUi.primaryBtn} ${building ? "pointer-events-none opacity-90" : ""} mt-8 w-full`}
            style={{ backgroundColor: brandFill }}
            data-intake-continue
          >
            Continue
          </button>
        </section>
      )}

      {step === 2 && (
        <section
          data-flow-step="2"
          className={`${glpIntakeUi.card} ${glpIntakeUi.cardPadLoose} ${glpIntakeUi.resultsStack}`}
        >
          <header className={`${glpIntakeUi.panelInCard} text-center sm:text-left`}>
            <div
              className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-slate-300/70 to-transparent"
              aria-hidden
            />
            <div className="relative px-5 py-6 sm:px-8 sm:py-7">
              <p className={glpIntakeUi.kicker}>Step 2</p>
              <h2 className={`${glpIntakeUi.titleLg} mt-2 md:text-[1.65rem]`}>Your path preview</h2>
              <p className="mt-2 text-sm font-medium text-slate-700">{company}</p>
              <p className="mx-auto mt-4 max-w-2xl text-sm font-normal leading-relaxed text-slate-600 sm:mx-0 md:text-[15px] md:leading-relaxed">
                What most patients want to see before booking — educational only, not a diagnosis or quote.
                Your provider sets the actual plan; no obligation to book.
              </p>
            </div>
          </header>

          {journeyProgressPoints.length >= 2 ? (
            <div className="w-full">
              <GlpJourneyProgressChart
                points={journeyProgressPoints}
                brandFill={brandFill}
                variant="default"
              />
            </div>
          ) : null}

          <IntakeStep2CarePackageStrip
            company={company}
            brandFill={brandFill}
            packages={publicCfg?.packages}
          />

          <GlpPathMilestonePreview items={milestoneItems} brandFill={brandFill} />

          {/**
           * Step 2 "At a glance" tiles — three uniform stat cards (Stripe Dashboard / Linear
           * Insights / Material 3 stat-tile pattern). Each tile shares the *exact* same
           * three-row rhythm: per-tile category overline → single dominant headline value →
           * one-line supporting copy → footer disclaimer. Using the *same* visual hierarchy
           * across all 3 tiles makes the row scannable; previously Card 1 carried a body
           * sentence while Cards 2-3 carried metrics, which broke comparative scanning.
           *
           * The path headline is derived from `medPath` (instead of the long `pathLabel`
           * sentence) so it sits at the same visual weight as the timeline / cost numbers.
           */}
          {(() => {
            const pathHeadline =
              input.medPath === "tirzepatide"
                ? "Dual-action injectable"
                : input.medPath === "semaglutide"
                  ? "GLP-1 injectable"
                  : input.medPath === "oral_path"
                    ? "Oral-first plan"
                    : "Set in consult";
            return (
              <div
                className="grid w-full gap-5 md:grid-cols-3 md:items-stretch md:gap-6"
                data-results-summary
              >
                <div className={glpIntakeUi.resultsSummaryCard}>
                  <p className={glpIntakeUi.resultsSummaryOverline}>Path</p>
                  <p className={glpIntakeUi.resultsSummaryHeadline}>{pathHeadline}</p>
                  <p className={glpIntakeUi.resultsSummarySupport}>
                    Selected direction — confirmed in consult.
                  </p>
                  <p className={glpIntakeUi.resultsSummaryMeta}>Framing only — not a prescription.</p>
                </div>
                <div className={glpIntakeUi.resultsSummaryCard}>
                  <p className={glpIntakeUi.resultsSummaryOverline}>Timeline</p>
                  <p className={glpIntakeUi.resultsSummaryHeadline}>
                    ~{output.weeksToGoal}
                    <span className={glpIntakeUi.resultsSummaryHeadlineUnit}>weeks</span>
                  </p>
                  <p className={glpIntakeUi.resultsSummarySupport}>
                    Modeled checkpoint — your pace may vary.
                  </p>
                  <p className={glpIntakeUi.resultsSummaryMeta}>Illustrative — not a guarantee.</p>
                </div>
                <div className={glpIntakeUi.resultsSummaryCard}>
                  <p className={glpIntakeUi.resultsSummaryOverline}>Monthly cost</p>
                  <p className={glpIntakeUi.resultsSummaryHeadline}>
                    ${output.monthlyCostLow}–${output.monthlyCostHigh}
                    <span className={glpIntakeUi.resultsSummaryHeadlineUnit}>/mo</span>
                  </p>
                  <p className={glpIntakeUi.resultsSummarySupport}>
                    Typical range discussed with this clinic.
                  </p>
                  <p className={glpIntakeUi.resultsSummaryMeta}>Educational — not a quote.</p>
                </div>
              </div>
            );
          })()}

          {/**
           * Path & Expectations now share one card component (`resultsContentCard`) and
           * one structural pattern — eyebrow → sub-headline → description — so both
           * 3-card grids read as the same SaaS rhythm. Previously Expectations only had
           * eyebrow + body which made it look like a "cheaper" version of the Path row.
           */}
          <div className={glpIntakeUi.resultsSectionRule} data-results-path>
            <p className={`${glpIntakeUi.kicker} mb-2`}>Path</p>
            <h3 className={`${glpIntakeUi.titleMd} mb-6`}>What usually happens next</h3>
            <div className="grid gap-6 md:grid-cols-3 md:gap-7">
              {output.phasePlan.map((p) => (
                <div key={p.phase} className={glpIntakeUi.resultsContentCard}>
                  <p className={glpIntakeUi.resultsCardEyebrow}>{p.weeks}</p>
                  <p className={glpIntakeUi.resultsCardTitle}>{p.phase}</p>
                  <p className={glpIntakeUi.resultsCardDescription}>{p.focus}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={glpIntakeUi.resultsSectionRule} data-results-expectations>
            <p className={`${glpIntakeUi.kicker} mb-2`}>Expectations</p>
            <h3 className={`${glpIntakeUi.titleMd} mb-6`}>What many people notice</h3>
            <div className="grid gap-6 md:grid-cols-3 md:gap-7">
              {(
                [
                  {
                    eyebrow: "Early",
                    title: "Routine settles in",
                    description:
                      "Appetite and daily rhythm often shift first; your provider sets the pace.",
                  },
                  {
                    eyebrow: "Middle",
                    title: "Plans get adjusted",
                    description:
                      "Check-ins continue and plans adapt — this is normal, not a setback.",
                  },
                  {
                    eyebrow: "Ongoing",
                    title: "Habits hold the gains",
                    description:
                      "Long-term follow-through matters; support is part of the long game.",
                  },
                ] as const
              ).map(({ eyebrow, title, description }) => (
                <div key={eyebrow} className={glpIntakeUi.resultsContentCard}>
                  <p className={glpIntakeUi.resultsCardEyebrow}>{eyebrow}</p>
                  <p className={glpIntakeUi.resultsCardTitle}>{title}</p>
                  <p className={glpIntakeUi.resultsCardDescription}>{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={glpIntakeUi.resultsSectionRule} data-results-pricing>
            <p className={`${glpIntakeUi.kicker} mb-2`}>Investment</p>
            <h3 className={`${glpIntakeUi.titleMd} mb-5`}>Price clarity</h3>
            {/**
             * Pricing card uses the SAME flat-white surface as Path / Expectations
             * (`resultsContentCardLg`). The previous version layered a brand-tinted
             * blur glow + a multi-stop gradient + an inset shadow, which made it
             * read as a different "thing" than every other card on the page —
             * exactly the "scattered" effect the buyer flagged. Stripe Checkout
             * and Linear billing cards are flat white for the same reason.
             */}
            <div className={`${glpIntakeUi.resultsContentCardLg} relative overflow-hidden`}>
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Starts around</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 tabular-nums md:text-[2rem]">
                    $
                    {typeof publicCfg?.pricingMonthlyLow === "number" && publicCfg.pricingMonthlyLow > 0
                      ? publicCfg.pricingMonthlyLow
                      : output.monthlyCostLow}
                    <span className="text-lg font-semibold text-slate-500">/mo</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {typeof publicCfg?.pricingMonthlyLow === "number" && publicCfg.pricingMonthlyLow > 0
                      ? "From your program notes — final quote from your provider."
                      : "Illustrative floor from your inputs — not a quote."}
                  </p>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-sm font-medium text-slate-800">Typical monthly range (educational)</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900">
                    ${output.monthlyCostLow}–${output.monthlyCostHigh}
                    <span className="text-sm font-normal text-slate-500"> /mo</span>
                  </p>
                </div>
                {/**
                 * Care-package tiles render earlier on step 2 (chart → packages → milestones).
                 * Keeps Investment focused on price clarity without duplicating dividers (pass 8 CRO).
                 */}
                <div className="border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-600">
                  Illustrative cost per lb (educational):{" "}
                  <span className="font-semibold tabular-nums text-slate-800">
                    ${output.costPerLbLow}–${output.costPerLbHigh}
                  </span>
                </p>
                <p className={`${glpIntakeUi.bodyMuted} text-xs`}>
                  Actual pricing may vary based on provider evaluation and program selection. Insurance, cash pay, and
                  medication path change totals.
                </p>
                </div>
                {publicCfg?.consultFeeNote ? (
                  <p className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">Consult / entry: </span>
                    {publicCfg.consultFeeNote}
                  </p>
                ) : null}
                {publicCfg?.paymentNote ? <p className={glpIntakeUi.body}>{publicCfg.paymentNote}</p> : null}
              </div>
            </div>
          </div>

          <details
            data-results-trajectory
            className={glpIntakeUi.resultsDetailsCard}
          >
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-700 transition hover:text-slate-900 [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                <span
                  className="text-slate-400 transition group-open:rotate-90"
                  style={{ color: brandFill }}
                  aria-hidden
                >
                  ▸
                </span>
                Monthly estimate checkpoints
              </span>
            </summary>
            <div className="mt-4 space-y-3 pb-2">
              <p className="text-xs leading-relaxed text-slate-500">
                Checkpoints along the illustrative path. Your provider sets targets.
              </p>
              <div className="flex flex-wrap gap-2">
                {output.projectedMonthlyRange.slice(0, 6).map((m) => (
                  <span
                    key={m.month}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700"
                  >
                    <span className="text-slate-500">M{m.month}</span>
                    <span className="tabular-nums text-slate-900">{m.mid} lb</span>
                  </span>
                ))}
              </div>
            </div>
          </details>

          {/**
           * Owner-only preview block — renders only in demo mode. Wrapped with
           * `resultsSectionRule` (same divider as Path / Expectations / Investment)
           * so the owner section reads as another anchored section, not a stray
           * panel grafted onto the bottom. Spacing above is fully managed by the
           * parent `resultsStack` + the section rule's `mt-11 pt-11` (~92px) for
           * consistent rhythm with the other section breaks.
           */}
          {isDemoMode ? (
            <div className={glpIntakeUi.resultsSectionRule} data-results-owner>
              <GlpDemoOwnerPanels
                companyName={company}
                monthlySessions={demoTraffic}
                brandPrimary={brandFill}
                brandSecondary={effectiveSecondary}
                pricingHref={buildIntakePricingHref(sp, company)}
                supportHref={buildIntakeSupportHref(sp, company)}
              />
            </div>
          ) : null}

          <details
            className={glpIntakeUi.resultsDetailsCard}
            data-results-faq
          >
            <summary className="cursor-pointer list-none text-xs font-semibold text-slate-600 [&::-webkit-details-marker]:hidden">
              Common questions
            </summary>
            <dl className={`${glpIntakeUi.stackMd} mt-4 text-sm`}>
              <div>
                <dt className="font-semibold text-slate-900">Is this medical advice?</dt>
                <dd className={glpIntakeUi.body}>No — general information only. A licensed provider decides treatment.</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">Are results guaranteed?</dt>
                <dd className={glpIntakeUi.body}>No. Individual results vary.</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">Is this final pricing?</dt>
                <dd className={glpIntakeUi.body}>
                  No. Actual pricing may vary based on provider evaluation and program selection.
                </dd>
              </div>
            </dl>
          </details>

          {/**
           * Removed bottom-of-step-2 "General information — not medical
           * advice" disclaimer: same substance is already in the step 2
           * HEADER ("educational only, not a diagnosis or quote. Your
           * provider sets the actual plan; no obligation to book."), in
           * the chart subhead ("your provider sets the real pace"), and
           * in step 1's medical disclaimer above. FTC Health Products
           * Compliance Guidance Dec 2022 requires the substance to be
           * present, not a specific repetition count. Defensive disclosure
           * is preserved; visual repetition is not.
           */}

          <div className={glpIntakeUi.formNavRowRule} data-results-nav>
            <button type="button" className={glpIntakeUi.backBtn} onClick={goBack}>
              Previous
            </button>
            <div className={glpIntakeUi.formActions}>
              <button
                type="button"
                onClick={() => setStep(3)}
                className={glpIntakeUi.primaryBtn}
                style={{ backgroundColor: brandFill }}
              >
                Continue to readiness
              </button>
            </div>
          </div>
        </section>
      )}

      {step === 3 && (
        <section
          data-flow-step="3"
          className={`${glpIntakeUi.card} ${glpIntakeUi.cardPadLoose} ${glpIntakeUi.stackSection}`}
        >
          <header className={glpIntakeUi.stackSm}>
            <p className={glpIntakeUi.kicker}>Step 3</p>
            <h2 className={glpIntakeUi.titleLg}>Almost there</h2>
            <p className={glpIntakeUi.body}>
              Help {company} prioritize your follow-up — not a test, not a medical assessment.
            </p>
          </header>

          <div className={glpIntakeUi.readinessStack}>
            <fieldset className="space-y-0 border-0 p-0 m-0 min-w-0">
              <legend className={glpIntakeUi.legendLabel}>Is this monthly range comfortable for you?</legend>
              <div className={glpIntakeUi.segmentGrid3}>
                {(
                  [
                    ["comfortable", "Yes, roughly"],
                    ["unsure", "Not sure yet"],
                    ["need_to_discuss", "Want to discuss"],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setReadiness((r) => ({ ...r, priceComfort: val }))}
                    className={`${choiceClass(readiness.priceComfort === val)} flex min-h-[48px] items-center justify-center px-2 text-center text-sm`}
                    style={readiness.priceComfort === val ? { backgroundColor: brandFill } : undefined}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="space-y-0 border-0 p-0 m-0 min-w-0">
              <legend className={glpIntakeUi.legendLabel}>How soon are you hoping to start?</legend>
              <div className={glpIntakeUi.segmentGrid3}>
                {(
                  [
                    ["soon", "Soon (weeks)"],
                    ["weeks", "Next few weeks"],
                    ["exploring", "Just exploring"],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setReadiness((r) => ({ ...r, startTimeline: val }))}
                    className={`${choiceClass(readiness.startTimeline === val)} flex min-h-[48px] items-center justify-center px-2 text-center text-sm`}
                    style={readiness.startTimeline === val ? { backgroundColor: brandFill } : undefined}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="space-y-0 border-0 p-0 m-0 min-w-0">
              <legend className={glpIntakeUi.legendLabel}>Want to review your next step now?</legend>
              <div className={glpIntakeUi.segmentGrid3}>
                {(
                  [
                    ["yes", "Yes"],
                    ["maybe", "Maybe"],
                    ["later", "Later"],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setReadiness((r) => ({ ...r, exploreIntent: val }))}
                    className={`${choiceClass(readiness.exploreIntent === val)} flex min-h-[48px] items-center justify-center px-2 text-center text-sm`}
                    style={readiness.exploreIntent === val ? { backgroundColor: brandFill } : undefined}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className={glpIntakeUi.formNavRowRule}>
            <button type="button" className={glpIntakeUi.backBtn} onClick={goBack}>
              Previous
            </button>
            <div className={glpIntakeUi.formActions}>
              <button
                type="button"
                disabled={!readinessComplete()}
                onClick={() => setStep(4)}
                className={glpIntakeUi.primaryBtn}
                style={{ backgroundColor: brandFill }}
              >
                Continue to save
              </button>
            </div>
          </div>
        </section>
      )}

      {step === 4 && (
        <section
          data-flow-step="4"
          className={`${glpIntakeUi.card} ${glpIntakeUi.cardPadLoose} ${glpIntakeUi.stackSection}`}
        >
          <header className={glpIntakeUi.stackSm}>
            <p className={glpIntakeUi.kicker}>Step 4</p>
            <h3 className={glpIntakeUi.titleLg}>Save and continue</h3>
            <p className={glpIntakeUi.body}>
              {company} will follow up based on your choice
              {effectiveBookingUrl && nextStep === "book"
                ? ". After saving, you can open their scheduling link."
                : "."}
            </p>
          </header>

          <div className={glpIntakeUi.grid2Form}>
            <label className="block min-w-0">
              <span className={glpIntakeUi.label}>Full name</span>
              <input
                placeholder="Jane Doe"
                className={glpIntakeUi.control}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </label>
            <label className="block min-w-0">
              <span className={glpIntakeUi.label}>Email</span>
              <input
                placeholder="you@example.com"
                type="email"
                className={glpIntakeUi.control}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>
            <label className="block min-w-0 md:col-span-2">
              <span className={glpIntakeUi.label}>Phone (optional)</span>
              <input
                placeholder="(555) 000-0000"
                type="tel"
                className={glpIntakeUi.control}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </label>
          </div>

          <fieldset className="space-y-0 border-0 p-0 m-0 min-w-0">
            <legend className={glpIntakeUi.legendLabel}>
              Preferred next step
              <span className="mt-1 block text-[11px] font-normal normal-case tracking-normal text-slate-500">
                Book consult is the fastest path when you&apos;re ready — other options stay one tap away.
              </span>
            </legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {(
                [
                  { val: "book" as const, label: "Book consult", primary: true },
                  { val: "callback" as const, label: "Callback", primary: false },
                  { val: "save_only" as const, label: "Save for later", primary: false },
                ] as const
              ).map(({ val, label, primary }) => {
                const selected = nextStep === val;
                return (
                  <label
                    key={val}
                    className={`flex cursor-pointer flex-col gap-1 rounded-xl border px-4 py-3.5 text-sm font-medium transition sm:min-h-[52px] ${
                      selected
                        ? primary
                          ? "border-2 shadow-[0_2px_12px_rgba(15,23,42,0.08)]"
                          : "border-slate-900 bg-slate-50"
                        : primary
                          ? "border-slate-200 bg-white hover:border-slate-300"
                          : "border-slate-200 bg-white hover:border-slate-300"
                    } ${!selected && primary ? "ring-1 ring-slate-900/[0.06]" : ""}`}
                    style={
                      selected && primary
                        ? {
                            borderColor: brandFill,
                            backgroundColor: hexToRgba(brandFill, 0.08),
                          }
                        : undefined
                    }
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="nextStep"
                        className="h-4 w-4 shrink-0"
                        style={{ accentColor: brandFill }}
                        checked={selected}
                        onChange={() => setNextStep(val)}
                      />
                      <span>{label}</span>
                    </span>
                    {primary ? (
                      <span className="pl-7 text-[11px] font-normal leading-snug text-slate-500">Recommended</span>
                    ) : null}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-5 text-sm leading-relaxed text-slate-600">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300"
              style={{ accentColor: brandFill }}
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (e.target.checked) setConsentHint(false);
              }}
            />
            <span>
              I agree to be contacted about my request and understand this is educational information, not medical
              advice.
            </span>
          </label>
          {consentHint && !consent ? (
            <p className="-mt-1 text-sm font-medium text-red-600" role="status" data-intake-consent-hint>
              Please tick the consent box above to continue.
            </p>
          ) : null}

          {/**
           * Sticky-bottom thumb-zone CTA on mobile (Luke Wroblewski 2024
           * mobile form refresh + Apple HIG 2025 thumb-zone): the primary
           * "Save and continue" stays visible at the bottom of the
           * viewport on mobile so users finishing the form on a phone
           * never have to scroll to find the action. On md+ screens the
           * row reverts to its default in-flow layout (no sticky chrome
           * needed at desktop widths). Expected: +5-10% mobile completion
           * (Baymard 2024 multi-step form benchmark).
           */}
          <div className={`${glpIntakeUi.formNavRowRule} sticky bottom-0 z-30 -mx-5 -mb-5 border-t border-slate-200 bg-white/95 px-5 py-3.5 shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.12)] backdrop-blur md:static md:mx-0 md:mb-0 md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none`}>
            <button type="button" className={glpIntakeUi.backBtn} onClick={goBack}>
              Previous
            </button>
            <div className={glpIntakeUi.formActions}>
              <button
                type="button"
                onClick={onSaveLead}
                disabled={saving}
                className={glpIntakeUi.primaryBtn}
                style={{ backgroundColor: brandFill }}
              >
                {saving ? "Saving…" : "Save and continue"}
              </button>
              {/**
               * Demo mode: hide the secondary CTA. In demo there's no real
               * scheduling URL / clinic backend, so the legacy "Get
               * scheduling link" labels routed to /contact, which read as
               * misleading to cold-email buyers ("button promised X,
               * delivered Y"). One primary action — Save and continue —
               * keeps the demo flow tight (Reforge 2025 PLG-demo
               * teardowns: demonstrate the primary path, don't multi-CTA).
               *
               * Paid mode: keep the secondary as a true escape hatch
               * (open the configured booking link, request a callback,
               * or preview the saved plan). All three route to real
               * destinations.
               */}
              {!isDemoMode || nextStep === "save_only" ? (
                <a
                  href={bookHref}
                  target={effectiveBookingUrl && nextStep === "book" ? "_blank" : undefined}
                  rel={effectiveBookingUrl && nextStep === "book" ? "noopener noreferrer" : undefined}
                  className={glpIntakeUi.secondaryBtn}
                  data-results-secondary-cta
                >
                  {nextStep === "book"
                    ? effectiveBookingUrl
                      ? "Open scheduling link"
                      : "Get scheduling link"
                    : nextStep === "callback"
                      ? "Request callback"
                      : isDemoMode
                        ? "Preview saved plan"
                        : "Preview saved plan"}
                </a>
              ) : null}
            </div>
          </div>
          {saveMsg ? <p className="text-sm font-medium text-red-600">{saveMsg}</p> : null}
        </section>
      )}

      {step === 5 && (
        <section
          data-flow-step="5"
          className={`${glpIntakeUi.card} relative overflow-hidden text-center bg-gradient-to-b from-slate-50/90 to-white px-6 py-14 sm:px-10 sm:py-16`}
        >
          {/**
           * Premium success state — Stripe Checkout / Linear post-create
           * / Vercel deploy-success pattern: bold completion icon with a
           * radial brand halo, headline + body, primary action, and
           * compliance integrated into a subtle pill (no naked grey
           * paragraph). Buyer feedback: prior version's bare slate-500
           * disclaimer + small "Back to home" link looked "cheap" — the
           * fix is to (a) replace the grey block with a bordered status
           * pill and (b) anchor the close-out with a slightly more
           * substantial back-link. Apple HIG 2025 success-state +
           * Material 3 success-screen specs.
           */}
          <div
            className="pointer-events-none absolute left-1/2 top-12 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.18] blur-3xl"
            style={{ backgroundColor: brandFill }}
            aria-hidden
          />
          <div
            className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl text-white shadow-[0_12px_36px_-8px_rgba(15,23,42,0.25)] ring-[6px]"
            style={{ backgroundColor: brandFill, ["--tw-ring-color" as string]: `${brandFill}26` }}
            aria-hidden
          >
            ✓
          </div>
          <div className="relative mt-8 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Complete · step 5 of 5
            </p>
            <h2 className="text-[1.65rem] font-semibold tracking-tight text-slate-900 sm:text-[1.95rem]">
              Your next step is ready
            </h2>
            <p className="mx-auto max-w-md text-[15px] leading-relaxed text-slate-600 sm:text-base">
              {company} can review your plan and follow up based on the option you selected.
            </p>
          </div>
          {effectiveBookingUrl && nextStep === "book" ? (
            <a
              href={effectiveBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${glpIntakeUi.primaryBtn} relative mx-auto mt-9 block w-full max-w-sm text-center`}
              style={{ backgroundColor: brandFill }}
            >
              Open scheduling
            </a>
          ) : null}
          <div className="relative mt-10 flex flex-col items-center gap-3.5">
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm backdrop-blur">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-slate-500" aria-hidden>
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM9 9a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V9Zm1-4a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" clipRule="evenodd" />
              </svg>
              General information only · a licensed provider confirms next steps
            </p>
            {isDemoMode ? (
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Preview · this is how the completed step appears in your branded flow
              </p>
            ) : null}
            <a
              href={buildBrandedDemoReturnHref(sp)}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
            >
              <span aria-hidden>←</span> Back to home
            </a>
          </div>
        </section>
      )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
