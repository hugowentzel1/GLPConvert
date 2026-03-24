"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useCompany } from './CompanyContext';
import { useIsDemo } from '@/src/lib/isDemo';

export default function SharedNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const b = useBrandTakeover();
  const { company } = useCompany();
  const isDemo = useIsDemo();

  // Function to create URLs with preserved parameters
  const createUrlWithParams = (path: string) => {
    const params = new URLSearchParams();
    if (searchParams?.get('company')) params.set('company', searchParams?.get('company') || '');
    if (searchParams?.get('demo')) params.set('demo', searchParams?.get('demo') || '');
    if (searchParams?.get('brandColor')) params.set('brandColor', searchParams?.get('brandColor') || '');
    if (searchParams?.get('logo')) params.set('logo', searchParams?.get('logo') || '');
    if (searchParams?.get('domain')) params.set('domain', searchParams?.get('domain') || '');

    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
  };
  
  // Don't render on pages that have their own custom banners
  if (pathname === '/report' || pathname === '/demo-result') {
    return null;
  }

  // No header on status page (single clean “System Status” title only; avoids double header)
  if (pathname === '/status') {
    return null;
  }

  // Hide main site header on customer dashboard/activation area (post-purchase portal)
  if (pathname?.startsWith('/c/')) {
    return null;
  }

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
  const proxiedLogoUrl = logoUrl ? getProxiedLogoUrl(logoUrl) : null;

  const handleLaunchClick = async () => {
    if (b.enabled) {
      // Start Stripe checkout with tracking
      try {
        // Collect tracking parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const company = urlParams.get('company');
        const utm_source = urlParams.get('utm_source');
        const utm_campaign = urlParams.get('utm_campaign');
        
        // Capture current page URL for cancel redirect
        const cancel_url = window.location.href;
        
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
        console.error('Checkout error:', error);
        alert('Unable to start checkout. Please try again.');
      }
    } else {
      // Default demo behavior
      window.location.href = '/demo-result';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200/30 shadow-sm" data-testid="main-site-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center md:justify-between items-center h-20">
          <Link href={createUrlWithParams("/")} className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
            {b.enabled && proxiedLogoUrl ? (
              <Image
                src={proxiedLogoUrl}
                unoptimized
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
              <h1 className="text-2xl font-black text-[var(--brand-primary)]">
                {b.enabled ? b.brand : 'Your Company'}
              </h1>
              <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
                Solar Intelligence
              </p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-12">
            {/* Demo mode: Show Pricing/Partners/Support + Activation CTA */}
            {isDemo ? (
              <>
                <Link href={createUrlWithParams("/pricing")} className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium">Pricing</Link>
                <Link href={createUrlWithParams("/partners")} className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium">Partners</Link>
                <Link href={createUrlWithParams("/support")} className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium">Support</Link>
                <button 
                  onClick={handleLaunchClick}
                  className="btn-primary ml-12 inline-flex items-center justify-center"
                >
                  <span className="mr-3">⚡</span>
                  <span>Launch Your Branded Version Now</span>
                </button>
              </>
            ) : (
              // Paid mode: No installer-facing links or activation CTA
              <div className="text-sm text-gray-600">
                {/* Minimal paid navigation - can add report/support later if needed */}
              </div>
            )}
          </nav>
        </div>
      </div>
      
      {/* Disclaimer Footer - Only show in demo mode */}
      {isDemo && (
        <div className="border-t border-gray-100 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <p className="text-xs text-gray-500 text-center">
              Private demo for {b.brand || 'Your Company'}. Not affiliated.
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
