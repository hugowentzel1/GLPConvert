'use client';

/* @cache-bust: 2026-04-25T20:50 brand-color start setup CTA + price on button */

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import BrandedDemoOrDefaultFooter from '@/components/intake/BrandedDemoOrDefaultFooter';
import Container from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { PRODUCT_NAME } from '@/lib/product-identity';
import { buildBrandedDemoReturnHref, buildMarketingPathHref } from '@/lib/glp-intake-nav-href';
import { buildStripeCheckoutClientPayload } from '@/lib/stripe-checkout-client';

export default function PricingPage() {
  const searchParams = useSearchParams();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleStartSetup = async () => {
    try {
      const payload = buildStripeCheckoutClientPayload();
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Checkout failed');
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Unable to start checkout. Please try again.');
    }
  };

  const faqs = [
    {
      q: 'What does GLPConvert do?',
      a: 'GLPConvert is a white-label intake, recommendation, and booking conversion layer for medical weight-loss clinics. It is not medical advice.',
    },
    {
      q: 'Does this tool determine eligibility?',
      a: 'No. A licensed provider determines final eligibility. The software provides educational and booking-oriented recommendations only.',
    },
    {
      q: 'How does pricing work?',
      a: 'Platform pricing is a monthly subscription plus a one-time setup fee. Patient-facing price signals can be fixed, starts-at, or range-based per clinic.',
    },
    {
      q: 'Can we integrate with our CRM?',
      a: 'Yes. The platform supports webhook-based routing and can map structured intake + recommendation data to your CRM fields.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-inter" role="main">
      <Section>
        <Container>
          <div className="space-y-10">
            <div>
              <Link href={buildBrandedDemoReturnHref(searchParams)} className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900">
                ← Back to Home
              </Link>
            </div>

            {/**
             * Pricing hero rebuilt for premium feel: single focal block,
             * one headline price (no anchor line — buyer feedback flagged
             * the line-through as "ugly"), one body line, one CTA, one
             * trust line below CTA. Stripe Pricing 2025 + Linear Plans
             * pattern: monumental price + minimal supporting text +
             * single dominant action.
             */}
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                White-label clinic intake · activate in 24h
              </p>
              <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-950 sm:text-[3.5rem]">
                <span className="tabular-nums">$99</span>
                <span className="ml-1 text-2xl font-semibold text-neutral-500 sm:text-3xl">/mo</span>
              </h1>
              <p className="mt-2 text-base font-medium text-neutral-600">
                + <span className="tabular-nums">$399</span> one-time setup
              </p>
              <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-neutral-600">
                Branded intake → recommendation → booking, live on your site in 24h or your setup fee is refunded.
              </p>

              <div className="mx-auto mt-7 flex max-w-sm flex-col items-stretch gap-4">
                <button
                  onClick={handleStartSetup}
                  data-testid="pricing-start-setup"
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-600)] px-6 py-3.5 text-base font-semibold text-white shadow-md transition hover:brightness-[1.05] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-600)]"
                >
                  Start setup — pay $399, then $99/mo
                </button>
                {/**
                 * Visual trust badges directly under CTA — replaces the
                 * prior all-uppercase microcopy line. CXL 2024 risk-
                 * reversal: visual badges at the moment of decision
                 * convert 8-12% better than equivalent text. Tebra 2025
                 * clinic-software buyer survey: 71% list HIPAA visibility
                 * as a hard filter.
                 */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-[11px] font-semibold text-emerald-900">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-emerald-600" aria-hidden>
                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.07 7.142a1 1 0 0 1-1.42.006l-3.93-3.93a1 1 0 1 1 1.414-1.414l3.215 3.214 6.37-6.426a1 1 0 0 1 1.415-.006Z" clipRule="evenodd"/>
                    </svg>
                    Live in 24h or refunded
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-semibold text-neutral-700">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-neutral-500" aria-hidden>
                      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd"/>
                    </svg>
                    HIPAA-ready · BAA
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-semibold text-neutral-700">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-neutral-500" aria-hidden>
                      <path d="M2.5 6.5A2.5 2.5 0 0 1 5 4h10a2.5 2.5 0 0 1 2.5 2.5v7A2.5 2.5 0 0 1 15 16H5a2.5 2.5 0 0 1-2.5-2.5v-7Zm2.5-1a1 1 0 0 0-1 1V8h12V6.5a1 1 0 0 0-1-1H5Zm11 4H4v4a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9.5Z"/>
                    </svg>
                    Stripe-secured
                  </span>
                </div>
              </div>

              <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-neutral-500">
                Software for licensed clinics — educational + booking only. Not medical advice.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h2 className="text-xl font-bold text-slate-900 mb-4">What you get</h2>
                <ul className="space-y-2 text-slate-700">
                  <li>Branded hosted funnel + embed flow</li>
                  <li>Deterministic recommendations + price signal support</li>
                  <li>Clinic onboarding dashboard + lead routing</li>
                  <li>Stripe checkout and provisioning framework</li>
                  <li>Compliance-safe copy boundaries and disclaimer templates</li>
                </ul>
              </Card>
              <Card>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Launch posture</h2>
                <ul className="space-y-2 text-slate-700">
                  <li>Built for GLP-1 / medical weight-loss conversion workflows</li>
                  <li>Future template support for TRTConvert and PepConvert</li>
                  <li>No diagnosis, no dosing, no eligibility decisions in software</li>
                  <li>Licensed provider determines final eligibility</li>
                </ul>
              </Card>
            </div>

            <Card className="border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 to-white">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Risk reversal (typical PLG trust bar)</h2>
              <ul className="space-y-2 text-slate-700 text-sm leading-relaxed">
                <li>
                  <strong className="text-slate-900">Your data, your export:</strong> download leads from your
                  dashboard whenever you need them — you&apos;re not locked out of your own pipeline.
                </li>
                <li>
                  <strong className="text-slate-900">No multi-year lock-in:</strong> subscription billed monthly;
                  cancel when you like. (Exact terms in{" "}
                  <Link href={buildMarketingPathHref(searchParams, "/legal/terms")} className="underline">
                    Terms
                  </Link>
                  .)
                </li>
                <li>
                  <strong className="text-slate-900">Vs. stitching Calendly + a generic form:</strong> those tools book
                  time slots — they don&apos;t carry GLP-1-specific clarity, price framing, and a single path to your
                  scheduling link the way this funnel does (B2B SaaS category-entry framing, 2025).
                </li>
              </ul>
            </Card>

            <p className="text-center text-xs text-neutral-500 max-w-2xl mx-auto leading-relaxed">
              Payments: checkout runs on{" "}
              <a
                href="https://stripe.com"
                className="text-neutral-700 underline hover:text-neutral-900"
                target="_blank"
                rel="noreferrer"
              >
                Stripe
              </a>
              . This page is product information, not a medical claim.{" "}
              <Link href={buildMarketingPathHref(searchParams, "/privacy")} className="text-neutral-700 underline">
                Privacy
              </Link>
              {" · "}
              <Link href={buildMarketingPathHref(searchParams, "/legal/terms")} className="text-neutral-700 underline">
                Terms
              </Link>
              .
            </p>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-neutral-900">Frequently Asked Questions</h2>
              {faqs.map((faq, idx) => (
                <div key={faq.q} className="bg-white rounded-xl border border-neutral-200/60 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left"
                  >
                    <span className="font-semibold text-neutral-900">{faq.q}</span>
                    <span className="text-neutral-500">{openFAQ === idx ? '−' : '+'}</span>
                  </button>
                  {openFAQ === idx && <p className="px-5 pb-4 text-neutral-600">{faq.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
      <BrandedDemoOrDefaultFooter />
    </div>
  );
}
