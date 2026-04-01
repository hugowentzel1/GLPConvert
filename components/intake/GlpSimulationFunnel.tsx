"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import GlpDemoOwnerPanels from "@/components/intake/GlpDemoOwnerPanels";
import { persistUtmFromSearchParams, getMergedUtm } from "@/lib/glp-attribution";

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

function parseDemoBranding(sp: ReturnType<typeof useSearchParams>) {
  let logoUrl: string | null = null;
  const rawLogo = sp?.get("logo");
  if (rawLogo) {
    try {
      const u = decodeURIComponent(rawLogo.trim());
      if (/^https:\/\//i.test(u)) logoUrl = u;
    } catch {
      /* ignore malformed */
    }
  }
  const normHex = (v: string | null | undefined) => {
    if (v == null || v === "") return null;
    let s = v.trim();
    if (!s) return null;
    if (!s.startsWith("#")) s = `#${s}`;
    return /^#[0-9A-Fa-f]{6}$/.test(s) ? s : null;
  };
  const primaryHex =
    normHex(sp?.get("brand")) || normHex(sp?.get("primary")) || null;
  const secondaryHex = normHex(sp?.get("brand2")) || null;
  return { logoUrl, primaryHex, secondaryHex };
}

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

export default function GlpSimulationFunnel() {
  const sp = useSearchParams();
  const company = sp?.get("company") || "your clinic";
  const tenantSlug = (sp?.get("company") || "glpconvert").toLowerCase().replace(/[^a-z0-9]/g, "-");
  const isDemoMode =
    sp?.get("demo") === "1" || sp?.get("preview") === "1" || sp?.get("mode") === "demo";
  const demoTraffic = Math.min(50_000, Math.max(50, Number(sp?.get("demo_traffic") || 400) || 400));
  const { logoUrl, primaryHex, secondaryHex } = useMemo(() => parseDemoBranding(sp), [sp]);
  const brandFill = primaryHex || DEFAULT_BRAND;

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

  const output = useMemo(() => runSimulation(input), [input]);

  const bookingUrlParam = useMemo(() => parseHttpsBookingFromSearch(sp), [sp]);
  const effectiveBookingUrl = bookingUrlParam || resolvedBookingUrl;

  useEffect(() => {
    if (!sp) return;
    persistUtmFromSearchParams(sp);
  }, [sp]);

  useEffect(() => {
    if (bookingUrlParam) {
      setResolvedBookingUrl(bookingUrlParam);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(
          `/api/public/tenant-intake-config?handle=${encodeURIComponent(tenantSlug)}`,
        );
        const j = (await r.json()) as { ok?: boolean; bookingUrl?: string | null };
        if (!cancelled && j.ok && typeof j.bookingUrl === "string" && j.bookingUrl) {
          setResolvedBookingUrl(j.bookingUrl);
        } else if (!cancelled) {
          setResolvedBookingUrl(null);
        }
      } catch {
        if (!cancelled) setResolvedBookingUrl(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tenantSlug, bookingUrlParam]);

  useEffect(() => {
    if (step !== 2) return;
    const t = window.setTimeout(() => setStep(3), 1400);
    return () => window.clearTimeout(t);
  }, [step]);

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

  async function onContinueFromInput() {
    await logEvent("simulation_started", { input, demo: isDemoMode });
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

  return (
    <div className="max-w-3xl mx-auto space-y-1">
      {isDemoMode && (
        <div
          className="mb-6 rounded-2xl border border-white/20 bg-slate-900/95 px-5 py-4 text-center text-sm font-medium text-white shadow-xl backdrop-blur-sm"
          style={{
            borderColor: secondaryHex || primaryHex || "rgb(30 41 59)",
            backgroundColor: primaryHex ? `${primaryHex}ee` : undefined,
          }}
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt=""
              className="mx-auto mb-2 h-10 w-auto max-w-[200px] object-contain"
              loading="lazy"
            />
          ) : null}
          Preview for {company}
        </div>
      )}

      <div className="mb-8 text-center px-1">
        <p className="text-sm text-slate-600 leading-relaxed">
          Educational path and typical ranges first — consult readiness, then your details. Not medical advice.
        </p>
      </div>

      {step === 1 && (
        <section className="rounded-3xl border border-slate-200/80 bg-white/90 shadow-lg shadow-slate-200/50 p-6 md:p-10 space-y-6 ring-1 ring-slate-100">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Your GLP path</h2>
          <p className="text-sm text-slate-600">
            General information only, not medical advice. A licensed provider must review eligibility and treatment
            decisions.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="space-y-1">
              <span className="text-sm text-slate-700">Current weight (lbs)</span>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                value={input.currentWeight}
                onChange={(e) => setInput((v) => ({ ...v, currentWeight: Number(e.target.value || 0) }))}
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-700">Goal weight (lbs)</span>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                value={input.goalWeight}
                onChange={(e) => setInput((v) => ({ ...v, goalWeight: Number(e.target.value || 0) }))}
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-700">Height (inches)</span>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                value={input.heightIn}
                onChange={(e) => setInput((v) => ({ ...v, heightIn: Number(e.target.value || 0) }))}
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-700">Preferred path (optional)</span>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={input.medPath || "unsure"}
                onChange={(e) => setInput((v) => ({ ...v, medPath: e.target.value as SimInput["medPath"] }))}
              >
                <option value="unsure">Not sure yet</option>
                <option value="semaglutide">Semaglutide path</option>
                <option value="tirzepatide">Tirzepatide path</option>
                <option value="oral_path">Oral-first path</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-700">Goal timeframe</span>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={input.urgency}
                onChange={(e) => setInput((v) => ({ ...v, urgency: e.target.value as SimInput["urgency"] }))}
              >
                <option value="asap">As soon as possible</option>
                <option value="three_months">Within 3 months</option>
                <option value="six_months">Within 6 months</option>
                <option value="exploring">Just exploring</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-700">Budget comfort band (optional)</span>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={input.budgetBand}
                onChange={(e) => setInput((v) => ({ ...v, budgetBand: e.target.value as SimInput["budgetBand"] }))}
              >
                <option value="under_200">Under $200 / month</option>
                <option value="200_400">$200–$400 / month</option>
                <option value="400_700">$400–$700 / month</option>
                <option value="unsure">Not sure yet</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-700">Prior GLP-1 experience (optional)</span>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={input.priorGlp}
                onChange={(e) => setInput((v) => ({ ...v, priorGlp: e.target.value as SimInput["priorGlp"] }))}
              >
                <option value="none">None yet</option>
                <option value="stopped">Tried before and stopped</option>
                <option value="active">Currently on a plan</option>
                <option value="prefer_not">Prefer not to say</option>
              </select>
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-sm text-slate-700">Biggest struggle (optional)</span>
              <select
                className="w-full border rounded-lg px-3 py-2"
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

          <button
            type="button"
            onClick={onContinueFromInput}
            className="w-full rounded-lg py-3 font-semibold text-white hover:opacity-95"
            style={{ backgroundColor: brandFill }}
          >
            Continue
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-12 text-center space-y-4">
          <div
            className="mx-auto h-12 w-12 rounded-full border-2 border-slate-200 animate-spin"
            style={{ borderTopColor: brandFill }}
          />
          <h2 className="text-xl font-semibold text-slate-900">Building your plan…</h2>
          <p className="text-sm text-slate-600">Personalizing your educational overview for {company}.</p>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-5">
          <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40 p-6 md:p-10 space-y-6 ring-1 ring-slate-100">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt=""
                className="h-12 w-auto max-w-[220px] object-contain mb-2"
                loading="lazy"
              />
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              {trustChips.map((c) => (
                <span key={c} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {c}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">{company}</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Your GLP Path</h2>
            <p className="text-slate-700">
              Estimated timeline toward your goal: <span className="font-semibold">{output.weeksToGoal} weeks</span> (
              {Math.ceil(output.weeksToGoal / 4)} months). Individual results vary.
            </p>
            <p className="text-slate-700">
              Likely discussion path: <span className="font-semibold">{output.pathLabel}</span>
            </p>
            <p className="text-xs text-slate-500">
              Confidence profile: {output.confidenceBand} band. Response, side effects, and dose changes vary by person.
            </p>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">What the journey often looks like</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {output.phasePlan.map((p) => (
                  <div key={p.phase} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold text-slate-800">{p.phase}</p>
                    <p className="text-xs text-slate-500">{p.weeks}</p>
                    <p className="text-xs text-slate-600 mt-1">{p.focus}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">What to expect</h3>
              <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
                <li>
                  <strong>Early phase:</strong> appetite and food noise often shift first; your provider sets the pace.
                </li>
                <li>
                  <strong>Middle phase:</strong> steadier monthly trends; dose and plan adjustments are common.
                </li>
                <li>
                  <strong>Ongoing:</strong> maintenance and habits matter — support is part of long-term success.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Price clarity (typical range)</h3>
              <p className="text-slate-700">
                Typical monthly range (educational):{" "}
                <span className="font-semibold">
                  ${output.monthlyCostLow}–${output.monthlyCostHigh}
                </span>
              </p>
              <p className="text-sm text-slate-700 mt-1">
                Estimated cost per pound lost (educational):{" "}
                <span className="font-semibold">
                  ${output.costPerLbLow}–${output.costPerLbHigh}
                </span>
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Actual pricing may vary based on provider evaluation and program selection. Insurance, cash pay, and
                medication path change totals.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Progress snapshot</h3>
              <div className="space-y-2">
                {output.projectedMonthlyRange.slice(0, 6).map((m) => (
                  <div key={m.month} className="grid grid-cols-[80px_1fr_90px] items-center gap-3">
                    <span className="text-xs text-slate-500">Month {m.month}</span>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-slate-800"
                        style={{ width: `${Math.max(8, 100 - (m.mid / input.currentWeight) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-700">{m.mid} lbs</span>
                  </div>
                ))}
              </div>
            </div>

            {isDemoMode && <GlpDemoOwnerPanels companyName={company} monthlySessions={demoTraffic} />}

            <details className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
              <summary className="text-sm font-medium text-slate-800 cursor-pointer">Quick questions</summary>
              <dl className="mt-3 space-y-2 text-xs text-slate-600">
                <div>
                  <dt className="font-semibold text-slate-800">Is this medical advice?</dt>
                  <dd>No — it is general information. A licensed provider makes treatment decisions.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-800">Are results guaranteed?</dt>
                  <dd>No. Individual results vary.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-800">Is this final pricing?</dt>
                  <dd>No. Actual pricing may vary based on provider evaluation and program selection.</dd>
                </div>
              </dl>
            </details>

            <p className="text-xs text-slate-500 border-t border-slate-100 pt-3">
              This is general informational content and not medical advice. Final treatment decisions are made by a
              licensed provider. Individual results vary.
            </p>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="w-full rounded-lg py-3 font-semibold text-white hover:opacity-95"
              style={{ backgroundColor: brandFill }}
            >
              Continue to consult readiness
            </button>
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Consult readiness</h2>
          <p className="text-sm text-slate-600">
            A few quick preferences help the clinic prioritize follow-up. This is not a medical assessment.
          </p>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-800 mb-2">Are you comfortable with this general price range?</p>
              <div className="flex flex-wrap gap-2">
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
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      readiness.priceComfort === val
                        ? "border-transparent text-white"
                        : "border-slate-200 bg-white text-slate-800"
                    }`}
                    style={
                      readiness.priceComfort === val ? { backgroundColor: brandFill } : undefined
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 mb-2">When are you hoping to start?</p>
              <div className="flex flex-wrap gap-2">
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
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      readiness.startTimeline === val
                        ? "border-transparent text-white"
                        : "border-slate-200 bg-white text-slate-800"
                    }`}
                    style={
                      readiness.startTimeline === val ? { backgroundColor: brandFill } : undefined
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 mb-2">Want to explore next steps now?</p>
              <div className="flex flex-wrap gap-2">
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
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      readiness.exploreIntent === val
                        ? "border-transparent text-white"
                        : "border-slate-200 bg-white text-slate-800"
                    }`}
                    style={
                      readiness.exploreIntent === val ? { backgroundColor: brandFill } : undefined
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={!readinessComplete()}
            onClick={() => setStep(5)}
            className="w-full rounded-lg py-3 font-semibold text-white hover:opacity-95 disabled:opacity-50"
            style={{ backgroundColor: brandFill }}
          >
            Continue to save / book
          </button>
        </section>
      )}

      {step === 5 && (
        <section className="rounded-3xl border border-slate-200/80 bg-white shadow-lg p-6 md:p-10 space-y-5 ring-1 ring-slate-100">
          <h3 className="text-xl font-semibold text-slate-900">Save your plan & next step</h3>
          <p className="text-sm text-slate-600">
            {company} can follow up based on your choice
            {effectiveBookingUrl && nextStep === "book"
              ? " — after saving, you can open their scheduling link."
              : "."}
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              placeholder="Name"
              className="border rounded-lg px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Email"
              type="email"
              className="border rounded-lg px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Phone (optional)"
              className="border rounded-lg px-3 py-2 md:col-span-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-700">Preferred next step</p>
            <div className="grid md:grid-cols-3 gap-2">
              <label className="border rounded-lg p-2 text-xs flex gap-2 items-center">
                <input type="radio" name="nextStep" checked={nextStep === "book"} onChange={() => setNextStep("book")} />
                Book consult
              </label>
              <label className="border rounded-lg p-2 text-xs flex gap-2 items-center">
                <input
                  type="radio"
                  name="nextStep"
                  checked={nextStep === "callback"}
                  onChange={() => setNextStep("callback")}
                />
                Request callback
              </label>
              <label className="border rounded-lg p-2 text-xs flex gap-2 items-center">
                <input
                  type="radio"
                  name="nextStep"
                  checked={nextStep === "save_only"}
                  onChange={() => setNextStep("save_only")}
                />
                Save for later
              </label>
            </div>
          </div>
          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />I agree to be
            contacted about my request and understand this is educational information, not medical advice.
          </label>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onSaveLead}
              disabled={saving}
              className="w-full rounded-lg py-3 font-semibold text-white hover:opacity-95 disabled:opacity-60"
              style={{ backgroundColor: brandFill }}
            >
              {saving ? "Saving…" : "Save my plan"}
            </button>
            <a
              href={bookHref}
              target={effectiveBookingUrl && nextStep === "book" ? "_blank" : undefined}
              rel={effectiveBookingUrl && nextStep === "book" ? "noopener noreferrer" : undefined}
              className="w-full rounded-xl border-2 border-slate-200 text-slate-800 py-3 font-semibold text-center hover:bg-slate-50 transition-colors"
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
          {saveMsg && <p className="text-sm text-red-600">{saveMsg}</p>}
        </section>
      )}

      {step === 6 && (
        <section className="rounded-3xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/90 to-white p-10 text-center space-y-4 shadow-lg ring-1 ring-emerald-100">
          <h2 className="text-2xl font-bold text-slate-900">You&apos;re all set</h2>
          <p className="text-sm text-slate-700 max-w-md mx-auto">
            {company} can review your plan and follow up based on the option you selected.
          </p>
          {effectiveBookingUrl && nextStep === "book" && (
            <a
              href={effectiveBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95 transition-opacity"
              style={{ backgroundColor: brandFill }}
            >
              Schedule your consultation
            </a>
          )}
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            This is general information, not medical advice. A licensed provider will confirm next steps.
          </p>
          <a href="/" className="inline-block text-sm font-semibold text-slate-700 underline underline-offset-2">
            Back to home
          </a>
        </section>
      )}
    </div>
  );
}
