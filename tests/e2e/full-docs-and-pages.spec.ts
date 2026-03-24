/**
 * Full referenced-page verification: docs, status, support, legal.
 * Run local: BASE_URL=http://localhost:3000 npx playwright test tests/e2e/full-docs-and-pages.spec.ts
 * Run live:  BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e/full-docs-and-pages.spec.ts
 */

import { test, expect } from "@playwright/test";

const BASE =
  process.env.BASE_URL ||
  process.env.PLAYWRIGHT_BASE_URL ||
  "http://localhost:3000";

const ROUTES: { path: string; bodyMatch: RegExp }[] = [
  { path: "/status", bodyMatch: /System Status|status|support@getsunspire|ok|degraded|down/i },
  { path: "/support", bodyMatch: /support|Support|Contact|help|getsunspire/i },
  { path: "/docs/setup", bodyMatch: /setup|Setup|domain|Domain|docs/i },
  { path: "/docs/api", bodyMatch: /api|API|endpoint|docs/i },
  { path: "/docs/embed", bodyMatch: /embed|iframe|Embed|docs/i },
  { path: "/docs/branding", bodyMatch: /brand|Brand|logo|docs/i },
  { path: "/docs/crm", bodyMatch: /CRM|Zapier|Make|webhook|HubSpot/i },
  { path: "/docs/crm/salesforce", bodyMatch: /Salesforce|CRM|docs/i },
  { path: "/docs/crm/hubspot", bodyMatch: /HubSpot|CRM|docs/i },
  { path: "/docs/crm/airtable", bodyMatch: /CRM|docs|Airtable|Supabase/i },
  { path: "/legal/refund", bodyMatch: /refund|Refund|24 hours|setup/i },
  { path: "/legal/terms", bodyMatch: /Terms|terms|refund|subscription/i },
  { path: "/legal/privacy", bodyMatch: /Privacy|privacy|data/i },
  { path: "/legal/accessibility", bodyMatch: /accessibility|Accessibility/i },
  { path: "/legal/cookies", bodyMatch: /cookie|Cookie/i },
  { path: "/pricing", bodyMatch: /pricing|Pricing|plan|Plan/i },
  { path: "/methodology", bodyMatch: /methodology|Methodology|solar|NREL/i },
];

for (const { path, bodyMatch } of ROUTES) {
  test(`Page loads: ${path}`, async ({ page }) => {
    const res = await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
    expect(res?.status(), `Expected 200 for ${path}`).toBe(200);
    // Wait for client-rendered content (some pages are SPA-like)
    await page.waitForFunction(
      () => document.body?.innerText?.length > 50,
      { timeout: 10000 }
    ).catch(() => null);
    const body = await page.locator("body").innerText().catch(() => "");
    expect(body, `Body of ${path} should match ${bodyMatch}`).toMatch(bodyMatch);
  });
}
