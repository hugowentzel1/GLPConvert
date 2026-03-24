"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PRODUCT_NAME, PLATFORM_DISPLAY_NAME, SESSION_KEYS } from "@/lib/product-identity";
import type { ProgramRecommendation } from "@/lib/verticals/types";

function formatPriceSignal(rec: ProgramRecommendation): string | null {
  const ps = rec.priceSignal;
  if (ps.kind === "range") {
    return `$${ps.minUsd}–$${ps.maxUsd}${ps.label ? ` — ${ps.label}` : ""}`;
  }
  if (ps.kind === "fixed") {
    return `$${ps.amountUsd}${ps.label ? ` — ${ps.label}` : ""}`;
  }
  if (ps.kind === "starts_at") {
    return `Starts at $${ps.amountUsd}${ps.label ? ` — ${ps.label}` : ""}`;
  }
  return null;
}

/**
 * GLPConvert result — `?demo=1` sample, or `?from=intake` after intake (sessionStorage).
 */
export default function ResultPage() {
  const sp = useSearchParams();
  const demo = sp?.get("demo") === "1";
  const fromIntake = sp?.get("from") === "intake";
  const [rec, setRec] = useState<ProgramRecommendation | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (fromIntake) {
      try {
        const raw = sessionStorage.getItem(SESSION_KEYS.lastRecommendation);
        if (raw) {
          setRec(JSON.parse(raw) as ProgramRecommendation);
          return;
        }
        setErr("No recommendation in session — start again from intake.");
      } catch {
        setErr("Could not read recommendation.");
      }
      return;
    }
    if (!demo) return;
    fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vertical: "glp",
        answers: [
          { questionId: "goal", value: "lose_weight" },
          { questionId: "timeline", value: "asap" },
        ],
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.recommendation) setRec(data.recommendation);
        else setErr(data.error || "Unknown error");
      })
      .catch(() => setErr("Request failed"));
  }, [demo, fromIntake]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-16">
      <div className="max-w-lg mx-auto space-y-6">
        <p className="text-sm text-slate-500">{PLATFORM_DISPLAY_NAME}</p>
        <h1 className="text-2xl font-bold text-slate-900">Your next step</h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          This page will show the recommended program, price signal, and booking CTA after intake.{" "}
          {!demo && !fromIntake && (
            <>
              Try <Link className="underline" href="/intake">intake</Link>,{" "}
              <code className="bg-slate-100 px-1 rounded">?demo=1</code>, or{" "}
              <code className="bg-slate-100 px-1 rounded">?from=intake</code> after completing questions.
            </>
          )}
        </p>

        {err && <p className="text-red-600 text-sm">{err}</p>}

        {rec && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">{rec.programName}</h2>
            <p className="text-slate-700 text-sm">{rec.rationale}</p>
            {formatPriceSignal(rec) && (
              <p className="text-slate-600 text-sm">
                <span className="font-medium">Price signal: </span>
                {formatPriceSignal(rec)}
              </p>
            )}
            <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
              {rec.complianceNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800"
            >
              Book a consult
            </Link>
          </div>
        )}

        <p className="text-xs text-slate-400 pt-8">
          {PRODUCT_NAME} is marketing, intake, and booking software — not an EMR and not medical advice.
        </p>
      </div>
    </main>
  );
}
