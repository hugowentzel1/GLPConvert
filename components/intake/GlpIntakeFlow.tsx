"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { glpIntakeQuestions } from "@/lib/verticals/glp/intake";
import { glpCompliance } from "@/lib/verticals/glp/compliance";
import { SESSION_KEYS, STORAGE_KEYS } from "@/lib/product-identity";
import type { IntakeAnswer } from "@/lib/verticals/types";
import Link from "next/link";

export default function GlpIntakeFlow() {
  const router = useRouter();
  const sp = useSearchParams();
  const preservedParams = useMemo(() => {
    const p = new URLSearchParams(sp?.toString() || "");
    return p;
  }, [sp]);
  const homeHref = useMemo(() => {
    const q = preservedParams.toString();
    return q ? `/?${q}` : "/";
  }, [preservedParams]);
  const demoResultHref = useMemo(() => {
    const p = new URLSearchParams(preservedParams.toString());
    p.set("demo", "1");
    return `/result?${p.toString()}`;
  }, [preservedParams]);
  const questions = useMemo(() => [...glpIntakeQuestions], []);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const q = questions[step];
  const isLast = step === questions.length - 1;

  const setAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((a) => ({ ...a, [questionId]: value }));
  }, []);

  const persistDraft = useCallback(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.intakeDraft,
        JSON.stringify({ answers, step, at: Date.now() }),
      );
    } catch {
      /* ignore */
    }
  }, [answers, step]);

  const goNext = useCallback(() => {
    if (!q.required || answers[q.id]) {
      persistDraft();
      if (isLast) return true;
      setStep((s) => s + 1);
    }
    return false;
  }, [q, answers, isLast, persistDraft]);

  const submit = async () => {
    if (q.required && !answers[q.id]) {
      setError("Please select an option.");
      return;
    }
    const list: IntakeAnswer[] = questions.map((qq) => ({
      questionId: qq.id,
      value: answers[qq.id] || "",
    }));
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vertical: "glp", answers: list }),
      });
      const data = await res.json();
      if (!res.ok || !data.recommendation) {
        setError(data.error || "Could not get recommendation");
        return;
      }
      sessionStorage.setItem(SESSION_KEYS.lastRecommendation, JSON.stringify(data.recommendation));
      localStorage.removeItem(STORAGE_KEYS.intakeDraft);
      const next = new URLSearchParams(preservedParams.toString());
      next.set("from", "intake");
      router.push(`/result?${next.toString()}`);
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!q) return null;

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">
        {glpCompliance.intakeIntro}
      </p>

      <div className="flex gap-1">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-slate-900" : "bg-slate-200"}`}
          />
        ))}
      </div>

      <div className="space-y-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Step {step + 1} of {questions.length}
        </p>
        <h2 className="text-xl font-semibold text-slate-900">{q.prompt}</h2>

        <div className="space-y-2">
          {q.options.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                answers[q.id] === opt.value
                  ? "border-slate-900 bg-slate-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name={q.id}
                value={opt.value}
                checked={answers[q.id] === opt.value}
                onChange={() => setAnswer(q.id, opt.value)}
                className="h-4 w-4"
              />
              <span className="text-slate-800">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium"
          >
            Back
          </button>
        )}
        <button
          type="button"
          disabled={!!q.required && !answers[q.id]}
          onClick={() => (isLast ? submit() : goNext())}
          className="flex-1 px-4 py-3 rounded-lg bg-slate-900 text-white text-sm font-semibold disabled:opacity-40"
        >
          {submitting ? "…" : isLast ? "See suggested next step" : "Continue"}
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Prefer the legacy demo?{" "}
        <Link href={homeHref} className="underline">
          Home
        </Link>{" "}
        or{" "}
        <Link href={demoResultHref} className="underline">
          sample result
        </Link>
        .
      </p>
    </div>
  );
}
