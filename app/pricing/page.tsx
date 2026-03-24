'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useBrandColors } from '@/hooks/useBrandColors';
import { motion } from 'framer-motion';
import PriceWithMicrocopy from '@/components/PriceWithMicrocopy';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Container from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Stack } from '@/components/layout/Stack';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PricingPage() {
  const searchParams = useSearchParams();
  const b = useBrandTakeover();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  useBrandColors();

  const handleStartSetup = async () => {
    try {
      const token = searchParams?.get('token');
      const company = searchParams?.get('company');
      const utm_source = searchParams?.get('utm_source');
      const utm_campaign = searchParams?.get('utm_campaign');
      
      // Capture current page URL for cancel redirect
      const currentUrl = window.location.href;
      
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'starter',
          token,
          company,
          utm_source,
          utm_campaign,
          cancel_url: currentUrl
        })
      });
      
      if (!response.ok) throw new Error('Checkout failed');
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Unable to start checkout. Please try again.');
    }
  };

  const createUrlWithParams = (path: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    return `${path}?${params.toString()}`;
  };

  const faqs = [
    {
      q: 'Accuracy & data sources',
      a: 'NREL PVWatts® v8 for solar modeling, EIA utility rates, and real-time irradiance data. Industry-standard precision.'
    },
    {
      q: 'Security & encryption',
      a: 'End-to-end encryption (TLS 1.3 in transit, AES-256 at rest). SOC 2-aligned controls. Bank-level security.'
    },
    {
      q: 'Cancel & refund policy',
      a: 'Refund applies to the setup fee only if your branded site isn\'t live on your domain within 24 hours of purchase. Cancel anytime. No lock-in.'
    },
    {
      q: 'Support',
      a: 'Email support with <24h response. Priority onboarding for setup and CRM integrations included.'
    }
  ];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-inter"
      data-brand
    >
      <Section>
        <Container>
          <Stack>
            {/* Back Button */}
            <div className="mb-8">
              <Link 
                href={createUrlWithParams('/')}
                className="inline-flex items-center text-neutral-500 hover:text-neutral-900 transition-colors button-press"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
            </div>

            {/* Hero Block */}
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-black text-neutral-900"
              >
                $<span className="text-neutral-900">99</span>/mo + $<span className="text-neutral-900">399</span> setup
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto mt-8"
              >
                <span className="text-gray-500">Go live on your domain in 24 hours.</span>
              </motion.p>
              
              {/* Risk Line */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm text-neutral-500 mt-6"
              >
                Live in 24 hours — or your setup fee is refunded..
              </motion.p>

              {/* Trust Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center justify-center gap-2 mt-4 text-sm text-neutral-500"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-gray-500">Secure Stripe checkout • No hidden fees • Setup-fee refund if not live in 24 hours</span>
              </motion.div>
            </div>

            {/* Social Proof Strip */}
            {/* Social Proof Strip - Optimized testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center py-6 border-y border-neutral-200/60"
            >
              <p className="text-sm italic text-neutral-600">
                &ldquo;We were losing deals to faster competitors, now we respond in 60 seconds and win instead.&rdquo; — Brian Martin, Owner, 25-employee solar firm, CA
              </p>
            </motion.div>

            {/* Core Value Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-10 md:mt-16">
              {/* What You Get */}
              <Card>
                <h2 className="text-2xl font-bold text-[var(--brand-primary)] mb-6">What You Get</h2>
                <div className="space-y-4">
                  {[
                    { text: 'Branded reports & PDFs', highlight: 'Branded' },
                    { text: 'Your domain (CNAME)', highlight: 'domain' },
                    { text: 'CRM integrations (HubSpot, Salesforce)', highlight: 'CRM' },
                    { text: 'Unlimited quotes', highlight: 'Unlimited' },
                    { text: 'SLA & support', highlight: 'SLA' },
                    { text: 'End-to-end encryption', highlight: 'encryption' }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-neutral-700 font-medium">
                        {feature.text.split(feature.highlight).map((part, i) => (
                          <span key={i}>
                            {part}
                            {i < feature.text.split(feature.highlight).length - 1 && (
                              <span className="text-gray-500 font-semibold">{feature.highlight}</span>
                            )}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Why Installers Switch */}
              <Card>
                <h2 className="text-2xl font-bold text-[var(--brand-primary)] mb-6">Why Installers Switch</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700 font-medium">Live in <span className="text-gray-500 font-semibold">&lt;24 hours</span> — no <span className="text-gray-500 font-semibold">coding</span> required</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700 font-medium">Turn website visitors into qualified solar leads with instant, branded quotes</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* ROI Micro-nudge */}
            <div className="text-center mt-6">
              <p className="text-sm text-neutral-600">
                <span className="text-gray-500 font-semibold">One extra booked job</span> per month typically covers the subscription.
              </p>
            </div>

            {/* FAQ Block */}
            <div className="mt-10 md:mt-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center mb-10">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-neutral-200/60 shadow-sm overflow-hidden">
                    <button
                      onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                      className="w-full px-6 py-5 md:px-7 md:py-6 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                    >
                      <span className="font-semibold text-neutral-900 pr-4">{faq.q}</span>
                      <svg
                        className={`w-5 h-5 text-neutral-500 flex-shrink-0 transition-transform duration-200 ${openFAQ === idx ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFAQ === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="px-6 py-5 md:px-7 md:py-6"
                      >
                        <p className="text-neutral-600 leading-relaxed">
                          {faq.a.includes('NREL') ? (
                            <>
                              <span className="text-[var(--brand-primary)] font-semibold">NREL PVWatts® v8</span> for solar modeling, EIA utility rates, and real-time irradiance data. Industry-standard precision.
                            </>
                          ) : faq.a.includes('TLS 1.3') ? (
                            <>
                              End-to-end encryption (<span className="text-[var(--brand-primary)] font-semibold">TLS 1.3</span> in transit, <span className="text-[var(--brand-primary)] font-semibold">AES-256</span> at rest). <span className="text-[var(--brand-primary)] font-semibold">SOC 2</span>-aligned controls. Bank-level security.
                            </>
                          ) : faq.a.includes('14-day') ? (
                            <>
                              <span className="text-[var(--brand-primary)] font-semibold">Live on your domain in 24 hours. Cancel anytime.</span> No lock-in.
                            </>
                          ) : faq.a.includes('<24h') ? (
                            <>
                              Email support with <span className="text-[var(--brand-primary)] font-semibold">&lt;24h</span> response. Priority onboarding for setup and <span className="text-[var(--brand-primary)] font-semibold">CRM</span> integrations included.
                            </>
                          ) : (
                            faq.a
                          )}
                        </p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Stack>
        </Container>
      </Section>

      {/* Use consistent Footer component across entire demo site */}
      <Footer />
    </div>
  );
}
