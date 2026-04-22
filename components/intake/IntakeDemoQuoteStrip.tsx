"use client";

import { useMemo, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import AvatarInitials from "@/components/AvatarInitials";
import { parseGlpIntakeQueryBranding } from "@/lib/glp-intake-query-branding";
import { glpIntakeUi } from "@/lib/glp-intake-ui";
import { INTAKE_DEMO_HERO_QUOTES } from "@/lib/intake-demo-quotes";

const DEFAULT_ACCENT = "#0f172a";

/** Demo social proof — same shell as clinic hero + trust row. */
export default function IntakeDemoQuoteStrip() {
  const sp = useSearchParams();
  const accent = useMemo(() => parseGlpIntakeQueryBranding(sp).primaryHex || DEFAULT_ACCENT, [sp]);

  return (
    <section
      aria-label="Illustrative operator perspectives"
      className="mx-auto w-full max-w-2xl grid gap-5 sm:grid-cols-2 sm:gap-6"
      data-intake-demo-quote-strip
    >
      {INTAKE_DEMO_HERO_QUOTES.map((q) => (
        <article
          key={q.quote.slice(0, 32)}
          className={`flex h-full flex-col overflow-hidden ${glpIntakeUi.intakeHeroShell} p-6`}
          data-testid="intake-demo-testimonial-card"
        >
          <blockquote className="flex min-h-0 flex-1 flex-col">
            <p className="mb-5 text-[17px] leading-relaxed text-slate-900">
              &ldquo;{q.quote}&rdquo;
            </p>
          </blockquote>

          <figcaption className="mt-auto flex flex-col items-center gap-3 text-center">
            <div className="flex w-full items-center justify-center gap-3">
              <div
                className="flex shrink-0"
                style={{ ["--brand-primary" as string]: accent } as CSSProperties}
              >
                <AvatarInitials name={q.name} size={40} variant="duo" />
              </div>
              <div className="font-semibold leading-snug text-slate-900">{q.name}</div>
            </div>
            <p className="w-full text-center text-[15px] leading-relaxed text-slate-600">
              <span className="font-medium text-slate-700">{q.role}</span>
              <span className="mx-2 text-slate-300" aria-hidden="true">
                ·
              </span>
              <span>{q.orgLine}</span>
            </p>
          </figcaption>
        </article>
      ))}
    </section>
  );
}
