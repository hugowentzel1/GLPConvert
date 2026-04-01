"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

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

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
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
    { phase: "Starter phase", weeks: "Weeks 1-4", focus: "tolerability, appetite change baseline, habit setup" },
    { phase: "Active phase", weeks: "Weeks 5-16", focus: "dose progression and measurable monthly trend" },
    { phase: "Continuation phase", weeks: "Month 5+", focus: "sustained progress and maintenance planning" },
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

  const [step, setStep] = useState<1 | 2>(1);
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [nextStep, setNextStep] = useState<"book" | "callback" | "save_only">("book");

  const output = useMemo(() => runSimulation(input), [input]);

  async function logEvent(type: string, metadata: Record<string, unknown>) {
    try {
      await fetch("/api/events/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyHandle: tenantSlug, type, metadata }),
      });
    } catch {
      // ignore
    }
  }

  async function onSimulate() {
    await logEvent("simulation_started", { input });
    await logEvent("simulation_completed", { input, output });
    setStep(2);
  }

  async function onSaveLead() {
    if (!name || !email || !consent) {
      setSaveMsg("Please complete name, email, and consent.");
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      const utmSource = sp?.get("utm_source");
      const utmCampaign = sp?.get("utm_campaign");
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
          leadSource: "glp-simulator",
          utmSource,
          utmCampaign,
          simulationInput: input,
          simulationOutput: output,
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
      await logEvent("simulation_lead_captured", { tenantSlug, email });
      setSaveMsg("Saved. A clinic team member can now review your next step.");
    } catch {
      setSaveMsg("Could not save right now. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 text-center">
        <p className="text-sm text-slate-600">See your estimated timeline in under 60 seconds. No obligation.</p>
      </div>

      {step === 1 && (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-8 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Instant transformation simulation</h2>
          <p className="text-sm text-slate-600">
            Educational estimate only. A licensed provider must review eligibility and treatment decisions.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="space-y-1">
              <span className="text-sm text-slate-700">Current weight (lbs)</span>
              <input type="number" className="w-full border rounded-lg px-3 py-2" value={input.currentWeight} onChange={(e) => setInput((v) => ({ ...v, currentWeight: Number(e.target.value || 0) }))} />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-700">Goal weight (lbs)</span>
              <input type="number" className="w-full border rounded-lg px-3 py-2" value={input.goalWeight} onChange={(e) => setInput((v) => ({ ...v, goalWeight: Number(e.target.value || 0) }))} />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-700">Height (inches)</span>
              <input type="number" className="w-full border rounded-lg px-3 py-2" value={input.heightIn} onChange={(e) => setInput((v) => ({ ...v, heightIn: Number(e.target.value || 0) }))} />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-700">Preferred path (optional)</span>
              <select className="w-full border rounded-lg px-3 py-2" value={input.medPath || "unsure"} onChange={(e) => setInput((v) => ({ ...v, medPath: e.target.value as SimInput["medPath"] }))}>
                <option value="unsure">Not sure yet</option>
                <option value="semaglutide">Semaglutide path</option>
                <option value="tirzepatide">Tirzepatide path</option>
                <option value="oral_path">Oral-first path</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-700">Goal timeframe</span>
              <select className="w-full border rounded-lg px-3 py-2" value={input.urgency} onChange={(e) => setInput((v) => ({ ...v, urgency: e.target.value as SimInput["urgency"] }))}>
                <option value="asap">As soon as possible</option>
                <option value="three_months">Within 3 months</option>
                <option value="six_months">Within 6 months</option>
                <option value="exploring">Just exploring</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-700">Budget comfort band (optional)</span>
              <select className="w-full border rounded-lg px-3 py-2" value={input.budgetBand} onChange={(e) => setInput((v) => ({ ...v, budgetBand: e.target.value as SimInput["budgetBand"] }))}>
                <option value="under_200">Under $200 / month</option>
                <option value="200_400">$200-$400 / month</option>
                <option value="400_700">$400-$700 / month</option>
                <option value="unsure">Not sure yet</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-700">Prior GLP-1 experience (optional)</span>
              <select className="w-full border rounded-lg px-3 py-2" value={input.priorGlp} onChange={(e) => setInput((v) => ({ ...v, priorGlp: e.target.value as SimInput["priorGlp"] }))}>
                <option value="none">None yet</option>
                <option value="stopped">Tried before and stopped</option>
                <option value="active">Currently on a plan</option>
                <option value="prefer_not">Prefer not to say</option>
              </select>
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-sm text-slate-700">Biggest struggle (optional)</span>
              <select className="w-full border rounded-lg px-3 py-2" value={input.biggestStruggle} onChange={(e) => setInput((v) => ({ ...v, biggestStruggle: e.target.value as SimInput["biggestStruggle"] }))}>
                <option value="food_noise">Food noise</option>
                <option value="cravings">Cravings</option>
                <option value="hunger_control">Hunger control</option>
                <option value="consistency">Consistency / routine</option>
                <option value="unsure">Not sure</option>
              </select>
            </label>
          </div>

          <button onClick={onSimulate} className="w-full rounded-lg bg-slate-900 text-white py-3 font-semibold">
            See my personalized timeline
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Your estimated path</h2>
            <p className="text-slate-700">
              Estimated timeline to goal: <span className="font-semibold">{output.weeksToGoal} weeks</span> ({Math.ceil(output.weeksToGoal / 4)} months)
            </p>
            <p className="text-slate-700">
              Likely path category: <span className="font-semibold">{output.pathLabel}</span>
            </p>
            <p className="text-xs text-slate-500">
              Confidence profile: {output.confidenceBand} estimate band. Individual response, side effects, and dose progression vary.
            </p>
            <p className="text-slate-700">
              Estimated loss target: <span className="font-semibold">{output.projectedLoss} lbs</span>
            </p>
            <div className="space-y-2">
              {output.projectedMonthlyRange.slice(0, 6).map((m) => (
                <div key={m.month} className="grid grid-cols-[80px_1fr_90px] items-center gap-3">
                  <span className="text-xs text-slate-500">Month {m.month}</span>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-slate-800" style={{ width: `${Math.max(8, 100 - (m.mid / input.currentWeight) * 100)}%` }} />
                  </div>
                  <span className="text-xs text-slate-700">{m.mid} lbs</span>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
              Educational estimate only. Individual results vary. A licensed provider at {company} must evaluate eligibility and next steps.
            </div>
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

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-8 space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">Treatment economics snapshot</h3>
            <p className="text-sm text-slate-700">
              Typical monthly range: <span className="font-semibold">${output.monthlyCostLow}–${output.monthlyCostHigh}</span>
            </p>
            <p className="text-sm text-slate-700">
              Estimated cost per pound (educational): <span className="font-semibold">${output.costPerLbLow}–${output.costPerLbHigh}</span>
            </p>
            <p className="text-xs text-slate-500">
              Cost assumptions are educational and vary by clinic plan, medication path, insurance coverage, and provider decisions.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-8 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Save your personalized plan</h3>
            <p className="text-sm text-slate-600">Get clinic-reviewed next steps from {company}.</p>
            <div className="grid md:grid-cols-2 gap-3">
              <input placeholder="Name" className="border rounded-lg px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
              <input placeholder="Email" type="email" className="border rounded-lg px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input placeholder="Phone (optional)" className="border rounded-lg px-3 py-2 md:col-span-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-700">Preferred next step</p>
              <div className="grid md:grid-cols-3 gap-2">
                <label className="border rounded-lg p-2 text-xs flex gap-2 items-center">
                  <input type="radio" name="nextStep" checked={nextStep === "book"} onChange={() => setNextStep("book")} />
                  Book consult now
                </label>
                <label className="border rounded-lg p-2 text-xs flex gap-2 items-center">
                  <input type="radio" name="nextStep" checked={nextStep === "callback"} onChange={() => setNextStep("callback")} />
                  Request callback
                </label>
                <label className="border rounded-lg p-2 text-xs flex gap-2 items-center">
                  <input type="radio" name="nextStep" checked={nextStep === "save_only"} onChange={() => setNextStep("save_only")} />
                  Save for later
                </label>
              </div>
            </div>
            <label className="flex items-start gap-2 text-xs text-slate-600">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              I agree to be contacted about my requested plan and understand this is educational information, not medical advice.
            </label>
            <div className="flex gap-3">
              <button onClick={onSaveLead} disabled={saving} className="flex-1 rounded-lg bg-slate-900 text-white py-3 font-semibold disabled:opacity-60">
                {saving ? "Saving..." : "Save My Personalized Plan"}
              </button>
              <a href={nextStep === "book" ? "/contact" : nextStep === "callback" ? "/support" : "/result?demo=1"} className="flex-1 rounded-lg border border-slate-300 text-slate-800 py-3 font-semibold text-center">
                {nextStep === "book" ? "Book Consult" : nextStep === "callback" ? "Request Callback" : "Preview Saved Plan"}
              </a>
            </div>
            {saveMsg && <p className="text-sm text-slate-700">{saveMsg}</p>}
          </div>
        </section>
      )}
    </div>
  );
}

