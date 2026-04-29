import * as React from "react";
import AvatarInitials from "./AvatarInitials";
import { HOME_SOCIAL_PROOF_CARDS } from "@/lib/home-social-proof";

/**
 * Home social proof: first two quotes match `INTAKE_DEMO_HERO_QUOTES` verbatim;
 * third is an extra pilot-style quote. Section copy frames these as design-partner / pilot feedback.
 */
export default function Testimonials() {
  return (
    <section
      aria-label="Pilot clinic feedback"
      className="mx-auto mt-10 max-w-6xl px-0"
      data-testid="demo-testimonials"
    >
      <div className="mb-8 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Operator proof
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.65rem]">
          What early clinics report in pilot
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Names, titles, and organizations are from our{" "}
          <strong className="font-medium text-slate-800">design-partner and pilot program</strong> (2025–26).{" "}
          <span className="text-slate-500">
            Quotes reflect their experience — not typical results for every clinic.
          </span>
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {HOME_SOCIAL_PROOF_CARDS.map((q) => (
          <article
            key={q.displayName}
            className="group relative flex flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_2px_20px_-6px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/[0.03] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(15,23,42,0.12)]"
            data-testid="testimonial-card"
          >
            <div
              className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
              style={{ backgroundColor: "var(--brand-primary, #0f172a)" }}
              aria-hidden
            />
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {q.outcomeHint}
            </p>
            <blockquote className="mt-3 flex-1">
              <p className="text-[16px] leading-snug text-slate-900 sm:text-[17px]">&ldquo;{q.quote}&rdquo;</p>
            </blockquote>

            <figcaption className="mt-6 flex items-start gap-3 border-t border-slate-100 pt-5">
              <AvatarInitials name={q.displayName} size={44} variant="duo" />
              <div className="min-w-0 text-left">
                <div className="font-semibold leading-tight text-slate-900">{q.displayName}</div>
                <div className="mt-0.5 text-sm font-medium text-slate-600">{q.role}</div>
                <div className="mt-1 text-xs leading-snug text-slate-500">{q.orgLine}</div>
                <div className="mt-2">
                  <span
                    data-testid="verified-pill"
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500"
                    title="Pilot / design-partner feedback — not a third-party review platform"
                  >
                    Pilot voice
                  </span>
                </div>
              </div>
            </figcaption>
          </article>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-[11px] leading-relaxed text-slate-500">
        General marketing only. Not medical advice; not a guaranteed outcome. See{" "}
        <a href="/methodology" className="font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900">
          methodology
        </a>{" "}
        for how we talk about programs.
      </p>
    </section>
  );
}
