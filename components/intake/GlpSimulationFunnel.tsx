"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import GlpDemoOwnerPanels from "@/components/intake/GlpDemoOwnerPanels";
import { persistUtmFromSearchParams, getMergedUtm } from "@/lib/glp-attribution";
import { resolveGlpTenantSlug } from "@/lib/glp-tenant-slug";
import { glpIntakeUi } from "@/lib/glp-intake-ui";
import { parseGlpIntakeQueryBranding } from "@/lib/glp-intake-query-branding";

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

type FlowStep = 1 | 2 | 3 | 4 | 5 | 6;

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
      ? "Provider-led GLP-1/GIP pathway"
      : input.medPath === "semaglutide"
        ? "Provider-led GLP-1 pathway"
        : input.medPath === "oral_path"
          ? "Oral-first weight management pathway"
          : "Best-fit provider pathway (to be confirmed in consult)";
  const confidenceBand: SimOutput["confidenceBand"] =
    input.priorGlp === "active" ? "conservative" : input.urgency === "asap" ? "accelerated" : "typical";
  const phasePlan = [
    { phase: "Starter phase", weeks: "Weeks 1–4", focus: "Tolerability, appetite changes, habit setup" },
    { phase: "Active phase", weeks: "Weeks 5–16", focus: "Dose progression and monthly trend checks" },
    { phase: "Continuation phase", weeks: "Month 5+", focus: "Sustained progress and maintenance planning" },
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

function IntakeStepper({ step, brandFill }: { step: FlowStep; brandFill: string }) {
  const labels = ["Details", "Personalizing", "Results", "Readiness", "Contact", "Done"] as const;
  /** One segment per screen: step 1 ≈ 17%, …, step 6 = 100% (bar advances every step, no empty start). */
  const pct = Math.min(100, Math.max(0, (step / 6) * 100));
  const short = ["1", "2", "3", "4", "5", "6"] as const;
  return (
    <div className={`${glpIntakeUi.column} mb-8`} data-intake-stepper>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className={glpIntakeUi.kicker}>Progress</p>
        <p className="text-xs font-medium text-slate-600">
          Step {step} of 6 · <span className="text-slate-900">{labels[step - 1]}</span>
        </p>
      </div>
      <div
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-900/[0.06]"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={6}
        aria-valuetext={`Step ${step} of 6, ${labels[step - 1]}`}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: brandFill }}
        />
      </div>
      <div className="mt-3 flex justify-between gap-0.5 px-0.5" aria-hidden>
        {short.map((n, i) => {
          const s = (i + 1) as FlowStep;
          const on = step >= s;
          return (
            <div key={n} className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <span
                className={`h-2 w-2 shrink-0 rounded-full transition-colors duration-300 ${
                  on ? "ring-2 ring-white" : "bg-slate-200"
                }`}
                style={on ? { backgroundColor: brandFill } : undefined}
              />
              <span className={`text-[9px] font-semibold ${on ? "text-slate-800" : "text-slate-400"}`}>{n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GlpSimulationFunnel() {
  const sp = useSearchParams();
  const tenantSlug = resolveGlpTenantSlug(sp);
  const companyFromQuery = sp?.get("company")?.trim() || "";
  const [publicCfg, setPublicCfg] = useState<TenantIntakePublicJson | null>(null);
  const company = companyFromQuery || publicCfg?.displayName || "your clinic";
  const isDemoMode =
    sp?.get("demo") === "1" || sp?.get("preview") === "1" || sp?.get("mode") === "demo";
  const demoQuick =
    sp?.get("demo_quick") === "1" || sp?.get("fast") === "1" || sp?.get("quick") === "1";
  const demoTraffic = Math.min(50_000, Math.max(50, Number(sp?.get("demo_traffic") || 400) || 400));
  const { logoUrl: logoFromQuery, primaryHex, secondaryHex: secondaryFromQuery } = useMemo(
    () => parseGlpIntakeQueryBranding(sp),
    [sp],
  );
  const effectiveLogo = logoFromQuery || publicCfg?.logoUrl || null;
  const brandFill = primaryHex || publicCfg?.brandColor || DEFAULT_BRAND;
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
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [nextStep, setNextStep] = useState<"book" | "callback" | "save_only">("book");
  const [resolvedBookingUrl, setResolvedBookingUrl] = useState<string | null>(null);
  const transitionTimerRef = useRef<number | null>(null);

  const output = useMemo(() => {
    const base = runSimulation(input);
    const low = publicCfg?.pricingMonthlyLow;
    const high = publicCfg?.pricingMonthlyHigh;
    if (typeof low === "number" && typeof high === "number" && low > 0 && high >= low) {
      return { ...base, monthlyCostLow: low, monthlyCostHigh: high };
    }
    return base;
  }, [input, publicCfg?.pricingMonthlyLow, publicCfg?.pricingMonthlyHigh]);

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

  /** Min ~1.6s so “Personalizing” reads as its own step (avoids jumping to Results too fast). */
  const transitionMs = Math.min(
    30_000,
    Math.max(1600, Number(sp?.get("transition_ms")) || 1400) || 1600,
  );

  useEffect(() => {
    if (step !== 2) return;
    transitionTimerRef.current = window.setTimeout(() => {
      transitionTimerRef.current = null;
      setStep(3);
    }, transitionMs);
    return () => {
      if (transitionTimerRef.current != null) {
        window.clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, [step, transitionMs]);

  const logEvent = useCallback(async (type: string, metadata: Record<string, unknown>) => {
    try {
      await fetch("/api/events/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyHandle: tenantSlug, type, metadata }),
      });
    } catch {
      // ignore
    }
  }, [tenantSlug]);

  const skipDemoToResults = useCallback(async () => {
    await logEvent("simulation_started", { input, demo: isDemoMode, demo_skip: true });
    await logEvent("simulation_completed", { input, output, demo: isDemoMode, demo_skip: true });
    setStep(3);
  }, [input, output, isDemoMode, logEvent]);

  const goBack = useCallback(() => {
    setStep((s) => {
      if (s === 2 || s === 3) return 1;
      if (s === 4) return 3;
      if (s === 5) return 4;
      return s;
    });
  }, []);

  function onContinueFromInput() {
    void logEvent("simulation_started", { input, demo: isDemoMode });
    setStep(2);
  }

  useEffect(() => {
    if (step !== 3) return;
    void logEvent("simulation_completed", { input, output, demo: isDemoMode });
  }, [step, input, output, isDemoMode, logEvent]);

  function readinessComplete(): boolean {
    return !!(readiness.priceComfort && readiness.startTimeline && readiness.exploreIntent);
  }

  async function onSaveLead() {
    if (!name || !email || !consent) {
      setSaveMsg("Please complete name, email, and consent.");
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
      if (!res.ok) throw new Error("Lead submission failed");
      await logEvent("simulation_lead_captured", { tenantSlug, email, demo: isDemoMode });
      setStep(6);
    } catch {
      setSaveMsg("Could not save right now. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const trustChips = ["Educational estimate", "Provider review required", "No obligation"];

  const bookHref =
    nextStep === "book"
      ? effectiveBookingUrl || "/contact"
      : nextStep === "callback"
        ? "/support"
        : "/result?demo=1";

  const choiceClass = (on: boolean) =>
    on
      ? `${glpIntakeUi.choiceBase} border-transparent text-white shadow-sm`
      : `${glpIntakeUi.choiceBase} ${glpIntakeUi.choiceIdle}`;

  return (
    <div
      className={`glp-intake-funnel ${glpIntakeUi.column} pb-6`}
      style={{ "--glp-brand-fill": brandFill } as CSSProperties}
    >
      {!isDemoMode ? (
        <div className="mb-6 flex justify-center px-1">
          <span className="inline-flex max-w-lg items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-center text-xs font-semibold leading-snug text-slate-700 shadow-sm ring-1 ring-slate-900/[0.04]">
            <span className="hidden h-2 w-2 shrink-0 rounded-full bg-emerald-500 sm:block" aria-hidden />
            Patient intake · {company}
          </span>
        </div>
      ) : null}

      <IntakeStepper step={step} brandFill={brandFill} />

      <p className={`${glpIntakeUi.column} ${glpIntakeUi.bodyMuted} mb-8 text-center`}>
        Educational overview first, then consult readiness, then contact — not medical advice.
      </p>

      {step === 1 && (
        <section
          data-flow-step="1"
          className={`${glpIntakeUi.card} ${glpIntakeUi.cardPad} ${glpIntakeUi.stackStepForm} border-l-[3px]`}
          style={{ borderLeftColor: brandFill }}
        >
          {isDemoMode && (
            <div
              className="flex flex-col gap-5 rounded-xl border bg-slate-50/90 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
              style={{ borderColor: `${brandFill}2a` }}
            >
              <p className={`${glpIntakeUi.body} sm:max-w-md`}>
                Skip ahead to the results screen with the sample values below, or edit fields first.
              </p>
              <button
                type="button"
                onClick={() => void skipDemoToResults()}
                className={`${glpIntakeUi.primaryBtn} w-full shrink-0 sm:w-auto sm:min-w-[11rem]`}
                style={{ backgroundColor: brandFill }}
              >
                {demoQuick ? "Preview results now" : "Skip to sample results"}
              </button>
            </div>
          )}
          <header className={glpIntakeUi.stackSm}>
            <p className={glpIntakeUi.kicker}>Step 1</p>
            <h2 className={glpIntakeUi.titleLg}>Your GLP path</h2>
            <p className={glpIntakeUi.body}>
              A few non-clinical details — no contact required yet. A licensed provider must review eligibility and
              treatment decisions.
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
            <label className="block min-w-0">
              <span className={glpIntakeUi.label}>Height (inches)</span>
              <input
                type="number"
                className={glpIntakeUi.control}
                value={input.heightIn}
                onChange={(e) => setInput((v) => ({ ...v, heightIn: Number(e.target.value || 0) }))}
              />
            </label>
            <label className="block min-w-0">
              <span className={glpIntakeUi.label}>Preferred path (optional)</span>
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
              <span className={glpIntakeUi.label}>Goal timeframe</span>
              <select
                className={glpIntakeUi.control}
                value={input.urgency}
                onChange={(e) => setInput((v) => ({ ...v, urgency: e.target.value as SimInput["urgency"] }))}
              >
                <option value="asap">As soon as possible</option>
                <option value="three_months">Within 3 months</option>
                <option value="six_months">Within 6 months</option>
                <option value="exploring">Just exploring</option>
              </select>
            </label>
            <label className="block min-w-0">
              <span className={glpIntakeUi.label}>Budget comfort (optional)</span>
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
              <span className={glpIntakeUi.label}>Prior GLP-1 experience (optional)</span>
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
            <label className="block min-w-0 md:col-span-2">
              <span className={glpIntakeUi.label}>Biggest struggle (optional)</span>
              <select
                className={glpIntakeUi.control}
                value={input.biggestStruggle}
                onChange={(e) =>
                  setInput((v) => ({ ...v, biggestStruggle: e.target.value as SimInput["biggestStruggle"] }))
                }
              >
                <option value="food_noise">Food noise</option>
                <option value="cravings">Cravings</option>
                <option value="hunger_control">Hunger control</option>
                <option value="consistency">Consistency / routine</option>
                <option value="unsure">Not sure</option>
              </select>
            </label>
          </div>

          <div className="mt-8 w-full border-t border-slate-100 pt-8">
            <button
              type="button"
              onClick={onContinueFromInput}
              className={`${glpIntakeUi.primaryBtn} w-full`}
              style={{ backgroundColor: brandFill }}
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section data-flow-step="2" className={`${glpIntakeUi.card} ${glpIntakeUi.cardPad} text-center ${glpIntakeUi.stackMd}`}>
          <div
            className="mx-auto h-14 w-14 rounded-full border-2 border-slate-200 animate-spin"
            style={{ borderTopColor: brandFill }}
            aria-hidden
          />
          <div className={glpIntakeUi.stackSm}>
            <p className={glpIntakeUi.kicker}>Step 2</p>
            <h2 className={glpIntakeUi.titleMd}>Building your plan…</h2>
            <p className={glpIntakeUi.body}>Personalizing your educational overview for {company}.</p>
          </div>
          <div className="mt-8 flex justify-center sm:justify-start">
            <button type="button" className={glpIntakeUi.backBtn} onClick={goBack}>
              Previous
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section data-flow-step="3" className={`${glpIntakeUi.card} ${glpIntakeUi.cardPad} ${glpIntakeUi.stackSection}`}>
          <header
            className={`relative overflow-hidden rounded-3xl border p-6 md:p-9 ${glpIntakeUi.stackSm}`}
            style={{
              borderColor: `${brandFill}2e`,
              background: `linear-gradient(165deg, white 0%, rgba(248,250,252,0.97) 45%, rgba(241,245,249,0.5) 100%)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.9), 0 18px 40px -12px rgba(15,23,42,0.1), 0 0 0 1px rgba(15,23,42,0.04)`,
            }}
          >
            <div
              className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full opacity-[0.12] blur-3xl"
              style={{ backgroundColor: brandFill }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-12 -right-10 h-40 w-40 rounded-full opacity-[0.08] blur-3xl"
              style={{ backgroundColor: effectiveSecondary || brandFill }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-0 top-0 h-full w-1 rounded-l-3xl"
              style={{
                background: `linear-gradient(180deg, ${brandFill} 0%, ${effectiveSecondary || brandFill} 100%)`,
                opacity: 0.85,
              }}
              aria-hidden
            />
            <div className="relative pl-1 sm:pl-2">
              {effectiveLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={effectiveLogo}
                  alt=""
                  className="h-12 w-auto max-w-[220px] object-contain drop-shadow-sm md:h-14"
                  loading="lazy"
                />
              ) : null}
              <div className="flex flex-wrap gap-2">
                {trustChips.map((c) => (
                  <span
                    key={c}
                    className={`${glpIntakeUi.chip} border border-slate-200/80 bg-white/90 shadow-sm`}
                  >
                    {c}
                  </span>
                ))}
              </div>
              <p className={glpIntakeUi.kicker}>{company}</p>
              <h2 className={glpIntakeUi.titleResults}>Your GLP path</h2>
              <div className={`${glpIntakeUi.stackSm} pt-1`}>
                <p className="text-sm leading-relaxed text-slate-700">
                  Estimated timeline toward your goal:{" "}
                  <span className="font-semibold tabular-nums text-slate-900">{output.weeksToGoal} weeks</span> (
                  {Math.ceil(output.weeksToGoal / 4)} months). Individual results vary.
                </p>
                <p className="text-sm leading-relaxed text-slate-700">
                  Likely discussion path:{" "}
                  <span className="font-semibold text-slate-900">{output.pathLabel}</span>
                </p>
                <p className={glpIntakeUi.bodyMuted}>
                  Confidence profile: {output.confidenceBand}. Response, side effects, and dose changes vary by person.
                </p>
              </div>
            </div>
          </header>

          <div className={glpIntakeUi.sectionRule}>
            <p className={`${glpIntakeUi.kicker} mb-3`}>Journey</p>
            <h3 className={`${glpIntakeUi.titleMd} mb-5`}>What the path often looks like</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {output.phasePlan.map((p, idx) => (
                <div
                  key={p.phase}
                  className={`flex flex-col rounded-2xl border bg-white/90 p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] ${
                    idx === 1 ? "ring-1 ring-slate-900/[0.06] md:scale-[1.02]" : ""
                  }`}
                  style={{
                    borderColor: idx === 0 ? `${brandFill}40` : "rgba(226,232,240,0.95)",
                    boxShadow:
                      idx === 0
                        ? `0 2px 8px rgba(15,23,42,0.04), inset 0 1px 0 rgba(255,255,255,0.8)`
                        : undefined,
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{p.weeks}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{p.phase}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.focus}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={glpIntakeUi.sectionRule}>
            <p className={`${glpIntakeUi.kicker} mb-3`}>Expectations</p>
            <h3 className={`${glpIntakeUi.titleMd} mb-5`}>What to expect</h3>
            <ul className={`${glpIntakeUi.stackMd} text-sm leading-relaxed text-slate-700`}>
              <li className="flex gap-3 border-l-2 border-slate-200 pl-4">
                <span className="font-semibold text-slate-900">Early</span>
                <span>Appetite and food noise often shift first; your provider sets the pace.</span>
              </li>
              <li className="flex gap-3 border-l-2 border-slate-200 pl-4">
                <span className="font-semibold text-slate-900">Middle</span>
                <span>Steadier monthly trends; dose and plan adjustments are common.</span>
              </li>
              <li className="flex gap-3 border-l-2 border-slate-200 pl-4">
                <span className="font-semibold text-slate-900">Ongoing</span>
                <span>Maintenance and habits matter — support is part of long-term success.</span>
              </li>
            </ul>
          </div>

          <div className={glpIntakeUi.sectionRule}>
            <p className={`${glpIntakeUi.kicker} mb-3`}>Investment</p>
            <h3 className={`${glpIntakeUi.titleMd} mb-5`}>Price clarity (typical range)</h3>
            <div
              className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-white via-slate-50/80 to-slate-100/40 p-6 shadow-inner"
              style={{
                borderColor: `${brandFill}30`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.75), 0 8px 24px -8px rgba(15,23,42,0.08)`,
              }}
            >
              <div
                className="pointer-events-none absolute -right-8 top-0 h-24 w-24 rounded-full opacity-[0.07] blur-2xl"
                style={{ backgroundColor: brandFill }}
                aria-hidden
              />
              <div className="relative z-[1]">
              {typeof publicCfg?.pricingMonthlyLow === "number" && publicCfg.pricingMonthlyLow > 0 ? (
                <p className="text-sm font-medium text-slate-800">
                  Programs often start around{" "}
                  <span className="tabular-nums text-slate-900">${publicCfg.pricingMonthlyLow}</span>
                  /mo before add-ons — final quote from your provider.
                </p>
              ) : null}
              <p className={`text-sm text-slate-700 ${publicCfg?.pricingMonthlyLow ? "mt-3" : ""}`}>
                Typical monthly range (educational):{" "}
                <span className="text-lg font-semibold tabular-nums text-slate-900">
                  ${output.monthlyCostLow}–${output.monthlyCostHigh}
                </span>
              </p>
              <p className="mt-3 text-sm text-slate-700">
                Estimated cost per lb lost (educational):{" "}
                <span className="font-semibold tabular-nums">
                  ${output.costPerLbLow}–${output.costPerLbHigh}
                </span>
              </p>
              <p className={`${glpIntakeUi.bodyMuted} mt-4`}>
                Actual pricing may vary based on provider evaluation and program selection. Insurance, cash pay, and
                medication path change totals.
              </p>
              {publicCfg?.consultFeeNote ? (
                <p className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Consult / program entry: </span>
                  {publicCfg.consultFeeNote}
                </p>
              ) : null}
              {publicCfg?.paymentNote ? <p className={`${glpIntakeUi.body} mt-3`}>{publicCfg.paymentNote}</p> : null}
              </div>
            </div>
          </div>

          <div className={glpIntakeUi.sectionRule}>
            <p className={`${glpIntakeUi.kicker} mb-3`}>Trajectory</p>
            <h3 className={`${glpIntakeUi.titleMd} mb-2`}>Progress snapshot</h3>
            <p className={`${glpIntakeUi.bodyMuted} mb-6`}>
              Illustrative weight trend only — not a medical forecast. Your provider sets targets and pace.
            </p>
            <div
              className="relative overflow-hidden rounded-2xl border border-slate-200/90 border-t-[3px] bg-gradient-to-b from-white via-slate-50/50 to-slate-50/90 p-5 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.04] md:p-6"
              style={{ borderTopColor: brandFill }}
            >
              <div
                className="pointer-events-none absolute left-1/2 top-0 h-32 w-[120%] -translate-x-1/2 opacity-[0.06] blur-3xl"
                style={{ background: `linear-gradient(90deg, transparent, ${brandFill}, transparent)` }}
                aria-hidden
              />
              <ol className="relative space-y-0">
                {output.projectedMonthlyRange.slice(0, 6).map((m, i, arr) => {
                  const pct = Math.max(12, Math.min(100, 100 - (m.mid / input.currentWeight) * 100));
                  return (
                    <li key={m.month} className="flex gap-4">
                      <div className="flex w-9 flex-col items-center pt-1">
                        <span
                          className="h-3.5 w-3.5 shrink-0 rounded-full shadow-[0_0_0_4px_rgba(255,255,255,0.95),0_2px_8px_rgba(15,23,42,0.12)]"
                          style={{ backgroundColor: brandFill }}
                          aria-hidden
                        />
                        {i < arr.length - 1 ? (
                          <span className="my-1 w-px min-h-[1.25rem] flex-1 bg-slate-200" aria-hidden />
                        ) : null}
                      </div>
                      <div className={`min-w-0 flex-1 ${i < arr.length - 1 ? "pb-6" : ""}`}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Month {m.month}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900 tabular-nums">~{m.mid} lbs</p>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: brandFill }}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {isDemoMode ? (
            <div className="border-t border-slate-100 pt-8 mt-8">
              <GlpDemoOwnerPanels
                companyName={company}
                monthlySessions={demoTraffic}
                brandPrimary={brandFill}
                brandSecondary={effectiveSecondary}
              />
            </div>
          ) : null}

          <details className="rounded-xl border border-slate-200 bg-slate-50/80 px-5 py-4 shadow-sm transition-shadow open:shadow-md">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 [&::-webkit-details-marker]:hidden">
              Quick questions
            </summary>
            <dl className={`${glpIntakeUi.stackMd} mt-5 text-sm`}>
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

          <p className={`${glpIntakeUi.bodyMuted} pt-2`}>
            General information only, not medical advice. Final treatment decisions are made by a licensed provider.
          </p>

          <div className={glpIntakeUi.formNavRowRule}>
            <button type="button" className={glpIntakeUi.backBtn} onClick={goBack}>
              Previous
            </button>
            <div className={glpIntakeUi.formActions}>
              <button
                type="button"
                onClick={() => setStep(4)}
                className={glpIntakeUi.primaryBtn}
                style={{ backgroundColor: brandFill }}
              >
                Review my next step
              </button>
              <p className="text-center text-xs text-slate-500 sm:text-right">
                Short consult-readiness questions next — not a medical assessment.
              </p>
            </div>
          </div>
        </section>
      )}

      {step === 4 && (
        <section data-flow-step="4" className={`${glpIntakeUi.card} ${glpIntakeUi.cardPad} ${glpIntakeUi.stackSection}`}>
          <header className={glpIntakeUi.stackSm}>
            <p className={glpIntakeUi.kicker}>Step 4</p>
            <h2 className={glpIntakeUi.titleLg}>Consult readiness</h2>
            <p className={glpIntakeUi.body}>
              Quick preferences help prioritize follow-up. This is not a medical assessment.
            </p>
          </header>

          <div className="space-y-10">
            <fieldset className="space-y-4 border-0 p-0 m-0 min-w-0">
              <legend className={`${glpIntakeUi.label} !mb-0`}>Comfort with this general price range?</legend>
              <div className={glpIntakeUi.choiceRow}>
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
                    className={choiceClass(readiness.priceComfort === val)}
                    style={readiness.priceComfort === val ? { backgroundColor: brandFill } : undefined}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="space-y-4 border-0 p-0 m-0 min-w-0">
              <legend className={`${glpIntakeUi.label} !mb-0`}>When are you hoping to start?</legend>
              <div className={glpIntakeUi.choiceRow}>
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
                    className={choiceClass(readiness.startTimeline === val)}
                    style={readiness.startTimeline === val ? { backgroundColor: brandFill } : undefined}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="space-y-4 border-0 p-0 m-0 min-w-0">
              <legend className={`${glpIntakeUi.label} !mb-0`}>Explore next steps now?</legend>
              <div className={glpIntakeUi.choiceRow}>
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
                    className={choiceClass(readiness.exploreIntent === val)}
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
                onClick={() => setStep(5)}
                className={glpIntakeUi.primaryBtn}
                style={{ backgroundColor: brandFill }}
              >
                Continue to save / book
              </button>
            </div>
          </div>
        </section>
      )}

      {step === 5 && (
        <section data-flow-step="5" className={`${glpIntakeUi.card} ${glpIntakeUi.cardPad} ${glpIntakeUi.stackSection}`}>
          <header className={glpIntakeUi.stackSm}>
            <p className={glpIntakeUi.kicker}>Step 5</p>
            <h3 className={glpIntakeUi.titleLg}>Save your plan & next step</h3>
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

          <fieldset className="space-y-4 border-0 p-0 m-0 min-w-0">
            <legend className={`${glpIntakeUi.label} !mb-0`}>Preferred next step</legend>
            <div className="grid gap-4 sm:grid-cols-3">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  nextStep === "book" ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="nextStep"
                  className="h-4 w-4"
                  style={{ accentColor: brandFill }}
                  checked={nextStep === "book"}
                  onChange={() => setNextStep("book")}
                />
                Book consult
              </label>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  nextStep === "callback"
                    ? "border-slate-900 bg-slate-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="nextStep"
                  className="h-4 w-4"
                  style={{ accentColor: brandFill }}
                  checked={nextStep === "callback"}
                  onChange={() => setNextStep("callback")}
                />
                Callback
              </label>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  nextStep === "save_only"
                    ? "border-slate-900 bg-slate-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="nextStep"
                  className="h-4 w-4"
                  style={{ accentColor: brandFill }}
                  checked={nextStep === "save_only"}
                  onChange={() => setNextStep("save_only")}
                />
                Save for later
              </label>
            </div>
          </fieldset>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-5 text-sm leading-relaxed text-slate-600">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300"
              style={{ accentColor: brandFill }}
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>
              I agree to be contacted about my request and understand this is educational information, not medical
              advice.
            </span>
          </label>

          <div className={glpIntakeUi.formNavRowRule}>
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
                {saving ? "Saving…" : "Save my plan"}
              </button>
              <a
                href={bookHref}
                target={effectiveBookingUrl && nextStep === "book" ? "_blank" : undefined}
                rel={effectiveBookingUrl && nextStep === "book" ? "noopener noreferrer" : undefined}
                className={glpIntakeUi.secondaryBtn}
              >
                {nextStep === "book"
                  ? effectiveBookingUrl
                    ? "Open scheduling"
                    : "Book consult"
                  : nextStep === "callback"
                    ? "Request callback"
                    : "Preview saved plan"}
              </a>
            </div>
          </div>
          {saveMsg ? <p className="text-sm font-medium text-red-600">{saveMsg}</p> : null}
        </section>
      )}

      {step === 6 && (
        <section
          data-flow-step="6"
          className={`${glpIntakeUi.card} ${glpIntakeUi.cardPad} text-center ${glpIntakeUi.stackMd} border-slate-200/90 bg-gradient-to-b from-slate-50/90 to-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]`}
          style={{ borderColor: `${brandFill}33` }}
        >
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white shadow-md"
            style={{ backgroundColor: brandFill }}
            aria-hidden
          >
            ✓
          </div>
          <div className={glpIntakeUi.stackSm}>
            <p className={glpIntakeUi.kicker}>Step 6</p>
            <h2 className={glpIntakeUi.titleLg}>You&apos;re all set</h2>
            <p className={`${glpIntakeUi.body} mx-auto max-w-md text-slate-700`}>
              {company} can review your plan and follow up based on the option you selected.
            </p>
          </div>
          {effectiveBookingUrl && nextStep === "book" ? (
            <a
              href={effectiveBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${glpIntakeUi.primaryBtn} mx-auto block w-full max-w-sm text-center`}
              style={{ backgroundColor: brandFill }}
            >
              Schedule your consultation
            </a>
          ) : null}
          <p className={`${glpIntakeUi.bodyMuted} mx-auto max-w-md`}>
            General information only, not medical advice. A licensed provider will confirm next steps.
          </p>
          <a
            href="/"
            className="inline-flex text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-900"
          >
            Back to home
          </a>
        </section>
      )}
    </div>
  );
}
