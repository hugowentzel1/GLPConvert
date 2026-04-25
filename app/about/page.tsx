"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BrandedDemoOrDefaultFooter from "@/components/intake/BrandedDemoOrDefaultFooter";
import {
  buildBrandedDemoReturnHref,
  buildMarketingPathHref,
} from "@/lib/glp-intake-nav-href";
import {
  PARENT_COMPANY_LEGAL_NAME,
  PRODUCT_NAME,
  SUPPORT_EMAIL,
} from "@/lib/product-identity";

function AboutContent() {
  const sp = useSearchParams();
  const homeHref = buildBrandedDemoReturnHref(sp);
  const pricingHref = buildMarketingPathHref(sp, "/pricing");
  const contactHref = buildMarketingPathHref(sp, "/contact");
  const securityHref = buildMarketingPathHref(sp, "/security");
  const privacyHref = buildMarketingPathHref(sp, "/privacy");

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] text-slate-900">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">About</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built for clinics that already run GLP-1 programs
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            {PRODUCT_NAME} is a product of{" "}
            <strong className="font-semibold text-slate-800">{PARENT_COMPANY_LEGAL_NAME}</strong>.
            We focus on one job: what happens <em>before</em> the consult — expectations, typical
            ranges, consult readiness, and a clean handoff to <em>your</em> booking flow or CRM.
          </p>
        </header>

        <section className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:mb-4 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-900 prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-xl sm:prose-h2:text-2xl prose-li:my-1.5 prose-a:text-slate-900 prose-a:underline decoration-slate-300 underline-offset-2 hover:prose-a:decoration-slate-500">
          <h2>Why we exist</h2>
          <p>
            Cash-pay GLP-1 demand has outpaced clinic operations. The overwhelming majority of
            paid clicks never become a booked consult — they hit a generic intake form, an
            outdated calendar plug-in, or a phone tree. {PRODUCT_NAME} is a thin, branded layer
            that sits in front of those flows so prospective patients see something built for
            them in their clinic&apos;s colors, set realistic expectations, and arrive at the
            scheduling step ready to book.
          </p>

          <h2>What we are</h2>
          <ul>
            <li>A white-label <strong>pre-consult conversion layer</strong> that renders in your colors and logo.</li>
            <li>A clean <strong>handoff</strong> to your existing booking link, EMR scheduler, or CRM via webhook / Zapier / direct integration.</li>
            <li>An <strong>education + expectation-setting</strong> step using non-prescriptive, FDA-aware copy that licensed providers approve.</li>
          </ul>

          <h2>What we are not</h2>
          <ul>
            <li>Not an EMR.</li>
            <li>Not a telehealth platform.</li>
            <li>Not a prescribing service or clinical decision engine.</li>
            <li>Not a drug-marketing program. We do not promote specific manufacturers&apos; brands.</li>
          </ul>
          <p>
            Licensed clinicians at the operating clinic make all treatment decisions. {PRODUCT_NAME}{" "}
            never recommends a specific medication or dose.
          </p>

          <h2>Who we serve</h2>
          <ul>
            <li>Independent weight-loss clinics running cash-pay GLP-1 / compounded semaglutide / tirzepatide programs.</li>
            <li>Med-spas and concierge clinics that are launching a GLP-1 program and need a credible front end fast.</li>
            <li>Clinic networks that want consistent, brand-controlled intake across multiple locations.</li>
          </ul>

          <h2>How we&apos;re built</h2>
          <p>
            Self-serve from day one. A new clinic activates via Stripe Checkout, configures brand
            color + logo + scheduling URL in the dashboard, and is live on a branded URL within 24
            hours — no calls required. Security, privacy, and HIPAA-readiness are detailed on our{" "}
            <Link href={securityHref}>Security</Link> and <Link href={privacyHref}>Privacy</Link>{" "}
            pages.
          </p>

          <h2>Talk to us</h2>
          <p>
            For pricing and activation, see <Link href={pricingHref}>Pricing</Link>. For everything
            else, <Link href={contactHref}>Contact</Link> or email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
          </p>
        </section>
      </article>
      <BrandedDemoOrDefaultFooter />
    </main>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" aria-label="Loading" />}>
      <AboutContent />
    </Suspense>
  );
}
