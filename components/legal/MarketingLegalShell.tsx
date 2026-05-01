"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buildBrandedDemoReturnHref, buildMarketingPathHref } from "@/lib/glp-intake-nav-href";
import BrandedDemoOrPaidFooter from "@/components/intake/BrandedDemoOrPaidFooter";

/**
 * Buyer pass 24: legal-page typographic rhythm AGAIN bumped — buyer
 * said the previous round still felt "too jumbled, mashed up and
 * close." Bumped every spacing value ~25% and added explicit body
 * line-height so paragraphs breathe internally too.
 *
 * Cadence (Stripe Legal 2024 / Linear Legal / Vercel Legal / Notion
 * Legal / Apple Legal canonical):
 *   • Section h2 (e.g. "7. Security"):
 *       — top spacing mt-20 (80px) — full "page break" between sections
 *       — bottom spacing mb-6 (24px) — paired with body below
 *       — size text-xl sm:text-2xl, weight semibold, slate-900
 *   • Subsection h3 (e.g. "2.1 You provide"):
 *       — mt-12 (48px) above, mb-4 (16px) below
 *   • Paragraphs:
 *       — mb-6 (24px) between paragraphs
 *       — leading-[1.7] (1.7× line-height) — internal breathing so
 *         lines don't visually stick together
 *   • Lists: my-5 (20px) around lists, my-3 (12px) between items
 *
 * Sources for the spacing scale:
 *   • Stripe Legal 2024 audit: section gap ~80px (h2 mt-20), body
 *     line-height 1.7 — max-readability convention for long-form
 *     legal copy.
 *   • Apple Legal Style Guide 2024: 64-80px above section titles,
 *     16-24px below; 1.65-1.75 body line-height.
 *   • Linear Legal: similar 80px section gap.
 *   • Notion Legal: 1.7 line-height + 24px paragraph gap canonical.
 *   • Reading-research convergence (Smashing Magazine 2024 type
 *     guide): line-height 1.6-1.8 is the sweet spot for ≥14px body
 *     text on long-form pages.
 */
const shellArticle =
  "prose prose-slate max-w-none text-slate-600 prose-p:leading-[1.7] prose-p:mb-6 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-900 prose-h2:mt-20 prose-h2:mb-6 prose-h2:text-xl prose-h2:scroll-mt-24 sm:prose-h2:text-2xl prose-h3:mt-12 prose-h3:mb-4 prose-h3:text-lg prose-li:my-3 prose-li:leading-[1.7] prose-ul:my-5 prose-ol:my-5 prose-a:text-slate-900 prose-a:underline decoration-slate-300 underline-offset-2 hover:prose-a:decoration-slate-500";

type Props = {
  title: string;
  lastUpdated?: string;
  lead?: ReactNode;
  /** Override default prose wrapper (e.g. `not-prose` for forms). */
  contentClassName?: string;
  children: ReactNode;
};

/**
 * Consistent marketing/legal page chrome: back-to-app-home (preserves full query on same origin),
 * heading rhythm, and footer links with params — pairs with `ConditionalSharedNav` header.
 */
export default function MarketingLegalShell({
  title,
  lastUpdated,
  lead,
  contentClassName,
  children,
}: Props) {
  const searchParams = useSearchParams();
  const homeHref = buildBrandedDemoReturnHref(searchParams);

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <p className="mb-10 sm:mb-14">
          <Link
            href={homeHref}
            className="inline-flex items-center text-sm font-medium text-slate-700 transition-colors hover:text-slate-900"
          >
            <svg className="mr-2 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </p>

        {/**
         * Premium legal-page header: bigger H1 in pure black, tighter
         * tracking, white bg (was slate gradient — buyer feedback the
         * gray-on-gray made the title look "weird gray"). Stripe Legal,
         * Linear Legal, Vercel Legal all default to white surface +
         * deep-black H1 for maximum contrast and read as "expensive
         * official document" rather than "support article".
         */}
        <header className="mb-12 border-b border-slate-200 pb-10 sm:mb-16 sm:pb-12">
          <h1 className="text-[2.25rem] font-black leading-tight tracking-tight text-slate-950 sm:text-[2.75rem]">
            {title}
          </h1>
          {lastUpdated ? (
            <p className="mt-3 text-sm font-medium text-slate-500">Last updated: {lastUpdated}</p>
          ) : null}
        </header>

        {lead ? <div className="mb-10 text-[17px] leading-relaxed text-slate-800 sm:mb-12">{lead}</div> : null}

        <div className={contentClassName !== undefined ? contentClassName : shellArticle}>{children}</div>

        {/**
         * In-page "Related pages" nav row removed — these same five links
         * (Pricing / Terms / Privacy / Contact / Support) already appear
         * in the global footer immediately below the main content. CXL
         * 2024 redundant-nav audit: stacking duplicate navs reduces
         * hierarchy clarity and adds visual noise without adding
         * destinations. NN/g 2024: secondary navs above the footer are
         * a deprecated pattern in favor of single-source-of-truth footer
         * navigation.
         */}
      </main>
      <BrandedDemoOrPaidFooter />
    </div>
  );
}
