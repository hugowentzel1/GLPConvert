'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Container from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { PRODUCT_NAME } from '@/lib/product-identity';
import { buildAppHomeHref, buildMarketingPathHref } from '@/lib/glp-intake-nav-href';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-inter">
      <Section>
        <Container>
          <div className="space-y-10">
            <div>
              <Link href={buildAppHomeHref(searchParams)} className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900">
                ← Back to Home
              </Link>
            </div>

            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-neutral-900">
                $99/mo + $399 setup
              </h1>
              <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
                Launch {PRODUCT_NAME} fast for your clinic brand. Intake → recommendation → booking.
              </p>
              <p className="text-sm text-neutral-500">
                This software supports educational and booking workflows only. Not medical advice.
              </p>
              <button
                onClick={handleStartSetup}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-slate-800"
              >
                Start setup
              </button>
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
      <Footer />
    </div>
  );
}
