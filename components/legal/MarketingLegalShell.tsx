"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buildBrandedDemoReturnHref, buildMarketingPathHref } from "@/lib/glp-intake-nav-href";
import BrandedDemoOrPaidFooter from "@/components/intake/BrandedDemoOrPaidFooter";

const shellArticle =
  "prose prose-slate max-w-none text-slate-600 prose-p:leading-relaxed prose-p:mb-4 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-900 prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-xl prose-h2:scroll-mt-24 sm:prose-h2:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-lg prose-li:my-1.5 prose-ul:my-3 prose-ol:my-3 prose-a:text-slate-900 prose-a:underline decoration-slate-300 underline-offset-2 hover:prose-a:decoration-slate-500";

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
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]">
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <p className="mb-10 sm:mb-12">
          <Link
            href={homeHref}
            className="inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            <svg className="mr-2 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </p>

        <header className="mb-10 border-b border-slate-200/90 pb-8 sm:mb-12 sm:pb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
          {lastUpdated ? (
            <p className="mt-3 text-sm text-slate-500">Last updated: {lastUpdated}</p>
          ) : null}
        </header>

        {lead ? <div className="mb-8 text-lg text-slate-700 leading-relaxed sm:mb-10">{lead}</div> : null}

        <div className={contentClassName !== undefined ? contentClassName : shellArticle}>{children}</div>

        <nav
          className="mt-16 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-slate-200 pt-10 text-center text-sm text-slate-500 sm:mt-20 sm:pt-12"
          aria-label="Related pages"
        >
          <Link
            href={buildMarketingPathHref(searchParams, "/pricing")}
            className="text-slate-700 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-slate-900"
          >
            Pricing
          </Link>
          <span className="text-slate-300" aria-hidden>
            ·
          </span>
          <Link
            href={buildMarketingPathHref(searchParams, "/legal/terms")}
            className="text-slate-700 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-slate-900"
          >
            Terms
          </Link>
          <span className="text-slate-300" aria-hidden>
            ·
          </span>
          <Link
            href={buildMarketingPathHref(searchParams, "/privacy")}
            className="text-slate-700 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-slate-900"
          >
            Privacy
          </Link>
          <span className="text-slate-300" aria-hidden>
            ·
          </span>
          <Link
            href={buildMarketingPathHref(searchParams, "/contact")}
            className="text-slate-700 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-slate-900"
          >
            Contact
          </Link>
          <span className="text-slate-300" aria-hidden>
            ·
          </span>
          <Link
            href={buildMarketingPathHref(searchParams, "/support")}
            className="text-slate-700 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-slate-900"
          >
            Support
          </Link>
        </nav>
      </main>
      <BrandedDemoOrPaidFooter />
    </div>
  );
}
