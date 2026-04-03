import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/components/ui/sunset-theme.css'
import '@/src/styles/motion.css'
import '@/styles/cta.css'

// Optimize font loading to prevent CLS
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Arial', 'sans-serif']
})
import AppErrorBoundary from '@/components/AppErrorBoundary'
// import DemoRibbon from '@/components/ui/DemoRibbon'
import BrandProvider from '@/src/brand/BrandProvider'
import BrandCSSInjector from '@/components/BrandCSSInjector'
import BootProbe from './BootProbe'
import ConditionalSharedNav from '@/components/ConditionalSharedNav'
import { CompanyProvider } from '@/components/CompanyContext'
import CookieConsent from '@/components/CookieConsent'
import ConditionalDemoBanner from '@/components/ConditionalDemoBanner'
import CookieOffsetProvider from '@/components/cta/CookieOffsetProvider'
import DynamicFavicon from '@/components/DynamicFavicon'

export const metadata: Metadata = {
  title: 'GLPConvert — Wellspire LLC',
  description:
    'White-label pre-consult conversion for GLP-1 / medical weight-loss programs. Booking and education only — not medical advice.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external resources for speed */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://js.stripe.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
      </head>
      <body className={inter.className}>
        <BootProbe />
        <AppErrorBoundary>
          <BrandProvider>
            <CompanyProvider>
              <BrandCSSInjector />
              <DynamicFavicon />
              <CookieOffsetProvider />
              {/* DemoRibbon removed */}
              <ConditionalDemoBanner />
              <ConditionalSharedNav />
              {children}
            </CompanyProvider>
          </BrandProvider>
        </AppErrorBoundary>
        
        {/* Cookie Consent */}
        <CookieConsent />
      </body>
    </html>
  )
}
