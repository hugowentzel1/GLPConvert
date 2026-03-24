'use client';

import { usePathname } from 'next/navigation';
import SharedNavigation from './SharedNavigation';

/**
 * Renders SharedNavigation only when not on a page that should have no main nav.
 * Used so the root layout never injects the nav into /status (avoids double header
 * and guarantees status page has no "Your Company" header).
 */
export default function ConditionalSharedNav() {
  const pathname = usePathname();
  // No nav on status (unbranded), report, demo-result, or customer dashboard. Require pathname so we never flash nav on /status.
  if (!pathname || pathname === '/status') return null;
  if (pathname === '/report' || pathname === '/demo-result') return null;
  // Post-pay activation/dashboard: no main site header (Activate, Pricing, Support, etc.)
  if (pathname === '/c' || pathname?.startsWith('/c/')) return null;
  return <SharedNavigation />;
}
