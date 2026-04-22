"use client";

import { useMemo, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import AvatarInitials from "@/components/AvatarInitials";
import { parseGlpIntakeQueryBranding } from "@/lib/glp-intake-query-branding";
import { glpIntakeUi } from "@/lib/glp-intake-ui";
import { INTAKE_DEMO_HERO_QUOTES } from "@/lib/intake-demo-quotes";

const DEFAULT_ACCENT = "#0f172a";

/** Quote copy with left rule; attribution centered. Same shell as clinic hero + trust row. */
export default function IntakeDemoQuoteStrip() {
  const sp = useSearchParams();
  const accent = useMemo(() => parseGlpIntakeQueryBranding(sp).primaryHex || DEFAULT_ACCENT, [sp]);

  return (
    <section
      aria-label="Operator perspectives (illustrative)"
      className="mx-auto grid w-full max-w-2xl gap-5 sm:grid-cols-2 sm:items-stretch sm:gap-6"
      data-intake-demo-quote-strip
    >
      {INTAKE_DEMO_HERO_QUOTES.map((q) => (
        <article
          key={q.name}
          className={`flex h-full min-h-0 flex-col ${glpIntakeUi.intakeHeroShell} p-5 sm:p-6`}
          data-testid="intake-demo-testimonial-card"
        >
          <blockquote className="flex min-h-0 flex-1 flex-col justify-start border-l-2 border-slate-200 pl-4 text-left">
            <p className="text-[15px] leading-relaxed text-slate-800 sm:text-[16px] sm:leading-[1.65]">
              &ldquo;{q.quote}&rdquo;
            </p>
          </blockquote>

          <figcaption className="mt-5 flex w-full shrink-0 flex-col items-center gap-2.5 border-t border-slate-100 pt-5 text-center">
            <div
              className="flex justify-center"
              style={{ ["--brand-primary" as string]: accent } as CSSProperties}
            >
              <AvatarInitials name={q.name} size={40} variant="duo" />
            </div>
            <p className="w-full text-sm font-semibold leading-tight text-slate-900">{q.name}</p>
            <p className="w-full translate-y-0.5 text-[13px] leading-snug text-slate-600">
              {q.role} · {q.orgLine}
            </p>
          </figcaption>
        </article>
      ))}
    </section>
  );
}
