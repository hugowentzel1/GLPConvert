'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { FEATURES } from '@/src/lib/compliance';

// Helper to get default logo URL from Clearbit
const getDefaultLogo = (brand: string) => {
  const brandLower = brand.toLowerCase();
  
  if (brandLower.includes('google')) return 'https://logo.clearbit.com/google.com';
  if (brandLower.includes('microsoft')) return 'https://logo.clearbit.com/microsoft.com';
  if (brandLower.includes('apple')) return 'https://logo.clearbit.com/apple.com';
  if (brandLower.includes('amazon')) return 'https://logo.clearbit.com/amazon.com';
  if (brandLower.includes('meta') || brandLower.includes('facebook')) return 'https://logo.clearbit.com/facebook.com';
  if (brandLower.includes('netflix')) return 'https://logo.clearbit.com/netflix.com';
  if (brandLower.includes('tesla')) return 'https://logo.clearbit.com/tesla.com';
  
  return null;
};

export default function PaidFooter() {
  const b = useBrandTakeover();
  const searchParams = useSearchParams();
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
  const brandName = b.brand || 'Your Company';
  const brandColor = b.primary || '#FF6B35';
  
  const getUrlWithParams = (path: string) => {
    const params = searchParams?.toString();
    return params ? `${path}?${params}` : path;
  };

  // Handler for cookie preferences
  const handleCookiePreferences = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      // Try common CMP APIs
      if ((window as any).__cmp) {
        (window as any).__cmp('open');
      } else if ((window as any).__tcfapi) {
        (window as any).__tcfapi('displayConsentUi', 2, () => {});
      } else {
        // Fallback to route if no CMP available
        window.location.href = '/legal/cookies';
      }
    }
  };

  return (
    <footer className="border-t bg-slate-50/80 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Row 1: Brand (centered) */}
        <div data-testid="footer-brand" className="flex flex-col items-center gap-4 mb-8">
          {proxiedLogoUrl && (
            <Image
              src={proxiedLogoUrl}
              unoptimized
              alt={`${brandName} logo`}
              width={32}
              height={32}
              className="h-8 w-auto object-contain"
            />
          )}
          {brandName && (
            <div className="text-base font-semibold text-slate-800">
              {brandName}
            </div>
          )}
        </div>

        {/* Row 2: Links (centered, evenly spaced) - conditional based on feature flags */}
        <nav data-testid="footer-links" aria-label="Legal and support" className="mb-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Link
                href={getUrlWithParams("/legal/privacy")}
                className="text-slate-600 hover:text-slate-900 transition-colors underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
                style={{ 
                  '--tw-ring-color': brandColor 
                } as React.CSSProperties}
              >
                Privacy Policy
              </Link>
              <span aria-hidden="true" className="text-slate-400">•</span>
            </li>
            <li className="flex items-center gap-3">
              <Link
                href={getUrlWithParams("/legal/terms")}
                className="text-slate-600 hover:text-slate-900 transition-colors underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
                style={{ 
                  '--tw-ring-color': brandColor 
                } as React.CSSProperties}
              >
                Terms of Service
              </Link>
              <span aria-hidden="true" className="text-slate-400">•</span>
            </li>
            {FEATURES.cookiePreferences && (
              <li className="flex items-center gap-3">
                <button
                  onClick={handleCookiePreferences}
                  className="text-slate-600 hover:text-slate-900 transition-colors underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
                  style={{ 
                    '--tw-ring-color': brandColor 
                  } as React.CSSProperties}
                >
                  Cookie Preferences
                </button>
                {FEATURES.cpraDoNotSell && (
                  <span aria-hidden="true" className="text-slate-400">•</span>
                )}
              </li>
            )}
            {FEATURES.cpraDoNotSell && (
              <li className="flex items-center gap-3">
                <Link
                  href="/legal/do-not-sell"
                  className="text-slate-600 hover:text-slate-900 transition-colors underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
                  style={{ 
                    '--tw-ring-color': brandColor 
                  } as React.CSSProperties}
                >
                  Do Not Sell or Share My Personal Information
                </Link>
                <span aria-hidden="true" className="text-slate-400">•</span>
              </li>
            )}
            <li className="flex items-center gap-3">
              <Link
                href={getUrlWithParams("/legal/accessibility")}
                className="text-slate-600 hover:text-slate-900 transition-colors underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
                style={{ 
                  '--tw-ring-color': brandColor 
                } as React.CSSProperties}
              >
                Accessibility
              </Link>
              <span aria-hidden="true" className="text-slate-400">•</span>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-slate-600 hover:text-slate-900 transition-colors underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
                style={{ 
                  '--tw-ring-color': brandColor 
                } as React.CSSProperties}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Row 3: Micro-attribution (centered, subdued) - minimal legal only */}
        <div data-testid="footer-micro" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-500/70">
          <span>
            Powered by{' '}
            <a 
              href="https://getsunspire.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-slate-700 transition-colors"
            >
              Sunspire
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
