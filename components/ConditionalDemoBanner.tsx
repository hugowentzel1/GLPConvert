"use client";

import { usePathname, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { isDemoFromSearch } from "@/lib/isDemo";
import { isMarketingIntakeChromePath } from "@/lib/marketing-intake-chrome-paths";

const DemoBanner = dynamic(() => import("@/src/demo/DemoChrome").then(mod => ({ default: mod.DemoBanner })), {
  ssr: false,
  loading: () => null
});

export default function ConditionalDemoBanner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Only show banner in demo mode
  const isDemo = isDemoFromSearch(searchParams || new URLSearchParams());
  if (!isDemo) {
    return null;
  }
  
  // Pages where demo banner should NOT show even in demo mode
  const noBannerPages = [
    '/privacy',
    '/terms', 
    '/dpa',
    '/do-not-sell',
    '/security',
    '/status',
    '/success',
    '/cancel',
    '/signup',
    '/report',
    '/demo-result',
  ];
  // Customer dashboard / activation (post-pay): no "Activate on your domain" etc.
  if (pathname === '/c' || pathname?.startsWith('/c/')) return null;

  // GLP intake and marketing subpages (partners, pricing, …) use `IntakeDemoSiteHeader` — no global strip
  if (isMarketingIntakeChromePath(pathname)) return null;

  // Don't show banner on legal/regulatory pages
  if (noBannerPages.some(page => pathname?.startsWith(page))) {
    return null;
  }
  
  return <DemoBanner />;
}
