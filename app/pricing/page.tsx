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

            <div className="text-center space-y-4">
              <p className="text-sm text-neutral-500">
                <span className="line-through decoration-neutral-400/70">Custom-built clinic intake: $8,000–$15,000 + dev cycles</span>
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-neutral-900">
                $99/mo + $399 setup
              </h1>
              <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
                Launch {PRODUCT_NAME} fast for your clinic brand. Intake → recommendation → booking.
              </p>
              <p className="text-sm text-neutral-500">
                This software supports educational and booking workflows only. Not medical advice.
              </p>
              {/**
               * Primary CTA uses the active brand color (not slate-black) so a
               * branded clinic preview never sees a generic black button on a
               * branded page. Contrast is enforced by the WCAG-AA brand tokens
               * (`--brand-600` darkens lighter brands automatically). Pattern
               * follows Stripe Checkout, Linear, Notion: primary action ALWAYS
               * carries the active brand fill — no neutral fallback in flow.
               */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                  <span>HIPAA-ready posture</span>
                  <span aria-hidden className="text-neutral-300">·</span>
                  <span>BAAs where required</span>
                  <span aria-hidden className="text-neutral-300">·</span>
                  <span>Encrypted in transit</span>
                </p>
                <button
                  onClick={handleStartSetup}
                  data-testid="pricing-start-setup"
                  className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-600)] px-6 py-3 text-white font-semibold shadow-md transition hover:brightness-[1.05] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-600)]"
                >
                  Start setup — $399 today, then $99/mo
                </button>
              </div>
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
