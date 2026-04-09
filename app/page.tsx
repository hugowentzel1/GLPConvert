'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LegalFooter from '@/components/legal/LegalFooter';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import HeroBrand from '@/src/brand/HeroBrand';
import { useBrandColors } from '@/hooks/useBrandColors';
import PriceWithMicrocopy from '@/components/PriceWithMicrocopy';
import LogoWall from '@/components/trust/LogoWall';
import Testimonial from '@/components/trust/Testimonial';
import MetricsBar from '@/components/trust/MetricsBar';
import AboutBlock from '@/components/trust/AboutBlock';
import TrustFooterLine from '@/components/trust/TrustFooterLine';
import { getTrustData } from '@/lib/trust';
import { usePreviewQuota } from '@/src/demo/usePreviewQuota';
import SmartStickyCTA from '@/components/SmartStickyCTA';
import { useCountdown } from '@/src/demo/useCountdown';
import LockOverlay from '@/src/demo/LockOverlay';
import { useIsDemo } from '@/src/lib/isDemo';
import React from 'react';
import { attachCheckoutHandlers } from '@/src/lib/checkout';
import { tid } from '@/src/lib/testids';
import Footer from '@/components/Footer';
import QuoteCard from '@/components/quotes/QuoteCard';
import QuoteGrid from '@/components/quotes/QuoteGrid';
import Testimonials from '@/components/Testimonials';
import TrustRow from '@/components/trust/TrustRow';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import StickyCtaBar from '@/components/StickyCtaBar';
import DemoPreviewTopBar from '@/components/marketing/DemoPreviewTopBar';
import { PRODUCT_NAME } from '@/lib/product-identity';

function HomeContent() {
  const [trustData, setTrustData] = useState<any>(null);
  const [showLockScreen, setShowLockScreen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // Use useSearchParams for client-side access
  const intakeHref = React.useMemo(() => {
    const q = searchParams?.toString();
    return q ? `/intake?${q}` : "/intake";
  }, [searchParams]);

  // Brand takeover mode detection
  const b = useBrandTakeover();
  
  // Demo mode detection - use brand state instead of separate hook
  const isDemo = b.isDemo;
  
  // Remove the loading state check - brand always has a default value
  // const [isBrandLoaded, setIsBrandLoaded] = useState(false);
  
  // Brand colors from URL
  useBrandColors();
  const { read, consume } = usePreviewQuota(2);
  const remaining = read();
  const countdown = useCountdown(b.expireDays);

  // Load trust data
  useEffect(() => {
    getTrustData().then(setTrustData);
  }, []);

  // Attach checkout handlers to CTAs
  useEffect(() => {
    attachCheckoutHandlers();
  }, []);

  // Add debug markers and content shown sentinel - force redeploy
  useEffect(() => {
    (window as any).__CONTENT_SHOWN__ = true;
  }, []);

  // Check if we should redirect to paid version - add delay to allow brand state to load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDemo && typeof window !== 'undefined') {
        const company = searchParams?.get('company');
        if (company) {
          // Redirect to paid version with all URL parameters
          const currentUrl = new URL(window.location.href);
          currentUrl.pathname = '/paid';
          window.location.href = currentUrl.toString();
          return;
        }
      }
    }, 100); // Small delay to allow brand state to update

    return () => clearTimeout(timer);
  }, [isDemo, searchParams]);

  // Show loading state while brand is being initialized
  // Brand always has a default value, no need to wait for it to load
  // Removed: if (!isBrandLoaded) check

  // Early return for paid versions to prevent demo content from rendering
  // Only redirect if: NOT in demo mode, has company, NO demo param
  if (!isDemo) {
    const company = searchParams?.get('company');
    const demoParam = searchParams?.get('demo');
    if (company && demoParam !== '1' && demoParam !== 'true') {
      return <div>Redirecting to paid version...</div>;
    }
  }



  const handleLaunchClick = async () => {
    if (b.enabled) {
      // Start Stripe checkout with tracking
      try {
        // Collect tracking parameters from URL
        const token = searchParams?.get('token');
        const company = searchParams?.get('company');
        const utm_source = searchParams?.get('utm_source');
        const utm_campaign = searchParams?.get('utm_campaign');
        
        // Capture current page URL for cancel redirect
        const cancel_url = window.location.href;
        
        // Show optimistic loading state with micro-feedback
        const button = document.querySelector('[data-cta-button]') as HTMLButtonElement;
        if (button) {
          const originalText = button.textContent;
          button.textContent = 'Preparing your branded checkout...';
          button.disabled = true;
          
          // Add progress indicator at top
          const progressBar = document.createElement('div');
          progressBar.id = 'checkout-progress';
          progressBar.className = 'fixed top-0 left-0 right-0 h-0.5 z-50';
          progressBar.style.backgroundColor = 'var(--brand-primary, #0f172a)';
          progressBar.style.animation = 'progressSlide 1.2s ease-in-out infinite';
          document.body.appendChild(progressBar);
          
          // Start checkout
          const response = await fetch('/api/stripe/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              plan: 'starter',
              token,
              company,
              utm_source,
              utm_campaign,
              cancel_url
            })
          });
          
          if (!response.ok) {
            throw new Error('Checkout failed');
          }
          
          const { url } = await response.json();
          window.location.href = url;
        }
      } catch (error) {
        console.error('Checkout error:', error);
        alert('Unable to start checkout. Please try again.');
      }
    } else {
      // Route to signup page for non-branded experience
      router.push('/signup');
    }
  };

  // Don't block render on brand takeover - show content immediately
  // The brand takeover will update the UI when ready
  // Remove the early return to show full content always

  return (
    <div className="min-h-screen bg-slate-50 font-inter antialiased" data-demo={isDemo}>
      <ReadingProgressBar />
      {isDemo && b.enabled ? (
        <DemoPreviewTopBar
          brandName={b.brand || "Your Company"}
          countdown={countdown}
          runsLeft={remaining}
        />
      ) : null}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 hero">
        {/* Ensure hero text container is below header but above any background media */}
        <section className="relative z-10">
        <div className="hero text-center space-y-6">
          
          {/* Live confirmation bar for paid mode */}
          {!isDemo && (
            <div className="mx-auto max-w-3xl mt-4 rounded-lg bg-emerald-50 text-emerald-900 text-sm px-4 py-2 border border-emerald-200 flex items-center justify-center gap-6" {...tid('live-bar')}>
              <span className="flex-shrink-0 mr-2">✅</span>
              <span>Live for <b>{b.brand || 'Your Company'}</b>. New leads hit your inbox instantly and your dashboard—optional CRM sync if you use one.</span>
            </div>
          )}
          
          {/* Company Branding Section - Demo only (cold-email buyer: clarity + outcome + risk reversal) */}
          {isDemo && b.enabled && (
            <div>
              <div className="rounded-2xl border border-slate-200/90 bg-white py-6 px-8 shadow-sm mx-auto max-w-2xl">
                <div className="text-center" {...tid('demo-cta')}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Personalized preview
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                    {b.brand || "Your clinic"}: your branded GLP-1 intake path
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Powered by{" "}
                    <a href="/status" className="font-medium hover:underline" style={{ color: b.primary }}>
                      {PRODUCT_NAME}
                    </a>
                  </p>
                  <p className="text-base sm:text-lg text-slate-600 mt-4 max-w-xl mx-auto leading-relaxed">
                    This is what patients see <strong className="font-semibold text-slate-800">before</strong> they hit your
                    scheduler: clarity on pathway, timing, and typical ranges—so fewer no-shows and abandoned bookings, and more
                    consults per dollar of ad spend. Self-serve evaluation is standard for B2B buyers (
                    <a
                      href="https://www.gartner.com/en/sales/insights/b2b-buying-journey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-800 underline decoration-slate-300 underline-offset-2 hover:text-slate-900"
                    >
                      Gartner
                    </a>
                    ); your prospects expect the same before they buy—your patients do too before they book.
                  </p>
       <button 
         data-cta="primary"
         onClick={handleLaunchClick}
         data-cta-button
         className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl text-sm font-semibold text-white border border-transparent shadow-sm hover:opacity-[0.97] active:scale-[0.995] transition cursor-pointer mt-6"
         style={{ backgroundColor: 'var(--brand-primary)' }}
         aria-label="Launch Your Branded Version Now"
         data-testid="primary-cta-hero"
       >
         <span className="mr-3">⚡</span>
         <span>Launch Your Branded Version Now</span>
       </button>
       <p className="text-sm text-gray-600 mt-6" data-testid="microcopy-hero">
         $99/mo + $399 setup • Live in 24 hours — or your setup fee is refunded.
       </p>
                </div>
              </div>
            </div>
          )}
          
          {/* HERO ICON: render only one (fix double) */}
          {false ? (
            <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden animate-pulse" style={{ background: `linear-gradient(135deg, #e5e7eb, #d1d5db)` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
            </div>
          ) : !b.enabled ? (
            <div
              className="w-28 h-28 mx-auto rounded-2xl flex items-center justify-center border border-slate-200/90 bg-white shadow-sm relative overflow-hidden"
              aria-hidden
            >
              <span className="text-5xl relative z-10">⚕️</span>
            </div>
          ) : (
            <HeroBrand size="lg" />
          )}
          
          <div className="space-y-6">
            <div className="space-y-6">
              {isDemo && b.enabled ? (
                <>
                  <h1
                    className="text-4xl sm:text-5xl md:text-[2.75rem] font-semibold tracking-tight text-slate-900 leading-[1.15] max-w-3xl mx-auto"
                    data-testid="home-demo-headline"
                  >
                    More GLP-1 consult revenue from the same ad spend—not more meetings.
                  </h1>

                  <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    {PRODUCT_NAME} is a <strong className="font-semibold text-slate-800">white-label</strong> pre-consult layer: it
                    runs <em>before</em> your booking link so clicks turn into <strong className="font-semibold text-slate-800">
                      scheduled
                    </strong>{" "}
                    consults instead of “I’ll think about it.” You keep your site and ads; we add the conversion path in{" "}
                    <strong className="font-semibold text-slate-800">your</strong> colors and logo. Built for telehealth, med spas,
                    and GLP-1 programs. Education and intake only—not prescribing or medical advice.
                  </p>
                  <p
                    className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed text-center mt-4"
                    data-home-proof-footnote
                  >
                    Context: self-directed digital buying is the norm—see{" "}
                    <a
                      href="https://www.gartner.com/en/sales/insights/b2b-buying-journey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-slate-600 underline decoration-slate-300 underline-offset-2 hover:text-slate-900"
                    >
                      Gartner on the B2B buying journey
                    </a>
                    .
                  </p>
                  <div className="pt-4">
                    <a
                      href={intakeHref}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
                      data-testid="home-demo-try-intake"
                    >
                      Open the branded intake preview
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-4xl sm:text-5xl md:text-[2.75rem] font-semibold tracking-tight text-slate-900 leading-[1.15] max-w-3xl mx-auto">
                    Turn GLP traffic into booked, higher-intent consults.
                  </h1>

                  <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    {PRODUCT_NAME} is a white-label <strong className="font-semibold text-gray-800">pre-consult conversion layer</strong>{" "}
                    for telehealth, med spas, and weight-loss programs: clarity, expectations, consult readiness, then handoff to{" "}
                    <em>your</em> booking flow — not medical advice.
                  </p>
                  <div className="pt-4">
                    <a
                      href={intakeHref}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
                    >
                      Try the branded intake experience
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Hero Trust Row */}
          <div data-testid="home-hero-cta">
            <TrustRow />
          </div>

          {/* Quotes - Social Proof Grid */}
          <Testimonials />

          {trustData?.metrics?.length ? (
            <div data-testid="kpi-band">
              <MetricsBar items={trustData.metrics} className="border-t border-slate-200/80" />
            </div>
          ) : null}


          {/* Trust Signals - Logo Wall */}
          {trustData && <LogoWall logos={trustData.logos} />}

          {/* Features — demo: pain/outcome; default: product facts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto py-8 md:py-12">
            {isDemo && b.enabled ? (
              <>
                <div className="rounded-2xl border border-slate-200/90 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md flex flex-col justify-center">
                  <div className="text-lg font-semibold text-slate-900 mb-3">Stop burning paid spend on dead-end clicks</div>
                  <div className="text-slate-600 text-sm leading-relaxed">
                    Patients understand pathway, timing, and typical ranges <em>before</em> they book—fewer no-shows, fewer “what is
                    this?” calls, and less budget wasted on traffic that never becomes a consult.
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/90 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md flex flex-col justify-center">
                  <div className="text-lg font-semibold text-slate-900 mb-3">Pipeline you can monetize</div>
                  <div className="text-slate-600 text-sm leading-relaxed">
                    Submissions hit your inbox and dashboard the same day—so sales and scheduling can act while intent is hot.
                    Optional push to HubSpot, Salesforce, or the CRM you already pay for.
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/90 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md flex flex-col justify-center">
                  <div className="text-lg font-semibold text-slate-900 mb-3">HIPAA-ready posture</div>
                  <div className="text-slate-600 text-sm leading-relaxed">
                    Encryption in transit, access-controlled infrastructure, tenant-scoped handling—BAAs where required.
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-2xl border border-slate-200/90 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md flex flex-col justify-center">
                  <div className="text-lg font-semibold text-slate-900 mb-3">Consult-ready education</div>
                  <div className="text-slate-600 text-sm leading-relaxed">
                    Expectations and typical ranges in plain language — a licensed provider still decides eligibility and treatment.
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/90 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md flex flex-col justify-center">
                  <div className="text-lg font-semibold text-slate-900 mb-3">Leads to inbox + dashboard</div>
                  <div className="text-slate-600 text-sm leading-relaxed">
                    Instant email when a lead submits, plus your dashboard. Optional handoff to HubSpot, Salesforce, or your CRM.
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/90 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md flex flex-col justify-center">
                  <div className="text-lg font-semibold text-slate-900 mb-3">HIPAA-ready posture</div>
                  <div className="text-slate-600 text-sm leading-relaxed">
                    Encryption in transit, access-controlled infrastructure, and tenant-scoped handling — BAAs where required.
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Final CTA Section */}
          <div className="max-w-4xl mx-auto py-8 md:py-10">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm">
              <div className="text-center space-y-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {isDemo && b.enabled ? "Ship your branded intake this week" : "Launch Your Branded Version Now"}
                </h2>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                  {isDemo && b.enabled ? (
                    <>
                      <span>• Live in 24h—or setup fee refunded</span>
                      <span>• $99/mo + $399 setup (fraction of one wasted ad day)</span>
                      <span>• Your logo & colors on every step</span>
                    </>
                  ) : (
                    <>
                      <span>• &lt;24h setup</span>
                      <span>• Instant lead email + dashboard (+ optional CRM)</span>
                      <span>• Ongoing support</span>
                    </>
                  )}
                </div>
       <button 
         onClick={handleLaunchClick}
         data-cta="primary"
         data-cta-button
         className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-semibold text-white border border-transparent shadow-sm hover:opacity-[0.97] transition cursor-pointer"
         style={{ backgroundColor: 'var(--brand-primary)' }}
         aria-label="Launch Your Branded Version Now"
         data-testid="primary-cta-bottom"
       >
         <span className="mr-3">⚡</span>
         <span>Launch Your Branded Version Now</span>
       </button>
       <p className="text-sm text-slate-500 mt-2" data-testid="microcopy-bottom">
         $99/mo + $399 setup • Live in 24 hours — or your setup fee is refunded.
       </p>
              </div>
            </div>
          </div>


          {/* Trust Signals - Testimonial and Metrics */}
          {trustData && (
            <>
              {trustData.testimonial && (
                <Testimonial 
                  quote={trustData.testimonial.quote}
                  name={trustData.testimonial.name}
                  title={trustData.testimonial.title}
                  company={trustData.testimonial.company}
                  metric={trustData.testimonial.metric}
                  avatarSrc={trustData.testimonial.avatarSrc}
                />
              )}
            </>
          )}

          {/* How It Works Section - Centered */}
          <div className="max-w-4xl mx-auto py-8 md:py-10 px-4">
            <div className="text-center space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How it works</h2>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex flex-col items-center space-y-2 w-full md:w-auto text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[var(--brand-primary)] rounded-full flex items-center justify-center text-white font-semibold text-base shadow-md flex-shrink-0">
                    1
                  </div>
                  <span className="text-base text-slate-700 max-w-[160px]">
                    {isDemo && b.enabled ? "Prospect starts your branded intake" : "Patient starts your intake"}
                  </span>
                </div>
                <div className="hidden md:block text-slate-400 text-2xl flex-shrink-0 -mt-8">→</div>
                <div className="flex flex-col items-center space-y-2 w-full md:w-auto text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[var(--brand-primary)] rounded-full flex items-center justify-center text-white font-semibold text-base shadow-md flex-shrink-0">
                    2
                  </div>
                  <span className="text-base text-slate-700 max-w-[160px]">
                    {isDemo && b.enabled ? "Clarity, timing & readiness (not a diagnosis)" : "Education & consult readiness"}
                  </span>
                </div>
                <div className="hidden md:block text-slate-400 text-2xl flex-shrink-0 -mt-8">→</div>
                <div className="flex flex-col items-center space-y-2 w-full md:w-auto text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[var(--brand-primary)] rounded-full flex items-center justify-center text-white font-semibold text-base shadow-md flex-shrink-0">
                    3
                  </div>
                  <span className="text-base text-slate-700 max-w-[160px]">
                    {isDemo && b.enabled ? "Books your consult link" : "Consultation booked"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ — buyer-focused when branded demo; default marketing FAQ otherwise */}
          <div className="max-w-4xl mx-auto py-8 md:py-10 px-4" {...tid('pricing-section')}>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
            {isDemo && b.enabled ? (
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">What exactly am I buying?</h3>
                  <p className="text-gray-600">
                    A <strong className="font-semibold text-gray-800">white-label</strong> pre-consult funnel: your branding, your
                    booking URL at the end, lead capture to your inbox/dashboard, and optional CRM handoff. We are{" "}
                    <strong className="font-semibold text-gray-800">not</strong> an EMR, pharmacy, or telehealth visit—this is the
                    education and qualification layer <em>before</em> the consult.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">How does this pay for itself?</h3>
                  <p className="text-gray-600">
                    Paid acquisition only works if clicks convert into <strong className="font-semibold text-gray-800">booked</strong>{" "}
                    consults. This layer reduces drop-off between ad and calendar, so you recover margin you were already spending
                    to acquire—plus fewer no-shows and confused prospects on the phone.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Is this medical advice?</h3>
                  <p className="text-gray-600">
                    No. {PRODUCT_NAME} is for education, intake, and routing only. A licensed provider determines eligibility and
                    treatment.{" "}
                    <a
                      href="/methodology"
                      className="text-[var(--brand-primary)] hover:text-[var(--brand-primary)]/80 hover:underline font-medium transition-colors duration-200"
                    >
                      How we describe programs
                    </a>
                    .
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">How fast can we go live?</h3>
                  <p className="text-gray-600">
                    Target <strong className="font-semibold text-gray-800">24 hours</strong> from checkout: we give you a snippet or
                    hosted link, you drop it on your site or ads—no engineering sprint.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Will it work with our site / ads?</h3>
                  <p className="text-gray-600">
                    Yes—one embed script or a hosted page you can link from Meta, Google, or your homepage. WordPress, Webflow,
                    Squarespace, custom stacks.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Security &amp; compliance</h3>
                  <p className="text-gray-600">
                    Encryption in transit (and at rest where applicable), access-controlled infrastructure, HIPAA-ready posture—
                    BAAs where required for your use case.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Support</h3>
                  <p className="text-gray-600">Email support plus onboarding help so your team isn’t guessing at embed or copy.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Is this medical advice?</h3>
                  <p className="text-gray-600">
                    No. {PRODUCT_NAME} is for education, intake, and booking only. A licensed provider determines final eligibility.{" "}
                    <a
                      href="/methodology"
                      className="text-[var(--brand-primary)] hover:text-[var(--brand-primary)]/80 hover:underline font-medium transition-colors duration-200"
                    >
                      How we describe programs
                    </a>
                    .
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Setup time? — Live on your site within 24 hours, no coding required</h3>
                  <p className="text-gray-600">We handle the setup.</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">CMS / Embed? — Yes, 1-line &lt;script&gt;. Hosted option too.</h3>
                  <p className="text-gray-600">Works with any website platform. Just add one line of code.</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Security? — Encrypted in transit &amp; at rest</h3>
                  <p className="text-gray-600">Bank-level security for all customer data.</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Support? — Email support 24/7</h3>
                  <p className="text-gray-600">Get help whenever you need it.</p>
                </div>
              </div>
            )}
          </div>

          {/* Trust Signals - About Block */}
          {trustData && (
            <AboutBlock 
              heading={trustData.about.heading}
              body={trustData.about.body}
            />
          )}
        </div>
        </section>
      </main>

      <Footer />
      
      {/* Sticky CTA - Simple and consistent on mobile, Smart on desktop */}
      <SmartStickyCTA onClick={handleLaunchClick} />
      
      <StickyCtaBar
         label="Launch Your Branded Version Now"
        testId="sticky-demo-cta"
        className="md:hidden"   // MOBILE-ONLY - always visible
        onClick={handleLaunchClick}
      />

      {/* Lock Overlay - Show when demo limit reached */}
      {showLockScreen && <LockOverlay />}

    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
