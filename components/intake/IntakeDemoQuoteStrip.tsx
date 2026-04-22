"use client";

import { useMemo, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import AvatarInitials from "@/components/AvatarInitials";
import { parseGlpIntakeQueryBranding } from "@/lib/glp-intake-query-branding";
import { glpIntakeUi } from "@/lib/glp-intake-ui";
import { INTAKE_DEMO_HERO_QUOTES } from "@/lib/intake-demo-quotes";

const DEFAULT_ACCENT = "#0f172a";

/** Pain → story → outcome layout; same shell as clinic hero + trust row. */
export default function IntakeDemoQuoteStrip() {
  const sp = useSearchParams();
  const accent = useMemo(() => parseGlpIntakeQueryBranding(sp).primaryHex || DEFAULT_ACCENT, [sp]);

  return (
    <section
      aria-label="Operator perspectives (illustrative)"
      className="mx-auto w-full max-w-2xl grid gap-5 sm:grid-cols-2 sm:gap-6"
      data-intake-demo-quote-strip
    >
      {INTAKE_DEMO_HERO_QUOTES.map((q) => (
        <article
          key={q.painLabel}
          className={`flex h-full flex-col overflow-hidden text-left ${glpIntakeUi.intakeHeroShell} p-6 sm:p-7`}
          data-testid="intake-demo-testimonial-card"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {q.painLabel}
          </p>
          <blockquote className="mt-4 flex min-h-0 flex-1 flex-col border-l-2 border-slate-200 pl-4">
            <p className="text-[15px] leading-[1.65] text-slate-800 sm:text-[16px]">
              <span className="font-serif text-slate-400" aria-hidden>
                &ldquo;
              </span>
              {q.quote}
              <span className="font-serif text-slate-400" aria-hidden>
                &rdquo;
              </span>
            </p>
          </blockquote>
          <p className="mt-5 rounded-lg bg-slate-50/90 px-3 py-2.5 text-[13px] font-medium leading-snug text-slate-700 ring-1 ring-slate-900/[0.04]">
            {q.outcome}
          </p>

          <figcaption className="mt-5 flex items-start gap-3 border-t border-slate-100 pt-5">
            <div
              className="shrink-0"
              style={{ ["--brand-primary" as string]: accent } as CSSProperties}
            >
              <AvatarInitials name={q.name} size={40} variant="duo" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">{q.name}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                <span className="font-medium text-slate-700">{q.role}</span>
                <span className="mx-1.5 text-slate-300" aria-hidden>
                  ·
                </span>
                {q.orgLine}
              </p>
            </div>
          </figcaption>
        </article>
      ))}
    </section>
  );
}
