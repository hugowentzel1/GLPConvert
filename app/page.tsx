'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PlaceResult } from '@/lib/types';
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
import { PRODUCT_NAME, STORAGE_KEYS } from '@/lib/product-identity';

const AddressAutocomplete = dynamic(() => import('@/components/AddressAutocomplete'), { 
  ssr: false,
  loading: () => <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
});

function HomeContent() {
  console.log('[route] render start');
  
  const [address, setAddress] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showSampleReportModal, setShowSampleReportModal] = useState(false);
  const [sampleReportSubmitted, setSampleReportSubmitted] = useState(false);
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
  
  // Debug logging for brand state
  useEffect(() => {
    console.log('Main page brand state:', b);
    console.log('Main page localStorage:', localStorage.getItem(STORAGE_KEYS.brandTakeover));
    console.log('Main page isDemo:', isDemo);
  }, [b, isDemo]);
  
  // Brand colors from URL
  useBrandColors();
  const { read, consume } = usePreviewQuota(2);
  const remaining = read();
  const countdown = useCountdown(b.expireDays);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
    
    // Restore last typed address for continuity
    let savedAddress = localStorage.getItem(STORAGE_KEYS.lastAddress);
    if (!savedAddress) {
      const legacyAddr = localStorage.getItem(STORAGE_KEYS.legacyLastAddress);
      if (legacyAddr) {
        savedAddress = legacyAddr;
        localStorage.setItem(STORAGE_KEYS.lastAddress, legacyAddr);
        localStorage.removeItem(STORAGE_KEYS.legacyLastAddress);
      }
    }
    if (savedAddress && savedAddress !== 'undefined' && !address) {
      setAddress(savedAddress);
    }
  }, [address]);

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
    console.log('[route] hydrated');
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



  const handleAddressSelect = (place: { formattedAddress: string; placeId: string; lat: number; lng: number; state?: string }) => {
    console.log('Address selected:', place.formattedAddress, 'placeId:', place.placeId, 'state:', place.state);
    
    // Create a mock selectedPlace object for navigation (state used for utility rate in estimate)
    const mockPlace = {
      formattedAddress: place.formattedAddress,
      placeId: place.placeId,
      lat: place.lat || 40.7128, // Use provided coordinates or default NYC
      lng: place.lng || -74.0060,
      state: place.state,
      components: {
        street_number: '',
        route: '',
        locality: '',
        administrative_area_level_1: place.state || '',
        country: '',
        postal_code: ''
      }
    };
    
    setAddress(place.formattedAddress);
    setSelectedPlace(mockPlace);
    
    // Save address for state continuity (only if valid)
    if (address && address !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.lastAddress, address);
    }
    
    // Automatically navigate to report page when address is selected - deployment fix
    if (address && address.trim()) {
      console.log('Auto-navigating to report page with selected address');
      handleGenerateEstimate(address, mockPlace);
    }
  };

  const handleGenerateEstimate = (addressParam?: string, placeParam?: any) => {
    const currentAddress = addressParam || address;
    const currentPlace = placeParam || selectedPlace;
    
    if (!currentAddress.trim()) return;
    
    console.log('Generating estimate for address:', currentAddress);
    console.log('Selected place:', currentPlace);
    
    // Check quota and block if 0 runs left
    if (b.enabled) {
      const currentQuota = read();
      console.log('🔒 Homepage quota check - currentQuota:', currentQuota);
      
      // If quota is 0 or negative, show lock overlay instead of navigating
      if (currentQuota <= 0) {
        console.log('🚫 Demo limit reached - triggering lock overlay');
        setShowLockScreen(true);
        return;
      }
      
      console.log('🔒 Homepage - quota available:', currentQuota);
    }
    
    setIsLoading(true);
    
    try {
      // Get current URL parameters to preserve company and demo
      const company = searchParams?.get('company');
      const demo = searchParams?.get('demo');
      
      if (currentPlace && currentPlace.formattedAddress) {
        const q = new URLSearchParams({
          address: currentPlace.formattedAddress,
          lat: String(currentPlace.lat),
          lng: String(currentPlace.lng),
          placeId: currentPlace.placeId,
        });
        if (currentPlace.state) q.set('state', currentPlace.state);
        
        // Add company and demo parameters if they exist
        if (company) q.set('company', company);
        if (demo) q.set('demo', demo);
        
        console.log('Navigating to report with selected place:', q.toString());
        router.push(`/report?${q.toString()}`);
      } else {
        const q = new URLSearchParams({ 
          address: currentAddress, 
          lat: '40.7128', 
          lng: '-74.0060', 
          placeId: 'demo' 
        });
        
        // Add company and demo parameters if they exist
        if (company) q.set('company', company);
        if (demo) q.set('demo', demo);
        
        console.log('Navigating to report with manual address:', q.toString());
        router.push(`/report?${q.toString()}`);
      }
    } catch (error) {
      console.error('Error generating estimate:', error);
      setIsLoading(false);
    }
  };

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
          progressBar.className = 'fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50';
          progressBar.style.animation = 'progressSlide 1.5s ease-in-out infinite';
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

  const initials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter" data-demo={isDemo}>
      <ReadingProgressBar />
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
          
          {/* Company Branding Section - Demo only */}
          {isDemo && b.enabled && (
            <div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl py-6 px-8 border border-gray-200/50 shadow-lg mx-auto max-w-2xl">
                <div className="text-center" {...tid('demo-cta')}>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Demo for {b.brand || 'Your Company'} — <a href="/status" className="hover:underline" style={{ color: b.primary }}>{PRODUCT_NAME}</a>
                  </h2>
                  <p className="text-lg text-gray-600 mt-4">
                    Your logo. Your URL. Branded GLP-1 intake &amp; booking — live in 24 hours.
                  </p>
       <button 
         data-cta="primary"
         onClick={handleLaunchClick}
         data-cta-button
         className="inline-flex items-center justify-center px-4 py-4 rounded-full text-sm font-medium text-white border border-transparent shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer button-press mt-6" 
         style={{ backgroundColor: 'var(--brand-primary)' }}
         aria-label="Launch Your Branded Version Now"
         data-testid="primary-cta-hero"
       >
         <span className="mr-3">⚡</span>
         <span>Launch Your Branded Version Now</span>
       </button>
       <p className="text-sm text-gray-600 mt-6" data-testid="microcopy-hero">
         $99/mo + $399 setup • Live in 24 hours — or your setup fee is refunded..
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
            <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${b.primary}, ${b.primary}CC)` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="text-6xl relative z-10" aria-hidden>⚕️</span>
            </div>
          ) : (
            <HeroBrand size="lg" />
          )}
          
          <div className="space-y-6">
            <div className="space-y-6">
              
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-tight" style={{ fontSize: '3rem !important', fontWeight: '900 !important' }}>
                Turn traffic into booked consults — with compliant, branded GLP intake.
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {PRODUCT_NAME} is a white-label conversion layer for medical weight-loss programs: structured leads, program suggestions, and handoff to your calendar — not medical advice.
              </p>
              <div className="pt-4">
                <a
                  href={intakeHref}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                >
                  Try the GLP intake flow
                </a>
                <span className="block text-sm text-gray-500 mt-2">
                  Legacy address → report sample still available below for comparison.
                </span>
              </div>
            </div>
          </div>

          {/* Hero Trust Row */}
          <div data-testid="home-hero-cta">
            <TrustRow />
          </div>

          {/* Address Input Section - Exact match to c548b88 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/30 p-8 md:p-12 max-w-3xl mx-auto section-spacing slide-up-fade">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Start with location (legacy flow)</h2>
                <p className="text-gray-600">This address step will be replaced by the GLP intake questionnaire. A licensed provider determines final eligibility.</p>
              </div>

              <div className="space-y-6">
                {/* Address Input - Show for both demo and regular modes */}
                <div className="w-full max-w-2xl mx-auto space-y-1.5">
                  <AddressAutocomplete 
                    value={address}
                    onChange={setAddress}
                    onSelect={handleAddressSelect}
                    data-testid="demo-address-input"
                    placeholder={b.city && b.city !== 'undefined' ? `Start typing an address in ${b.city}...` : "Start typing your property address..."}
                    className="w-full"
                  />
                  {isDemo && (
                    <div className="flex justify-end">
                      <span className="text-[11px] text-gray-400">Powered by Google</span>
                    </div>
                  )}
                </div>

                {/* Generate Button - Now below the search bar */}
                <button 
                  onClick={address?.trim() ? () => handleGenerateEstimate() : (b.enabled ? handleLaunchClick : () => handleGenerateEstimate())}
                  disabled={!address?.trim() || isLoading} 
                  data-cta-button
                  className={`w-full inline-cta ${
                    !address?.trim() || isLoading 
                      ? 'btn-disabled' 
                      : 'btn-cta'
                  }`} 
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading…</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-4">
                      <span>
                        {b.enabled 
                          ? `Continue to sample report`
                          : "Continue to sample report"
                        }
                      </span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </div>
                  )}
                </button>
                
                {isDemo && (
                  <div style={{ marginTop: '30.5px' }} className="h-12 md:h-14 flex flex-col items-center justify-end space-y-1">
                    {remaining > 0 ? (
                      <>
                        <p className="text-center text-sm text-gray-500">
                          Preview: {remaining} run{remaining===1?"":"s"} left.
                        </p>
                        <p className="text-center text-sm text-gray-500">
                          Expires in {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                        </p>
                      </>
                    ) : (
                      <div className="text-center text-sm text-red-600 font-semibold space-y-1">
                        <p>🚫 Demo limit reached.</p>
                        <p>Launch to get full access</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quotes - Social Proof Grid */}
          <Testimonials />

          {/* KPI Band - Single band only */}
          <div 
            data-testid="kpi-band"
            className="py-16 relative"
            style={{ 
              background: `linear-gradient(135deg, white, white, ${b.primary})`,
            }}
          >
            <div 
              className="absolute inset-0 opacity-100"
              style={{
                background: `linear-gradient(135deg, transparent, rgba(255,255,255,0.6), ${b.primary})`,
              }}
            ></div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-3 gap-12 text-center">
                <div className="group">
                  <div className="text-4xl font-black text-gray-900 font-mono group-hover:text-[var(--brand-primary)] transition-colors duration-300">28,417</div>
                  <div className="text-sm text-gray-600 font-medium mt-2">intake sessions this month (placeholder)</div>
                </div>
                <div className="group">
                  <div className="text-4xl font-black text-gray-900 font-mono group-hover:text-[var(--brand-primary)] transition-colors duration-300">31%</div>
                  <div className="text-sm text-gray-600 font-medium mt-2">average increase in completions</div>
                </div>
                <div className="group">
                  <div className="text-4xl font-black text-gray-900 font-mono group-hover:text-[var(--brand-primary)] transition-colors duration-300">113+</div>
                  <div className="text-sm text-gray-600 font-medium mt-2">clinic funnels live (placeholder)</div>
                </div>
              </div>
            </div>
          </div>


          {/* Trust Signals - Logo Wall */}
          {trustData && <LogoWall logos={trustData.logos} />}

          {/* Features - Single row of 3 cards with company color gradient shading */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto py-8 md:py-10">
            <div className="relative bg-gradient-to-br from-white via-white to-[var(--brand-primary)]/15 backdrop-blur-sm rounded-3xl p-8 text-center border border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 flex flex-col items-center justify-center group stagger-item hover-lift">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-[var(--brand-primary)]/25 rounded-3xl opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-2xl font-black text-gray-900 mb-3 group-hover:text-[var(--brand-primary)] transition-colors duration-300">Deterministic recommendations</div>
                <div className="text-gray-600 font-semibold leading-relaxed">Rules-based program suggestions with compliance-safe language — provider confirms eligibility in consult.</div>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-white via-white to-[var(--brand-primary)]/15 backdrop-blur-sm rounded-3xl p-8 text-center border border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 flex flex-col items-center justify-center group stagger-item hover-lift">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-[var(--brand-primary)]/25 rounded-3xl opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-2xl font-black text-gray-900 mb-3 group-hover:text-[var(--brand-primary)] transition-colors duration-300">Leads to inbox + dashboard</div>
                <div className="text-gray-600 font-semibold leading-relaxed">Instant email when a lead comes in, plus your dashboard. Optional sync to HubSpot, Salesforce, or your CRM.</div>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-white via-white to-[var(--brand-primary)]/15 backdrop-blur-sm rounded-3xl p-8 text-center border border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 flex flex-col items-center justify-center group stagger-item hover-lift">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-[var(--brand-primary)]/25 rounded-3xl opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-2xl font-black text-gray-900 mb-3 group-hover:text-[var(--brand-primary)] transition-colors duration-300">End-to-End Encryption</div>
                <div className="text-gray-600 font-semibold leading-relaxed">SOC 2-aligned controls and data protection</div>
              </div>
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="max-w-4xl mx-auto py-8 md:py-10">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg">
              <div className="text-center space-y-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Launch Your Branded Version Now</h2>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                  <span>• &lt;24h setup</span>
                  <span>• Instant lead email + dashboard (+ optional CRM)</span>
                  <span>• Ongoing support</span>
                </div>
       <button 
         onClick={handleLaunchClick}
         data-cta="primary"
         data-cta-button
         className="inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-medium text-white border border-transparent shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer" 
         style={{ backgroundColor: 'var(--brand-primary)' }}
         aria-label="Launch Your Branded Version Now"
         data-testid="primary-cta-bottom"
       >
         <span className="mr-3">⚡</span>
         <span>Launch Your Branded Version Now</span>
       </button>
       <p className="text-sm text-slate-500 mt-2" data-testid="microcopy-bottom">
         $99/mo + $399 setup • Live in 24 hours — or your setup fee is refunded..
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
                  <span className="text-base text-slate-700 max-w-[140px]">Customer requests quote</span>
                </div>
                <div className="hidden md:block text-slate-400 text-2xl flex-shrink-0 -mt-8">→</div>
                <div className="flex flex-col items-center space-y-2 w-full md:w-auto text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[var(--brand-primary)] rounded-full flex items-center justify-center text-white font-semibold text-base shadow-md flex-shrink-0">
                    2
                  </div>
                  <span className="text-base text-slate-700 max-w-[140px]">Instant branded report</span>
                </div>
                <div className="hidden md:block text-slate-400 text-2xl flex-shrink-0 -mt-8">→</div>
                <div className="flex flex-col items-center space-y-2 w-full md:w-auto text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[var(--brand-primary)] rounded-full flex items-center justify-center text-white font-semibold text-base shadow-md flex-shrink-0">
                    3
                  </div>
                  <span className="text-base text-slate-700 max-w-[140px]">Consultation booked</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section - Demo only */}
          {isDemo && (
            <div className="max-w-4xl mx-auto py-8 md:py-10 px-4" {...tid('pricing-section')}>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
              {/* SUNSPIRE: DEMO FAQ order */}
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Is this medical advice?</h3>
                  <p className="text-gray-600">No. {PRODUCT_NAME} is for education, intake, and booking only. A licensed provider determines final eligibility. <a href="/methodology" className="text-[var(--brand-primary)] hover:text-[var(--brand-primary)]/80 hover:underline font-medium transition-colors duration-200">How we describe programs</a>.</p>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Security? — Encrypted in transit & at rest</h3>
                  <p className="text-gray-600">Bank-level security for all customer data.</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Support? — Email support 24/7</h3>
                  <p className="text-gray-600">Get help whenever you need it.</p>
                </div>
              </div>
            </div>
          )}

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

      {/* Sample Report Modal */}
      {showSampleReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            {!sampleReportSubmitted ? (
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Request sample experience</h3>
                <p className="text-gray-600">
                  See how the intake flow, recommendation card, and booking CTA look for your brand (placeholder — wire to CRM when ready).
                </p>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setSampleReportSubmitted(true);
                  setTimeout(() => {
                    setShowSampleReportModal(false);
                    setSampleReportSubmitted(false);
                  }, 3000);
                }} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-lg text-white font-semibold transition-colors"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    Submit Request
                  </button>
                </form>
                <button
                  onClick={() => setShowSampleReportModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Sample Report Requested!</h3>
                <p className="text-gray-600">
                  Thanks for reaching out! We&apos;ll send your sample report to your email within 24 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      )}


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
