'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LegalFooter from '@/components/legal/LegalFooter';
import { useBrandTakeover, brandStateFromSearchParams } from '@/src/brand/useBrandTakeover';
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
import DemoRoiTeaser from '@/components/marketing/DemoRoiTeaser';
import PartnerSummaryCopy from '@/components/marketing/PartnerSummaryCopy';
import { persistUtmFromSearchParams } from '@/lib/glp-attribution';
import { buildStripeCheckoutClientPayload } from '@/lib/stripe-checkout-client';
import { PRODUCT_NAME } from '@/lib/product-identity';
import { track } from '@/src/demo/track';

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

  useEffect(() => {
    if (searchParams) {
      persistUtmFromSearchParams(new URLSearchParams(searchParams.toString()));
    }
  }, [searchParams]);

  const demoViewTracked = useRef(false);
  useEffect(() => {
    if (!isDemo || !b.enabled || demoViewTracked.current) return;
    demoViewTracked.current = true;
    track("demo_home_view", { brand: b.brand, placement: "home" });
  }, [isDemo, b.enabled, b.brand]);

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



  const handleLaunchClick = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    const snap =
      typeof window !== "undefined"
        ? brandStateFromSearchParams(new URLSearchParams(window.location.search))
        : null;
    const checkoutEnabled = snap?.enabled ?? b.enabled;
    if (checkoutEnabled) {
      try {
        const payload = buildStripeCheckoutClientPayload();
        track("checkout_start", {
          brand: snap?.brand ?? b.brand,
          company: payload.company || undefined,
          utm_source: payload.utm_source,
          utm_medium: payload.utm_medium,
          utm_campaign: payload.utm_campaign,
          placement: "home_primary",
        });

        const button = (e?.currentTarget as HTMLButtonElement | undefined) ??
          (document.querySelector("[data-cta-button]") as HTMLButtonElement | null);
        if (button) {
          button.textContent = "Preparing secure checkout…";
          button.disabled = true;

          const progressBar = document.createElement("div");
          progressBar.id = "checkout-progress";
          progressBar.className = "fixed top-0 left-0 right-0 h-0.5 z-50 motion-reduce:animate-none";
          progressBar.style.backgroundColor = "var(--brand-primary, #0f172a)";
          progressBar.style.animation = "progressSlide 1.2s ease-in-out infinite";
          document.body.appendChild(progressBar);
        }

        const response = await fetch("/api/stripe/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Checkout failed");
        }

        const { url } = await response.json();
        window.location.href = url;
      } catch (error) {
        console.error("Checkout error:", error);
        alert("Unable to start checkout. Please try again.");
      }
    } else {
      router.push("/signup");
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
            <div className="home-demo-preview-module">
              <div className="rounded-2xl border border-slate-200/90 bg-white py-7 px-6 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.04] sm:px-10 mx-auto max-w-2xl">
                <div className="text-center" {...tid("demo-cta")}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Private link — evaluate without a call
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 text-pretty">
                    {b.brand || "Your clinic"}: see the patient path before they book
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Powered by{" "}
                    <a href="/status" className="font-medium hover:underline" style={{ color: b.primary }}>
                      {PRODUCT_NAME}
                    </a>
                  </p>
                  <ul className="mt-5 max-w-lg mx-auto text-left text-sm text-slate-700 space-y-2 list-disc pl-5">
                    <li>
                      <strong className="text-slate-900">Included:</strong> hosted intake + embed script, lead email + dashboard,
                      optional CRM webhook.
                    </li>
                    <li>
                      <strong className="text-slate-900">Not included:</strong> EMR, prescribing, telehealth visits — education &
                      routing only.
                    </li>
                  </ul>
                  <p className="text-base sm:text-lg text-slate-600 mt-5 max-w-xl mx-auto leading-relaxed text-pretty">
                    Between your paid click and your scheduler, patients get clarity on pathway, timing, and typical ranges—fewer
                    abandoned bookings and no-shows. Evaluate on your own timeline; activate when you’re ready.
                  </p>
                  <p className="text-xs text-slate-500 mt-3 max-w-xl mx-auto">
                    Why self-serve B2B evaluation matters →{" "}
                    <a
                      href="https://www.gartner.com/en/sales/insights/b2b-buying-journey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-slate-600 underline decoration-slate-300 underline-offset-2 hover:text-slate-900"
                    >
                      Gartner on the B2B buying journey
                    </a>
                  </p>
                  <button
                    onClick={handleLaunchClick}
                    data-cta-button
                    className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl text-sm font-semibold text-white border border-transparent shadow-sm hover:opacity-[0.97] active:scale-[0.995] transition cursor-pointer mt-6"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                    aria-label="Continue to secure checkout"
                    data-testid="primary-cta-hero"
                  >
                    <span className="mr-3">⚡</span>
                    <span>Continue to secure checkout</span>
                  </button>
                  <p className="text-sm text-slate-700 mt-4 font-medium max-w-lg mx-auto" data-testid="microcopy-hero">
                    $99/mo + $399 setup · Go live in 24h · Setup fee refunded if we miss the window · Tax & total shown on Stripe (
                    <Link href="/legal/refund" className="underline underline-offset-2 hover:text-slate-900">
                      refund policy
                    </Link>
                    ).
                  </p>
                  <PartnerSummaryCopy brandName={b.brand || "Your clinic"} />
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
                    className="text-4xl sm:text-5xl md:text-[2.75rem] font-semibold tracking-tight text-slate-900 leading-[1.15] max-w-3xl mx-auto text-pretty"
                    data-testid="home-demo-headline"
                  >
                    Turn the GLP-1 clicks you already buy into booked consults—without a sales call.
                  </h1>

                  <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed text-pretty">
                    {PRODUCT_NAME} sits <strong className="font-semibold text-slate-800">between your ads and your booking link</strong>
                    : branded education and intake, then handoff to <em>your</em> scheduler. Not medical advice; not prescribing.
                  </p>
                  <DemoRoiTeaser />
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-600">
                    <Link href="/security" className="underline underline-offset-2 hover:text-slate-900">
                      Security
                    </Link>
                    <span className="text-slate-300" aria-hidden>
                      ·
                    </span>
                    <Link href="/methodology" className="underline underline-offset-2 hover:text-slate-900">
                      Methodology
                    </Link>
                    <span className="text-slate-300" aria-hidden>
                      ·
                    </span>
                    <Link href="/legal/refund" className="underline underline-offset-2 hover:text-slate-900">
                      Refund policy
                    </Link>
                  </div>
                  <div className="pt-6">
                    <a
                      href={intakeHref}
                      onClick={() => track("intake_preview_click", { brand: b.brand, placement: "home_secondary" })}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
                      data-testid="home-demo-try-intake"
                    >
                      Preview the patient intake (~2 min)
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
                  {isDemo && b.enabled ? `Activate ${b.brand || "your clinic"} this week` : "Launch Your Branded Version Now"}
                </h2>
                {isDemo && b.enabled ? (
                  <p className="text-sm text-slate-600 max-w-xl mx-auto">
                    After checkout: onboarding email with embed / hosted link instructions — same-day target, 24h max or setup fee
                    refunded per policy.
                  </p>
                ) : null}
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
         data-cta-button
         className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-semibold text-white border border-transparent shadow-sm hover:opacity-[0.97] transition cursor-pointer"
         style={{ backgroundColor: 'var(--brand-primary)' }}
         aria-label="Continue to secure checkout"
         data-testid="primary-cta-bottom"
       >
         <span className="mr-3">⚡</span>
         <span>{isDemo && b.enabled ? "Continue to secure checkout" : "Launch Your Branded Version Now"}</span>
       </button>
       <p className="text-sm text-slate-500 mt-2" data-testid="microcopy-bottom">
         {isDemo && b.enabled
           ? "$99/mo + $399 setup · Tax & total on Stripe · Refund policy applies to setup fee timing"
           : "$99/mo + $399 setup • Live in 24 hours — or your setup fee is refunded."}
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
      <SmartStickyCTA
        onClick={handleLaunchClick}
        ctaLabel={isDemo && b.enabled ? "Continue to secure checkout" : "Launch Your Branded Version Now"}
      />
      
      <StickyCtaBar
         label={isDemo && b.enabled ? "Continue to secure checkout" : "Launch Your Branded Version Now"}
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
