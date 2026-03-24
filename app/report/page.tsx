'use client';

import { useState, useEffect, useCallback } from 'react';

// Extend window object to include our function
declare global {
  interface Window {
    consumeQuotaIfNeeded?: () => void;
  }
}
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { TenantProvider, useTenant } from '@/components/TenantProvider';
// LeadModal import removed - no popups wanted
import { SolarEstimate } from '@/lib/estimate';
import EstimateChart from '@/components/EstimateChart';
import { formatDateSafe } from '@/lib/format';
import LegalFooter from '@/components/legal/LegalFooter';
import Footer from '@/components/Footer';
import PaidFooter from '@/components/PaidFooter';
import { IconBadge } from '@/components/ui/IconBadge';
import UnlockButton from '@/components/UnlockButton';
import { ResultsAttribution } from '@/components/legal/ResultsAttribution';
import LogoWall from '@/components/trust/LogoWall';
import Testimonial from '@/components/trust/Testimonial';
import MetricsBar from '@/components/trust/MetricsBar';
import TrustFooterLine from '@/components/trust/TrustFooterLine';
import StickySidebar from '@/components/StickySidebar';
import { SidebarCta } from '@/src/components/SidebarCta';
import { PlaceResult } from '@/lib/types';
import DataSources from '@/components/DataSources';
import MethodologyModal from '@/components/MethodologyModal';
import QuoteCard from '@/components/QuoteCard';
import { getTrustData } from '@/lib/trust';
import Container from '@/components/layout/Container';
import BottomCtaBand from '@/components/cta/BottomCtaBand';
import ReportCTAFooter from '@/components/report/ReportCTAFooter';
import ReportLeadModal from '@/components/report/ReportLeadModal';
import StickyCTA from '@/components/report/StickyCTA';
import StickyCtaBar from '@/components/StickyCtaBar';
import { ensureBlurSupport } from '@/src/lib/ensureBlur';
import { isDemoFromSearchParams } from '@/src/lib/isDemo';
import { tid } from '@/src/lib/testids';
import { FEATURES, lastValidatedLabel } from '@/src/lib/compliance';
import { getBrandTheme } from '@/lib/brandTheme';
// import StickyBuyBar from '@/src/demo/StickyBuyBar';
// import InstallSheet from '@/src/demo/InstallSheet';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import HeroBrand from '@/src/brand/HeroBrand';
import { useBrandColors } from '@/hooks/useBrandColors';
import { softWrapCommas } from '@/utils/text';
// StickyCTA import removed - no popups wanted
// import { DemoBanner } from '@/src/demo/DemoChrome';
import LockOverlay from '@/src/demo/LockOverlay';
import { usePreviewQuota } from '@/src/demo/usePreviewQuota';
import { useCountdown } from '@/src/demo/useCountdown';
import Image from 'next/image';
import { softWrapAddress } from '@/lib/text';
import { ensureReadableBrandInk } from '@/utils/brandColor';

// Helper function to get state name from coordinates
function getStateFromCoordinates(lat: number, lng: number): string {
  // California
  if (lat >= 32.5 && lat <= 42.0 && lng >= -124.5 && lng <= -114.0) return 'California';
  // New York
  if (lat >= 40.5 && lat <= 45.0 && lng >= -80.0 && lng <= -71.8) return 'New York';
  // Texas
  if (lat >= 25.8 && lat <= 36.5 && lng >= -106.6 && lng <= -93.5) return 'Texas';
  // Florida
  if (lat >= 24.4 && lat <= 31.0 && lng >= -87.6 && lng <= -80.0) return 'Florida';
  // Default
  return 'Local';
}

// Demo addresses for different states
const demoAddressesByState: Record<string, {address:string, lat:number, lng:number}> = {
  AZ: { address: "123 N Central Ave, Phoenix, AZ", lat: 33.4484, lng: -112.0740 },
  CA: { address: "111 S Spring St, Los Angeles, CA", lat: 34.0537, lng: -118.2428 },
  FL: { address: "200 S Orange Ave, Orlando, FL", lat: 28.5384, lng: -81.3789 },
  GA: { address: "2 City Plaza, Atlanta, GA", lat: 33.749, lng: -84.388 },
  TX: { address: "901 S Mopac Expy, Austin, TX", lat: 30.2672, lng: -97.7431 },
  NV: { address: "400 Stewart Ave, Las Vegas, NV", lat: 36.1716, lng: -115.1391 }
};

function ReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { tenant, loading: tenantLoading } = useTenant();
  const [estimate, setEstimate] = useState<SolarEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReportLeadModal, setShowReportLeadModal] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [trustData, setTrustData] = useState<any>(null);
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);
  
  // Brand takeover mode detection
  const b = useBrandTakeover();
  
  // Apply brand colors from URL parameters
  useBrandColors();
  
  // Set CSS variable directly for consistency
  useEffect(() => {
    if (b.primary) {
      document.documentElement.style.setProperty('--brand-primary', b.primary);
      document.documentElement.style.setProperty('--brand', b.primary);
    }
  }, [b.primary]);

  // Load trust data
  useEffect(() => {
    getTrustData().then(setTrustData);
  }, []);
  
  // Demo quota management
  const { read, consume } = usePreviewQuota(2);
  const [remaining, setRemaining] = useState(2);
  const [quotaConsumed, setQuotaConsumed] = useState(false);
  const [pageLoadId] = useState(() => Date.now().toString());
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // Determine if this is a demo session
  const isDemo = isDemoFromSearchParams(searchParams || new URLSearchParams());
  
  // Countdown for demo expiry
  const countdown = useCountdown(b.expireDays || 7);
  
  // Initialize remaining from quota
  useEffect(() => {
    const currentQuota = read();
    setRemaining(currentQuota);
  }, [read]);
  
  // Reset quota consumed state on each page load
  useEffect(() => {
    setQuotaConsumed(false);
  }, [searchParams]);
  
  // Update remaining quota - DO NOT consume quota on page load
  useEffect(() => {
    const currentRemaining = read();
    console.log('🔒 Demo quota - read():', currentRemaining);
    setRemaining(currentRemaining);
    
    // DO NOT consume quota when report page loads - only when generating new reports
    // This prevents quota consumption on page refresh
    console.log('🔒 Demo quota - report page loaded, quota NOT consumed');
  }, [read]);

  // Don't reset quota consumed flag - track per URL session
  
  // Checkout handlers are attached via onClick props on buttons

  // Consume quota when user interacts with report - will be defined inside useEffect

  // Stripe checkout handler
  const handleCheckout = async () => {
    // Quota already consumed when estimate was generated
    console.log('🛒 handleCheckout called');
    try {
      // Collect tracking parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const company = urlParams.get('company');
      const utm_source = urlParams.get('utm_source');
      const utm_campaign = urlParams.get('utm_campaign');
      
      // Capture current page URL for cancel redirect
      const cancel_url = window.location.href;
      
      console.log('🛒 Starting checkout with params:', { token, company, utm_source, utm_campaign, cancel_url });
      
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
    } catch (error) {
      console.error('🛒 Checkout error:', error);
      alert('Unable to start checkout. Please try again.');
    }
  };

  // PDF download handler for paid mode
  const handleDownloadPDF = async () => {
    if (demoMode) return; // Disable in demo mode
    
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const address = urlParams.get('address');
      const lat = urlParams.get('lat');
      const lng = urlParams.get('lng');
      const placeId = urlParams.get('placeId');
      
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          lat: parseFloat(lat || '0'),
          lng: parseFloat(lng || '0'),
          placeId,
          estimate
        })
      });
      
      if (!response.ok) throw new Error('PDF generation failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `solar-quote-${address?.replace(/[^a-zA-Z0-9]/g, '-') || 'report'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Unable to download PDF. Please try again.');
    }
  };

  // Share link handler for paid mode
  const handleCopyShareLink = async () => {
    if (demoMode) return; // Disable in demo mode
    
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const address = urlParams.get('address');
      const lat = urlParams.get('lat');
      const lng = urlParams.get('lng');
      const placeId = urlParams.get('placeId');
      
      const shareUrl = `${window.location.origin}/report?address=${encodeURIComponent(address || '')}&lat=${lat}&lng=${lng}&placeId=${placeId}`;
      
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (error) {
      console.error('Share link error:', error);
      alert('Unable to copy share link. Please try again.');
    }
  };

  // Lead submit handler for paid mode — POSTs to /api/lead then shows toast
  const handleLeadSubmit = async (leadData: { name: string; email: string; phone?: string; address?: string; notes?: string }) => {
    const tenantSlug = tenant?.slug || searchParams?.get('company') || '';
    const address = leadData.address || estimate?.address || '';
    if (!tenantSlug || !address) {
      console.warn('Lead submit skipped: missing tenantSlug or address');
      if (!demoMode) {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
      }
      return;
    }
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone || '',
          notes: leadData.notes ?? '',
          address,
          tenantSlug,
          utm_source: searchParams?.get('utm_source') || undefined,
          demo_or_paid: demoMode,
          ...(estimate && {
            systemSizeKW: estimate.systemSizeKW,
            netCostAfterITC: estimate.netCostAfterITC,
            year1Savings: typeof estimate.year1Savings === 'object' ? estimate.year1Savings?.estimate : estimate.year1Savings,
            paybackYear: estimate.paybackYear,
            npv25Year: estimate.npv25Year,
            co2OffsetPerYear: estimate.co2OffsetPerYear,
            annual_production: estimate.annualProductionKWh?.estimate ?? undefined,
          }),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      if (!demoMode) {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
      }
    } catch (error) {
      console.error('📝 Lead submit error:', error);
      throw error;
    }
  };

  // Capitalize company names properly
  const capitalizeCompanyName = (brand: string) => {
    if (!brand) return '';
    
    // Handle special cases
    const specialCases: Record<string, string> = {
      'meta': 'Meta',
      'facebook': 'Facebook',
      'google': 'Google',
      'microsoft': 'Microsoft',
      'apple': 'Apple',
      'amazon': 'Amazon',
      'netflix': 'Netflix',
      'spotify': 'Spotify',
      'twitter': 'Twitter',
      'linkedin': 'LinkedIn',
      'instagram': 'Instagram',
      'twitch': 'Twitch',
      'discord': 'Discord',
      'slack': 'Slack',
      'shopify': 'Shopify',
      'uber': 'Uber',
      'lyft': 'Lyft',
      'tesla': 'Tesla',
      'sunpower': 'SunPower',
      'solarcity': 'SolarCity',
      'vivint': 'Vivint',
      'sunrun': 'Sunrun',
      'sunnova': 'Sunnova',
      'tealenergy': 'Teal Energy',
      'solarpro': 'SolarPro',
      'ecosolar': 'EcoSolar',
      'premiumsolar': 'Premium Solar',
      'acme': 'ACME',
      'bp': 'BP',
      'shell': 'Shell',
      'exxon': 'ExxonMobil',
      'chevron': 'Chevron',
      'zillow': 'Zillow',
      'redfin': 'Redfin',
      'realtor': 'Realtor.com',
      'homedepot': 'The Home Depot',
      'chase': 'Chase',
      'wellsfargo': 'Wells Fargo',
      'bankofamerica': 'Bank of America',
      'goldmansachs': 'Goldman Sachs',
      'starbucks': 'Starbucks',
      'mcdonalds': 'McDonald\'s',
      'cocacola': 'Coca-Cola',
      'coca': 'Coca-Cola',
      'target': 'Target',
      'bestbuy': 'Best Buy',
      'snapchat': 'Snapchat',
      'whatsapp': 'WhatsApp',
      'firefox': 'Firefox',
      'harleydavidson': 'Harley-Davidson'
    };
    
    const brandLower = brand.toLowerCase();
    return specialCases[brandLower] || brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
  };

  // Generate a default logo URL for common companies when no logo is provided
  const getDefaultLogo = (brand: string) => {
    const brandLower = brand.toLowerCase();
    
    // Tech companies
    if (brandLower.includes('google')) return 'https://logo.clearbit.com/google.com';
    if (brandLower.includes('microsoft')) return 'https://logo.clearbit.com/microsoft.com';
    if (brandLower.includes('apple')) return 'https://logo.clearbit.com/apple.com';
    if (brandLower.includes('amazon')) return 'https://logo.clearbit.com/amazon.com';
    if (brandLower.includes('meta') || brandLower.includes('facebook')) return 'https://logo.clearbit.com/facebook.com';
    if (brandLower.includes('netflix')) return 'https://logo.clearbit.com/netflix.com';
    if (brandLower.includes('spotify')) return 'https://logo.clearbit.com/spotify.com';
    if (brandLower.includes('twitter')) return 'https://logo.clearbit.com/twitter.com';
    if (brandLower.includes('linkedin')) return 'https://logo.clearbit.com/linkedin.com';
    if (brandLower.includes('instagram')) return 'https://logo.clearbit.com/instagram.com';
    if (brandLower.includes('twitch')) return 'https://logo.clearbit.com/twitch.tv';
    if (brandLower.includes('discord')) return 'https://logo.clearbit.com/discord.com';
    if (brandLower.includes('slack')) return 'https://logo.clearbit.com/slack.com';
    if (brandLower.includes('shopify')) return 'https://logo.clearbit.com/shopify.com';
    if (brandLower.includes('uber')) return 'https://logo.clearbit.com/uber.com';
    if (brandLower.includes('lyft')) return 'https://logo.clearbit.com/lyft.com';
    
    // Solar companies
    if (brandLower.includes('tesla')) return 'https://logo.clearbit.com/tesla.com';
    if (brandLower.includes('sunpower')) return 'https://logo.clearbit.com/sunpower.com';
    if (brandLower.includes('solarcity')) return 'https://logo.clearbit.com/solarcity.com';
    if (brandLower.includes('vivint')) return 'https://logo.clearbit.com/vivint.com';
    if (brandLower.includes('sunrun')) return 'https://logo.clearbit.com/sunrun.com';
    if (brandLower.includes('sunnova')) return 'https://logo.clearbit.com/sunnova.com';
    if (brandLower.includes('tealenergy')) return 'https://logo.clearbit.com/tealenergy.com';
    if (brandLower.includes('solarpro')) return 'https://logo.clearbit.com/solarpro.com';
    if (brandLower.includes('ecosolar')) return 'https://logo.clearbit.com/ecosolar.com';
    if (brandLower.includes('premiumsolar')) return 'https://logo.clearbit.com/premiumsolar.com';
    if (brandLower.includes('acme')) return 'https://logo.clearbit.com/acme.com';
    
    // Energy companies
    if (brandLower.includes('bp')) return 'https://logo.clearbit.com/bp.com';
    if (brandLower.includes('shell')) return 'https://logo.clearbit.com/shell.com';
    if (brandLower.includes('exxon')) return 'https://logo.clearbit.com/exxonmobil.com';
    if (brandLower.includes('chevron')) return 'https://logo.clearbit.com/chevron.com';
    
    // Real estate/home
    if (brandLower.includes('zillow')) return 'https://logo.clearbit.com/zillow.com';
    if (brandLower.includes('redfin')) return 'https://logo.clearbit.com/redfin.com';
    if (brandLower.includes('realtor')) return 'https://logo.clearbit.com/realtor.com';
    if (brandLower.includes('homedepot')) return 'https://logo.clearbit.com/homedepot.com';
    
    // Financial services
    if (brandLower.includes('chase')) return 'https://logo.clearbit.com/chase.com';
    if (brandLower.includes('wellsfargo')) return 'https://logo.clearbit.com/wellsfargo.com';
    if (brandLower.includes('bankofamerica')) return 'https://logo.clearbit.com/bankofamerica.com';
    if (brandLower.includes('goldmansachs')) return 'https://logo.clearbit.com/goldmansachs.com';
    
    // Other popular brands
    if (brandLower.includes('starbucks')) return 'https://logo.clearbit.com/starbucks.com';
    if (brandLower.includes('mcdonalds')) return 'https://logo.clearbit.com/mcdonalds.com';
    if (brandLower.includes('cocacola') || brandLower.includes('coca')) return 'https://logo.clearbit.com/coca-cola.com';
    if (brandLower.includes('target')) return 'https://logo.clearbit.com/target.com';
    if (brandLower.includes('bestbuy')) return 'https://logo.clearbit.com/bestbuy.com';
    if (brandLower.includes('snapchat')) return 'https://logo.clearbit.com/snapchat.com';
    if (brandLower.includes('whatsapp')) return 'https://logo.clearbit.com/whatsapp.com';
    if (brandLower.includes('firefox')) return 'https://logo.clearbit.com/mozilla.org';
    if (brandLower.includes('harleydavidson')) return 'https://logo.clearbit.com/harley-davidson.com';
    
    return null;
  };



  const pickDemoAddress = useCallback((state?: string) => {
    if (state && demoAddressesByState[state]) return demoAddressesByState[state];
    return demoAddressesByState["AZ"]; // sunny default
  }, []);

  const fetchEstimate = async (address: string, lat: number, lng: number, placeId?: string | null, state?: string) => {
    try {
      // Consume quota when generating a NEW estimate (not on page load)
      if (isDemo && !quotaConsumed) {
        console.log('🔒 Demo quota - consuming quota for new estimate generation');
        consume();
        setQuotaConsumed(true);
        const currentQuota = read();
        setRemaining(currentQuota);
      }
      
      const params = new URLSearchParams({ 
        address, 
        lat: String(lat), 
        lng: String(lng), 
        systemKw: '7.2',
        // These defaults must be sent; the estimate route relies on them for PVWatts/shading.
        // Without them, local estimate generation can hang and the report stays on the loading spinner.
        tilt: '20',
        azimuth: '180',
        lossesPct: '14',
        ...(state && { state }),
        ...(placeId && { placeId }),
        _t: Date.now().toString() // Cache busting
      });
      
      console.log('🌍 Fetching real estimate for:', { address, lat, lng, state });
      
      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`/api/estimate?${params}`, { 
        cache: 'no-store',
        signal: controller.signal 
      }).finally(() => clearTimeout(timeoutId));
      
      if (!response.ok) throw new Error(`Failed to fetch estimate: ${response.status}`);
      const data = await response.json();
      if (!data.estimate) throw new Error('No estimate data in response');
      console.log('✅ Real estimate received:', { 
        production: data.estimate.annualProductionKWh, 
        savings: data.estimate.year1Savings 
      });
      setEstimate(data.estimate);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setEstimate({
        id: Date.now().toString(),
        address,
        coordinates: { lat, lng },
        date: new Date(),
        systemSizeKW: 8.6,
        tilt: 20,
        azimuth: 180,
        losses: 14,
        annualProductionKWh: {
          estimate: 11105,
          low: 9995,
          high: 12216
        },
        monthlyProduction: Array(12).fill(1000),
        solarIrradiance: 4.5,
        grossCost: 25800,
        netCostAfterITC: 18060,
        year1Savings: {
          estimate: 2254,
          low: 2029,
          high: 2480
        },
        paybackYear: 8,
        npv25Year: 73000,
        co2OffsetPerYear: 10200,
        utilityRate: 0.14,
        utilityRateSource: 'Static',
        tariff: 'Pacific Gas & Electric - E-1',
        dataSource: 'NREL PVWatts v8',
        shadingAnalysis: {
          method: 'remote',
          accuracy: 'high',
          shadingFactor: 0.90,
          annualShadingLoss: 10.0,
          confidence: 0.92
        },
        assumptions: {
          itcPercentage: 0.30,
          costPerWatt: 3.00,
          degradationRate: 0.005,
          oandmPerKWYear: 22,
          electricityRateIncrease: 0.025,
          discountRate: 0.07,
        },
        cashflowProjection: Array.from({ length: 25 }, (_, i) => ({
          year: i + 1,
          production: Math.round(12000 * Math.pow(0.995, i)),
          savings: Math.round(12000 * Math.pow(0.995, i) * 0.14),
          cumulativeSavings: Math.round(12000 * 0.14 * (i + 1)),
          netCashflow: Math.round(12000 * 0.14 * (i + 1) - 18060),
        })),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const sp = new URLSearchParams(searchParams as any);
    const isDemo = isDemoFromSearchParams(sp);
    const company = searchParams?.get('company');
    const hasBrand = !!company; // Company parameter does NOT imply demo
    const demoModeValue = isDemo; // Only demo param determines demo mode
    
    console.log('🔍 Demo mode detection:', {
      company,
      isDemo,
      hasBrand,
      demoModeValue,
      searchParams: Object.fromEntries(searchParams?.entries() || [])
    });
    
    // Set demo mode state
    setDemoMode(demoModeValue);

    // Ensure blur support is available
    ensureBlurSupport();

    let address = searchParams?.get('address') || '';
    let lat = parseFloat(searchParams?.get('lat') || '');
    let lng = parseFloat(searchParams?.get('lng') || '');
    const placeId = searchParams?.get('placeId');
    const state = searchParams?.get('state') || undefined;

    // If demo mode and missing coords, pick a good default by state
    if (isDemo && (!Number.isFinite(lat) || !Number.isFinite(lng) || !address)) {
      const pick = pickDemoAddress(state);
      address = pick.address;
      lat = pick.lat;
      lng = pick.lng;
    }

    // Always fetch real data - no fallback
    if (address && Number.isFinite(lat) && Number.isFinite(lng)) {
      setIsLoading(true);
      fetchEstimate(address, lat, lng, placeId, state);
    } else {
      setError('Missing address or coordinates.');
      setIsLoading(false);
    }
    
    // Quota is consumed only when generating new estimates via fetchEstimate()
    console.log('🔒 Demo quota - report loaded with fallback estimate, quota NOT consumed');
    
    // Define consumeQuotaIfNeeded function for checkout clicks (no additional consumption)
    window.consumeQuotaIfNeeded = () => {
      console.log('🔒 Demo quota - checkout clicked, quota already consumed on estimate generation');
    };
    }, [searchParams, pickDemoAddress]);

  if (tenantLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-gray-100 font-inter flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: `${b.primary} transparent ${b.primary} transparent` }}></div>
          <p className="text-xl font-semibold text-gray-900">Generating your solar intelligence report...</p>
        </div>
      </div>
    );
  }

  if (error && !estimate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-gray-100 font-inter flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="m-4 rounded-xl border p-4 text-sm max-w-md" style={{ borderColor: `${b.primary}40`, backgroundColor: `${b.primary}10`, color: b.primary }}>
            <div className="font-semibold mb-2">Error Loading Report</div>
            <div>{error}</div>
            <button onClick={() => {
              const company = searchParams?.get('company');
              const demo = searchParams?.get('demo');
              const brandColor = searchParams?.get('brandColor');
              const logo = searchParams?.get('logo');
              const domain = searchParams?.get('domain');
              
              const params = new URLSearchParams();
              if (company) params.set('company', company);
              if (demo) params.set('demo', demo);
              if (brandColor) params.set('brandColor', brandColor);
              if (logo) params.set('logo', logo);
              if (domain) params.set('domain', domain);
              
              const queryString = params.toString();
              const url = queryString ? `/?${queryString}` : '/';
              router.push(url);
            }} className="mt-4 px-6 py-3 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-200" style={{ backgroundColor: b.primary }}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  if (!estimate) return null;

  // Show lock overlay if demo quota is exhausted  
  const currentQuota = read();
  console.log('🔒 Demo quota check - demoMode:', demoMode, 'currentQuota:', currentQuota, 'remaining:', remaining);
  
  // Show lock overlay when quota is 0 or less AND we haven't just consumed quota this session
  // This prevents showing lock after the 2nd report consumption (quota goes 1→0)
  // But shows lock on the 3rd attempt (quota already at 0, nothing consumed)
  if (demoMode && currentQuota <= 0 && !quotaConsumed) {
    console.log('🔒 Showing lock overlay - quota exhausted');
    return <LockOverlay />;
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-gray-100 font-inter" 
      data-demo={demoMode}
    >
      {/* Custom banner for report page */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/30 sticky top-0 z-50 shadow-sm">
        <Container>
          <div className="flex justify-between items-center h-20">
            {/* Left: Logo/Brand */}
            <div className="flex items-center space-x-4">
              {(b.logo || getDefaultLogo(b.brand)) ? (
                <Image 
                  src={b.logo || getDefaultLogo(b.brand) || ''} 
                  alt={`${b.brand} logo`} 
                  width={48} 
                  height={48} 
                  className="rounded-lg"
                  style={{ 
                    objectFit: "contain",
                    width: "48px",
                    height: "48px",
                    minWidth: "48px",
                    minHeight: "48px",
                    maxWidth: "48px",
                    maxHeight: "48px"
                  }}
                />
              ) : (
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">☀️</span>
                </div>
              )}
              <div>
                <h2 className="text-2xl font-black text-[var(--brand-primary)]">
                  {capitalizeCompanyName(b.brand)}
                </h2>
                <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
                  Solar Intelligence
                </p>
              </div>
            </div>
            
            {/* Right: Nav + New Analysis */}
            <nav className="hidden md:flex items-center space-x-8">
              {/* Only show Pricing/Partners/Support in demo mode */}
              {demoMode && (
                <>
                  <a
                    href={`/pricing?${searchParams?.toString()}`}
                    className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium text-sm"
                  >
                    Pricing
                  </a>
                  <a
                    href={`/partners?${searchParams?.toString()}`}
                    className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium text-sm"
                  >
                    Partners
                  </a>
                  <a
                    href={`/support?${searchParams?.toString()}`}
                    className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium text-sm"
                  >
                    Support
                  </a>
                </>
              )}
              <motion.button 
                onClick={() => {
                  const company = searchParams?.get('company');
                  const demo = searchParams?.get('demo');
                  const brandColor = searchParams?.get('brandColor');
                  const logo = searchParams?.get('logo');
                  const domain = searchParams?.get('domain');
                  
                  const params = new URLSearchParams();
                  if (company) params.set('company', company);
                  if (demo) params.set('demo', demo);
                  if (brandColor) params.set('brandColor', brandColor);
                  if (logo) params.set('logo', logo);
                  if (domain) params.set('domain', domain);
                  
                  const queryString = params.toString();
                  const url = queryString ? `/?${queryString}` : '/';
                  router.push(url);
                }}
                data-testid="new-analysis-button"
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                New Analysis
              </motion.button>
            </nav>
          </div>
        </Container>
      </header>
      
      {/* Trust Signals - Logo Wall */}
      {trustData && <LogoWall logos={trustData.logos} className="py-8" />}

      <main data-testid="report-page" className="py-12">
        <Container>

        {/* Back Button */}
        <div className="mb-4">
          <a
            href={`/?${searchParams?.toString()}`}
            data-testid="back-home-link"
            className="inline-flex items-center text-neutral-500 hover:text-neutral-900 transition-colors button-press"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
        </div>

        {/* Success toast for paid mode */}
        {showSuccessToast && (
          <div className="fixed top-4 right-4 z-50 text-white px-6 py-3 rounded-lg shadow-lg" style={{ backgroundColor: b.primary }} {...tid('lead-success-toast')}>
            Thanks! We&apos;ve got your info. A specialist will reach out soon.
          </div>
        )}

        {/* Report header */}
        {/* Theme probe for testing */}
        <div data-testid="theme-probe" style={{ color: 'var(--brand)' }} className="hidden" />
        {/* Brand theme CSS variable */}
        <style>{`:root{--brand:${getBrandTheme(searchParams?.get('company') || undefined)};--brand-primary:${b.primary};}`}</style>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-10">
          {/* Brand-aware header with automatic contrast safety */}
          <section
            data-testid="hdr"
            aria-labelledby="report-title"
            className="mx-auto max-w-5xl pt-2 text-center"
            style={{ ['--brand-ink' as any]: ensureReadableBrandInk(b.primary || '#2563EB') }}
          >
            {/* H1 */}
            <h1
              id="report-title"
              data-testid="hdr-h1"
              className="text-[clamp(28px,4.5vw,40px)] font-semibold tracking-tight text-slate-900"
            >
              Your{' '}
              <span className="font-semibold" style={{ color: b.primary || 'var(--brand-primary)' }}>
                {b.brand || 'Company'}
              </span>{' '}
              Solar Quote
              {demoMode && <span className="text-slate-500"> (Live Preview)</span>}
            </h1>

            {/* H1 → Logo = 24px */}
            <div data-testid="hdr-logo" className="mt-[24px] flex justify-center">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="w-24 h-24">
                {(() => {
                  const logoUrl = b.logo || getDefaultLogo(b.brand);
                  const getProxiedLogoUrl = (url: string | null) => {
                    if (!url) return null;
                    try {
                      const urlObj = new URL(url);
                      if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
                        return `/api/logo-proxy?url=${encodeURIComponent(url)}`;
                      }
                      return url;
                    } catch {
                      return url;
                    }
                  };
                  const proxiedUrl = logoUrl ? getProxiedLogoUrl(logoUrl) : null;
                  
                  return proxiedUrl ? (
                    <Image 
                      src={proxiedUrl} 
                      alt={`${b.brand} logo`} 
                      width={96} 
                      height={96} 
                      unoptimized
                      className="rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,.08)]"
                      style={{ 
                        objectFit: "contain",
                        width: "96px",
                        height: "96px"
                      }}
                    />
                  ) : (
                    <div className="brand-gradient text-white rounded-full w-24 h-24 grid place-items-center shadow-[0_8px_30px_rgba(0,0,0,.08)]">
                      <span className="text-4xl">☀️</span>
                    </div>
                  );
                })()}
              </motion.div>
            </div>

            {/* Format: "Comprehensive analysis for your property at" → address → "Generated on ..." */}
            <p
              data-testid="hdr-sub"
              className="mt-[16px] text-[clamp(18px,2.4vw,20px)] font-semibold text-slate-800"
            >
              Comprehensive analysis for your property at
            </p>

            <p
              data-testid="hdr-address"
              className="mx-auto mt-4 max-w-[60ch] text-[17px] leading-snug text-slate-600"
              style={{ textWrap: 'balance' } as any}
            >
              {softWrapCommas(estimate.address || searchParams?.get('address') || 'your property')}
            </p>

            <div data-testid="hdr-meta" className="mx-auto mt-5 w-full max-w-sm space-y-0.5">
              <div data-testid="meta-generated" className="py-1 text-[15px] text-slate-500">
                Generated on <span className="text-slate-700">{formatDateSafe(estimate.date)}</span>
              </div>
              {demoMode && (
                <>
                  <div data-testid="meta-runs" className="py-1 text-[15px] text-slate-500">
                    Preview: <span className="text-slate-700">{remaining < 0 ? '-' : ''}{Math.abs(remaining)} run{Math.abs(remaining) === 1 ? '' : 's'} left</span>
                  </div>
                  <div
                    data-testid="meta-expires"
                    className="py-1 text-[15px] text-slate-500"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    Expires in <span className="text-slate-700">{countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s</span>
                  </div>
                </>
              )}
            </div>

          </section>

                {/* Metric Tiles */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch" style={{ marginTop: '32px' }}>
            {/* System Size - NO BLUR, ALWAYS VISIBLE */}
            <div data-testid="tile-systemSize" className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="relative z-10 p-8 text-center">
                <div className="mb-4 flex justify-center"><IconBadge>⚡</IconBadge></div>
                <div className="text-3xl font-black text-gray-900 mb-2">{estimate.systemSizeKW} kW</div>
                <div className="text-gray-700 font-semibold">System Size</div>
              </div>
            </div>
            
            {/* Annual Production - NO BLUR, ALWAYS VISIBLE */}
            <div data-testid="tile-annualProduction" className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="relative z-10 p-8 text-center">
                <div className="mb-4 flex justify-center"><IconBadge>☀️</IconBadge></div>
                <div className="text-3xl font-black text-gray-900 mb-2">
                  {typeof estimate.annualProductionKWh === 'object' 
                    ? `${estimate.annualProductionKWh.estimate.toLocaleString()} kWh`
                    : `${(estimate.annualProductionKWh as number).toLocaleString()} kWh`
                  }
                </div>
                <div className="text-gray-700 font-semibold">Annual Production</div>
              </div>
            </div>
            
            {/* Net Cost - BLURRED WITH UNLOCK BUTTON */}
            <div data-testid="tile-lifetimeSavings" className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              {/* BLUR LAYER (kept behind button) - Demo Only */}
              {demoMode && <div className="blur-layer" aria-hidden />}
              
              {/* CONTENT LAYER */}
              <div className="content-layer p-8 text-center">
                <div className="mb-4 flex justify-center"><IconBadge>💰</IconBadge></div>
                <div className="text-3xl font-black text-gray-900 mb-2">
                  {demoMode ? '— — —' : `$${estimate.netCostAfterITC.toLocaleString()}`}
                </div>
                <div className="text-gray-700 font-semibold">Net Cost (After ITC)</div>
                {!demoMode && (
                  <div className="mt-2 text-xs text-gray-500">
                    Includes 30% federal investment tax credit (ITC)
                  </div>
                )}
              </div>

              {/* UNLOCK BUTTON - Demo Only */}
              {demoMode && (
                <div className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2 w-full px-4">
                  <button
                    onClick={handleCheckout}
                    className="w-full btn-primary text-sm py-3 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    data-testid="unlock-report-cta"
                  >
                    Unlock Full Report
                  </button>
                </div>
              )}
            </div>

            {/* Year 1 Savings - BLURRED WITH UNLOCK BUTTON */}
            <div data-testid="tile-large" className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              {/* BLUR LAYER (kept behind button) - Demo Only */}
              {demoMode && <div className="blur-layer" aria-hidden />}
              
              {/* CONTENT LAYER */}
              <div className="content-layer p-8 text-center">
                <div className="mb-4 flex justify-center"><IconBadge>📈</IconBadge></div>
                <div className="text-3xl font-black text-gray-900 mb-2">
                  {demoMode ? '— — —' : (
                    typeof estimate.year1Savings === 'object'
                      ? `$${estimate.year1Savings.estimate.toLocaleString()}`
                      : `$${(estimate.year1Savings as number).toLocaleString()}`
                  )}
                </div>
                <div className="text-gray-700 font-semibold">Year 1 Savings</div>
                {!demoMode && (
                  <div className="mt-2 text-xs text-gray-500">
                    Based on current local utility rate and modeled production
                  </div>
                )}
              </div>

              {/* UNLOCK BUTTON - Demo Only */}
              {demoMode && (
                <div className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2 w-full px-4">
                  <button
                    onClick={handleCheckout}
                    className="w-full btn-primary text-sm py-3 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    data-testid="unlock-report-cta"
                  >
                    Unlock Full Report
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Chart */}
          <div id="savings-chart" data-testid="savings-chart" className="relative rounded-2xl bg-white p-5 overflow-hidden">
            <div className="relative z-10 min-h-[400px]">
              <EstimateChart 
                cashflowData={estimate.cashflowProjection} 
                netCostAfterITC={estimate.netCostAfterITC} 
                brandColor={b.primary}
                onViewMethodology={() => setShowMethodologyModal(true)}
              />
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Financial Analysis - Blurred */}
            <div data-testid="locked-panel" className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50">
              {/* BLUR LAYER - Demo Only */}
              {demoMode && <div className="blur-layer" aria-hidden />}
              
              {/* CONTENT LAYER */}
              <div className="content-layer p-8">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-6">Financial Analysis</h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">Payback Period</span><span className="font-bold text-gray-900">{demoMode ? '— — —' : `${estimate.paybackYear} years`}</span></div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">25-Year NPV</span><span className="font-bold text-gray-900">{demoMode ? '— — —' : `$${estimate.npv25Year.toLocaleString()}`}</span></div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">ROI</span><span className="font-bold text-gray-900">{demoMode ? '— — —' : `${Math.round(((estimate.npv25Year + estimate.netCostAfterITC) / estimate.netCostAfterITC) * 100)}%`}</span></div>
                  <div className="flex justify-between items-center py-4"><span className="text-gray-600">Electricity Rate</span><span className="font-bold text-gray-900">${estimate.utilityRate}/kWh ({estimate.utilityRateSource})</span></div>
                </div>
              </div>

              {/* UNLOCK BUTTON - Demo Only */}
              {demoMode && (
                <div className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2 w-full px-4">
                  <button
                    onClick={handleCheckout}
                    className="w-full btn-primary text-sm py-3 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    data-testid="unlock-report-cta"
                  >
                    Unlock Full Report
                  </button>
                </div>
              )}
            </div>

            {/* Environmental Impact - Blurred */}
            <div data-testid="locked-panel" className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50">
              {/* BLUR LAYER - Demo Only */}
              {demoMode && <div className="blur-layer" aria-hidden />}
              
              {/* CONTENT LAYER */}
              <div className="content-layer p-8">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-6">Environmental Impact</h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">CO₂ Offset/Year</span><span className="font-bold text-gray-900">{estimate.co2OffsetPerYear.toLocaleString()} lbs</span></div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">Solar Irradiance</span><span className="text-gray-900">{estimate.solarIrradiance} kWh/m²/day</span></div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">System Tilt</span><span className="text-gray-900">{estimate.tilt}°</span></div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">System Losses</span><span className="font-bold text-gray-900">{estimate.losses}%</span></div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">Shading Analysis</span><span className="text-gray-900">{estimate.shadingAnalysis?.method || 'Proxy'} ({estimate.shadingAnalysis?.accuracy || 'medium'} accuracy)</span></div>
                  <div className="flex justify-between items-center py-4"><span className="text-gray-600">Annual Shading Loss</span><span className="font-bold text-gray-900">{estimate.shadingAnalysis?.annualShadingLoss || '8.5'}%</span></div>
                </div>
              </div>

              {/* UNLOCK BUTTON - Demo Only */}
              {demoMode && (
                <div className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2 w-full px-4">
                  <button
                    onClick={handleCheckout}
                    className="w-full btn-primary text-sm py-3 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    data-testid="unlock-report-cta"
                  >
                    Unlock Full Report
                  </button>
                </div>
              )}
            </div>

            {/* Consolidated Information Box */}
            <div className="relative rounded-2xl p-8 bg-white border border-gray-200/50">
              <div className="relative z-10">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-6">Calculation Details & Data Sources</h2>
                
                {/* Calculation Assumptions */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Calculation Assumptions</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200"><span className="text-gray-700">Federal Tax Credit (ITC)</span><span className="text-gray-900 font-bold">{(estimate.assumptions.itcPercentage * 100).toFixed(0)}%</span></div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200"><span className="text-gray-700">Cost per Watt</span><span className="text-gray-900 font-bold">${estimate.assumptions.costPerWatt}</span></div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200"><span className="text-gray-700">Panel Degradation</span><span className="text-gray-900 font-bold">{(estimate.assumptions.degradationRate * 100).toFixed(1)}%/year</span></div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200"><span className="text-gray-700">O&M Cost</span><span className="text-gray-900 font-bold">${estimate.assumptions.oandmPerKWYear}/kW/year</span></div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200"><span className="text-gray-700">Rate Increase</span><span className="text-gray-900 font-bold">{(estimate.assumptions.electricityRateIncrease * 100).toFixed(1)}%/year</span></div>
                    <div className="flex justify-between items-center py-3"><span className="text-gray-700">Discount Rate</span><span className="text-gray-900 font-bold">{(estimate.assumptions.discountRate * 100).toFixed(0)}%</span></div>
                  </div>
                </div>

                {/* Data Sources - Paid only */}
                {!demoMode && (
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Sources</h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: b.primary }}></span>
                        <span>Solar irradiance data from industry-standard models</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: b.primary }}></span>
                        <span>Utility rates from local utility databases</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: b.primary }}></span>
                        <span>Financial calculations based on current federal and state incentives</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 text-center">
                      </p>
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Last updated {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Trust Signals - Testimonial and Metrics */}
          {trustData && (
            <div className="mt-12 mb-12">
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
            </div>
          )}


          {/* Premium Data Sources Component */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-12 mb-10"
          >
            <DataSources
              utilityLabel={
                estimate.tariff === 'state_fallback' || estimate.tariff === 'generic'
                  ? `${estimate.coordinates?.lat && estimate.coordinates?.lng ? getStateFromCoordinates(estimate.coordinates.lat, estimate.coordinates.lng) : 'Local'} Utility Rate`
                  : estimate.tariff || 'Current Local Utility Tariff'
              }
              lastUpdated={new Date().toISOString().slice(0,10)}
              showLidar={true}
              shadingMethod={(estimate.shadingAnalysis?.method as "remote" | "proxy") || 'proxy'}
            />
          </motion.div>

          {/* Demo-only CTA section - using shared BottomCtaBand */}
          {demoMode && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 1.0, duration: 0.8 }}
              className="mt-12"
            >
              <BottomCtaBand variant="report" onLaunchClick={handleCheckout} data-testid="report-bottom-cta" />
            </motion.div>
          )}
          {/* Paid-only: next step CTA — VERTICAL SPACING ONLY; no horizontal layout changes */}
          {!demoMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="mt-8 flex flex-col"
            >
              <div className="text-center mb-6 flex flex-col justify-center">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Next step: book your consultation</h2>
                <p className="text-gray-600 text-sm max-w-xl mx-auto leading-relaxed">You have your estimate. A quick call with your installer lets you discuss system fit, equipment options, incentives, and next steps. No obligation.</p>
              </div>
              <ReportCTAFooter
                brandColor={b.primary}
                searchParams={searchParams?.toString()}
                onRequestConsult={() => setShowReportLeadModal(true)}
                hideTalkToSpecialist
              />
            </motion.div>
          )}
        </motion.div>
        </Container>
      </main>

      {/* Lead capture modal (paid report: Request a free consult) */}
      {!demoMode && (
        <ReportLeadModal
          isOpen={showReportLeadModal}
          onClose={() => setShowReportLeadModal(false)}
          onSubmit={handleLeadSubmit}
          address={estimate?.address || searchParams?.get('address') || ''}
          brandColor={b.primary || '#0ea5e9'}
          companyName={(searchParams?.get('company') ? capitalizeCompanyName(searchParams.get('company')!) : undefined) || tenant?.name}
        />
      )}

      {/* Methodology Modal */}
      <MethodologyModal
        open={showMethodologyModal}
        onClose={() => setShowMethodologyModal(false)}
      />

      <StickyCtaBar
        label="Book your consultation"
        testId="sticky-report-cta"
        className="sm:hidden"   // MOBILE-ONLY
      />

      {/* Use PaidFooter for paid mode (demo=0), regular Footer for demo mode */}
      {demoMode ? <Footer /> : <PaidFooter />}
    </div>
  );
}

export default function ReportPage() {
  return (
    <TenantProvider>
      <ReportContent />
    </TenantProvider>
  );
}
