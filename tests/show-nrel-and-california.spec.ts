/**
 * Opens Chromium (headed) and shows:
 * 1. Footer with NREL PVWatts disclaimer
 * 2. Privacy page California (CCPA) section
 *
 * Run (with npm run dev on port 3000):
 *   npx playwright test tests/show-nrel-and-california.spec.ts --project=chromium --headed
 */

import { test } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test('Show NREL disclaimer in footer and California section on Privacy', async ({ page }) => {
  // 1. Homepage — scroll to footer to show NREL disclaimer
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  // Highlight the NREL/footer area
  const footer = page.locator('footer').first();
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(5000);

  // 2. Privacy page — scroll to California (CCPA) section
  await page.goto(`${BASE}/privacy`, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=California Residents (CCPA/CPRA)', { timeout: 10000 });
  const calSection = page.locator('section:has(h2:has-text("California Residents"))').first();
  await calSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(8000);
});
