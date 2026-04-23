"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useCompany } from './CompanyContext';
import { useIsDemo } from '@/src/lib/isDemo';
import { LAUNCH_BRANDED_CTA_LABEL, PRODUCT_NAME } from '@/lib/product-identity';
import { companyLabelFromSearchParams } from '@/lib/company';
import { buildAppHomeHref, buildIntakePricingHref, buildMarketingPathHref } from '@/lib/glp-intake-nav-href';

function companyLabelForPricing(
  sp: { get(name: string): string | null } | null,
  fallback: string,
) {
  const raw = sp?.get("company");
  if (!raw?.trim()) return fallback;
  try {
    return decodeURIComponent(raw.trim());
  } catch {
    return raw.trim();
  }
}

export default function SharedNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const b = useBrandTakeover();
  const { company } = useCompany();
  const isDemo = useIsDemo();

  const homeHref = useMemo(() => buildAppHomeHref(searchParams), [searchParams]);
  const companyFallback = company.companyName || "Your clinic";
  const pricingLabel = useMemo(
    () => companyLabelForPricing(searchParams, companyFallback),
    [searchParams, companyFallback],
  );
  const pricingHref = useMemo(
    () => buildIntakePricingHref(searchParams, pricingLabel),
    [searchParams, pricingLabel],
  );
  const toPath = (path: string) => buildMarketingPathHref(searchParams, path);
  
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

  const queryBrandLabel = companyLabelFromSearchParams(searchParams);
  const navTitle = b.enabled
    ? b.brand
    : (queryBrandLabel ?? company.companyName);

  return (
    <header className="bg-white border-b border-gray-200/30 shadow-sm" data-testid="main-site-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 min-w-0 items-center justify-center gap-4 md:justify-between">
          <Link
            href={homeHref}
            className="flex min-w-0 items-center gap-4 transition-opacity hover:opacity-80 md:min-w-0 md:flex-1"
          >
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
                <span className="text-white text-lg font-bold" aria-hidden>
                  ⚕️
                </span>
              </div>
            )}
            <div className="min-w-0 text-left">
              <h1 className="truncate text-2xl font-black text-[var(--brand-primary)]">
                {navTitle}
              </h1>
              <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
                {b.enabled ? "Branded intake" : isDemo ? "Branded preview" : PRODUCT_NAME}
              </p>
            </div>
          </Link>
          
          <nav
            className="hidden shrink-0 text-sm md:flex"
            aria-label={isDemo ? "Demo navigation" : "Site links"}
          >
            {isDemo ? (
              <div className="flex items-center gap-5 lg:gap-6">
                <Link
                  href={toPath("/pricing")}
                  className="shrink-0 font-medium text-gray-600 transition-colors hover:text-[var(--brand-primary)]"
                >
                  Pricing
                </Link>
                <Link
                  href={toPath("/partners")}
                  className="shrink-0 font-medium text-gray-600 transition-colors hover:text-[var(--brand-primary)]"
                >
                  Partners
                </Link>
                <Link
                  href={toPath("/support")}
                  className="shrink-0 font-medium text-gray-600 transition-colors hover:text-[var(--brand-primary)]"
                >
                  Support
                </Link>
                <Link
                  href={pricingHref}
                  className="btn-primary inline-flex shrink-0 items-center justify-center px-5 py-2.5 text-sm font-semibold"
                  data-demo-nav-activate
                  data-intake-nav-activate
                >
                  <span className="mr-3" aria-hidden>
                    ⚡
                  </span>
                  <span>{LAUNCH_BRANDED_CTA_LABEL}</span>
                </Link>
              </div>
            ) : (
              <details className="group relative">
                <summary className="cursor-pointer list-none rounded-lg px-2 py-1.5 font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-[var(--brand-primary)] [&::-webkit-details-marker]:hidden">
                  Legal & help
                </summary>
                <div className="absolute right-0 top-full z-50 mt-2 flex min-w-[180px] flex-col gap-0.5 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <Link
                    href={toPath("/support")}
                    className="px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-[var(--brand-primary)]"
                  >
                    Help
                  </Link>
                  <Link
                    href={toPath("/privacy")}
                    className="px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-[var(--brand-primary)]"
                  >
                    Privacy
                  </Link>
                  <Link
                    href={toPath("/legal/terms")}
                    className="px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-[var(--brand-primary)]"
                  >
                    Terms
                  </Link>
                  <Link
                    href={toPath("/about")}
                    className="px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-[var(--brand-primary)]"
                  >
                    About
                  </Link>
                </div>
              </details>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
