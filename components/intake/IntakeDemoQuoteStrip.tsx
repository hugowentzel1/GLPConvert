"use client";

import { useMemo, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import AvatarInitials from "@/components/AvatarInitials";
import { parseGlpIntakeQueryBranding } from "@/lib/glp-intake-query-branding";
import { glpIntakeUi } from "@/lib/glp-intake-ui";
import { INTAKE_DEMO_HERO_QUOTES } from "@/lib/intake-demo-quotes";

const DEFAULT_ACCENT = "#0f172a";

/** Centered social proof; same shell as clinic hero + trust row. */
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
          key={q.name}
          className={`flex h-full flex-col items-center text-center ${glpIntakeUi.intakeHeroShell} p-6 sm:p-7`}
          data-testid="intake-demo-testimonial-card"
        >
          <blockquote className="mx-auto w-full max-w-prose">
            <p className="text-[15px] leading-relaxed text-slate-800 sm:text-[16px] sm:leading-[1.65]">
              &ldquo;{q.quote}&rdquo;
            </p>
          </blockquote>

          <figcaption className="mt-6 flex w-full flex-col items-center gap-3 border-t border-slate-100 pt-6">
            <div
              className="flex shrink-0"
              style={{ ["--brand-primary" as string]: accent } as CSSProperties}
            >
              <AvatarInitials name={q.name} size={40} variant="duo" />
            </div>
            <div className="w-full text-center">
              <p className="text-sm font-semibold text-slate-900">{q.name}</p>
              <p className="mt-1 text-[13px] leading-snug text-slate-600">
                {q.role} · {q.orgLine}
              </p>
            </div>
          </figcaption>
        </article>
      ))}
    </section>
  );
}
