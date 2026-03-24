/**
 * Opens Chromium (headed) with a URL that has customized logo/name so you can
 * verify the header shows the correct company name and logo.
 *
 * Run (with npm run dev on port 3000):
 *   npx playwright test tests/show-url-customized-logo-name.spec.ts --project=chromium --headed
 *
 * Uses: ?company=tesla&demo=1 (Tesla name + Clearbit logo in header)
 */

import { test } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test('Show page with URL-driven customized logo and name', async ({ page }) => {
  // Open homepage with company=tesla so header shows "Tesla" + Tesla logo (Clearbit)
  const url = `${BASE}/?company=tesla&demo=1`;
  await page.goto(url, { waitUntil: 'networkidle' });

  // Wait for header to show customized name (and logo loads)
  await page.waitForSelector('header h1:has-text("Tesla")', { timeout: 10000 });
  await page.waitForTimeout(3000);

  // Optional: also open a second URL with another brand to compare
  await page.goto(`${BASE}/?company=apple&demo=1`, { waitUntil: 'networkidle' });
  await page.waitForSelector('header h1:has-text("Apple")', { timeout: 10000 });
  await page.waitForTimeout(5000);
});
