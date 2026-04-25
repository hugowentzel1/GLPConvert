/**
 * Routes that use `IntakeDemoSiteHeader` in `ConditionalSharedNav`. Also suppress `ConditionalDemoBanner`
 * on these pages so the global DemoChrome strip never stacks under the intake header strip.
 *
 * Goal: every marketing / legal / info page shares the same intake-style chrome (header + branded
 * footer via `BrandedDemoOrDefaultFooter`). Exceptions are the homepage `/` (own hero) and the
 * unbranded `/status` page (intentional bare layout for SLA monitoring).
 */
export const MARKETING_INTAKE_CHROME_PATHS: readonly string[] = [
  "/intake",
  "/privacy",
  "/support",
  "/partners",
  "/pricing",
  "/contact",
  "/terms",
  "/legal/terms",
  "/security",
  "/methodology",
  "/about",
  "/dpa",
  "/do-not-sell",
  "/accessibility",
  "/signup",
] as const;

export function isMarketingIntakeChromePath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (MARKETING_INTAKE_CHROME_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/legal/")) return true;
  if (pathname.startsWith("/intake/")) return true;
  if (pathname.startsWith("/docs/")) return true;
  return false;
}

/** Strip with countdown / copy link — only on the intake flow, not on legal/sales subpages. */
export function isIntakeFlowPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === "/intake" || pathname.startsWith("/intake/");
}
