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
          className={`flex h-full min-h-0 flex-col space-y-4 ${glpIntakeUi.intakeHeroShell} p-5 sm:space-y-5 sm:p-6`}
          data-testid="intake-demo-testimonial-card"
        >
          <blockquote className="flex min-h-0 flex-1 flex-col justify-start border-l-2 border-slate-300/90 pl-4 text-left">
            <p className="text-[15px] leading-relaxed text-slate-800 sm:text-[16px] sm:leading-[1.65]">
              &ldquo;{q.quote}&rdquo;
            </p>
          </blockquote>

          <figcaption className="w-full shrink-0">
            {/*
              Equal vertical rhythm below the avatar and above the role line so the name sits
              exactly centered between them regardless of how the role/org text wraps.
              ─ avatar ─ (mt-3.5) ─ name ─ (mt-3.5) ─ role/org ─
            */}
            <div className="flex w-full shrink-0 flex-col items-center border-t border-slate-300/80 pt-4 text-center sm:pt-5">
              <div
                className="flex shrink-0 justify-center"
                style={{ ["--brand-primary" as string]: accent } as CSSProperties}
              >
                <AvatarInitials name={q.name} size={40} variant="duo" />
              </div>
              <p className="mt-3.5 w-full text-sm font-semibold leading-tight text-slate-900 sm:mt-4">
                {q.name}
              </p>
              <p className="mt-3.5 w-full text-[13px] leading-snug text-slate-600 sm:mt-4">
                {q.role} · {q.orgLine}
              </p>
            </div>
          </figcaption>
        </article>
      ))}
    </section>
  );
}
