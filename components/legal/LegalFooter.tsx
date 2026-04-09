'use client';

import Image from 'next/image';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useSearchParams } from 'next/navigation';
import { PRODUCT_NAME, PLATFORM_DISPLAY_NAME, SUPPORT_EMAIL } from '@/lib/product-identity';

export default function LegalFooter({ 
  hideMarketingLinks = false, 
  showPoweredBy = true, 
  brand 
}: { 
  hideMarketingLinks?: boolean; 
  showPoweredBy?: boolean; 
  brand?: string 
}) {
  const b = useBrandTakeover();
  const searchParams = useSearchParams();
  
  // Use passed brand prop or fall back to brand takeover, or use URL parameter
  const urlCompany = searchParams?.get('company');
  const urlLogo = searchParams?.get('logo');
  const urlBrandColor = searchParams?.get('brandColor') || searchParams?.get('primary');
  const companyName = brand || (b.enabled && b.brand ? b.brand : (urlCompany || PRODUCT_NAME));
  const brandColor = urlBrandColor ? `#${urlBrandColor.replace('#', '')}` : (b.enabled && b.primary ? b.primary : '#d97706');
  const logoUrl = b.logo || urlLogo;
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
  
  // Check if this is demo mode
  const isDemo = searchParams?.get('demo') === '1' || searchParams?.get('demo') === 'true';

  // Function to create URLs with preserved parameters
  const createUrlWithParams = (path: string) => {
    const params = new URLSearchParams();
    if (urlCompany) params.set('company', urlCompany);
    if (searchParams?.get('demo')) params.set('demo', searchParams?.get('demo') || '1');
    if (searchParams?.get('brandColor')) params.set('brandColor', searchParams?.get('brandColor') || '');
    if (searchParams?.get('logo')) params.set('logo', searchParams?.get('logo') || '');

    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 via-white to-gray-100 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center">
          {/* Company Logo & Name */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isDemo ? PLATFORM_DISPLAY_NAME : (companyName || 'Your Company')}
            </h3>
            {!isDemo && proxiedLogoUrl && (
              <Image
                src={proxiedLogoUrl}
                alt={`${companyName || 'Your Company'} logo`}
                width={48}
                height={48}
                className="h-12 w-12 rounded-lg object-contain"
                unoptimized
              />
            )}
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-lg">
              Legal & Support
            </h4>
            <div className="space-y-3">
              <a
                href={createUrlWithParams("/privacy")}
                className="block text-gray-600 hover:opacity-80 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href={createUrlWithParams("/terms")}
                className="block text-gray-600 hover:opacity-80 transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href={createUrlWithParams("/security")}
                className="block text-gray-600 hover:opacity-80 transition-colors duration-200"
              >
                Security
              </a>
              <a
                href={createUrlWithParams("/dpa")}
                className="block text-gray-600 hover:opacity-80 transition-colors duration-200"
              >
                DPA
              </a>
              <a
                href={createUrlWithParams("/do-not-sell")}
                className="block text-gray-600 hover:opacity-80 transition-colors duration-200"
              >
                Do Not Sell My Data
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-lg">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-gray-500">
              <p className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:opacity-80 transition-colors">{SUPPORT_EMAIL}</a>
              </p>
              <p className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                +1 (404) 770-2672
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section - Mobile: centered stack, Desktop: 3-column grid */}
        <div className="border-t border-gray-200 pt-10">
          {/* Mobile layout - simple centered stack */}
          <div className="flex flex-col md:hidden gap-3 text-center">
            <p className="flex items-center justify-center text-xs text-gray-500">
              <span className="mr-1.5">⚡</span>
              <span>Educational and booking purposes only. Not medical advice. A licensed provider determines final eligibility.</span>
            </p>
            <p className="text-gray-600 text-xs">
              <span className="font-medium" style={{ color: brandColor }}>{PRODUCT_NAME}</span> — Wellspire LLC
            </p>
            <p className="flex items-center justify-center text-xs text-gray-500">
              <span className="mr-1.5">🗺️</span>
              <span>Mapping & location data © Google</span>
            </p>
          </div>

          {/* Desktop layout - 3-column grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 items-center">
            <div className="flex items-center justify-start text-sm text-gray-500">
              <span className="text-base mr-1.5">⚡</span>
              <span className="leading-tight">Educational and booking purposes only. Not medical advice.</span>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                <span className="font-medium" style={{ color: brandColor }}>{PRODUCT_NAME}</span> — Wellspire LLC
              </p>
            </div>
            <div className="flex items-center justify-end text-sm text-gray-500">
              <span className="text-base mr-1.5">🗺️</span>
              <span className="leading-tight">Mapping & location data © Google</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
