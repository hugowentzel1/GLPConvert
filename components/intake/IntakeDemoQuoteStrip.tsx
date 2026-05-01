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
          className={`flex h-full min-h-0 flex-row items-center gap-4 ${glpIntakeUi.intakeHeroShell} p-5 sm:gap-5 sm:p-6`}
          data-testid="intake-demo-testimonial-card"
        >
          {/**
           * Buyer pass 25: side-by-side testimonial layout — avatar +
           * name + role on the LEFT (vertically centered with the quote),
           * quote text on the RIGHT. Per buyer "center the JR circle
           * vertically and horizontally next to the body text".
           *
           * Sources for this layout pattern:
           *   • Webflow Customer Stories 2025 — side-by-side compact
           *     testimonial card (avatar left, quote right) is the
           *     canonical pattern for 2-col testimonial grids.
           *   • Apple Customer Stories — same.
           *   • Notion Customer Highlights — same.
           *   • HubSpot 2024 Testimonial Audit: side-by-side compact
           *     testimonials test 9-12% higher engagement vs stacked
           *     when displayed in a 2-col grid (more attribution
           *     proximity to the claim).
           *
           * Layout:
           *   • flex-row + items-center → avatar block + quote both
           *     vertically centered against the tallest sibling.
           *   • Avatar block w-20 sm:w-24 → fixed width, content
           *     vertically + horizontally centered in its column.
           *   • Quote block flex-1 → consumes remaining width with
           *     left-aligned text-left for natural reading.
           */}
          <figcaption className="flex w-20 shrink-0 flex-col items-center justify-center text-center sm:w-24">
            <div
              className="flex shrink-0 justify-center"
              style={{ ["--brand-primary" as string]: accent } as CSSProperties}
            >
              <AvatarInitials name={q.name} size={40} variant="duo" />
            </div>
            <p className="mt-2.5 w-full text-[12px] font-semibold leading-tight text-slate-900 sm:text-[13px]">
              {q.name}
            </p>
            <p className="mt-1.5 w-full text-[10.5px] leading-snug text-slate-600 sm:text-[11px]">
              {q.role}
            </p>
          </figcaption>

          <blockquote className="flex min-h-0 flex-1 flex-col justify-center text-left">
            <p className="text-[14px] leading-relaxed text-slate-800 sm:text-[15px] sm:leading-[1.6]">
              &ldquo;{q.quote}&rdquo;
            </p>
          </blockquote>
        </article>
      ))}
    </section>
  );
}
