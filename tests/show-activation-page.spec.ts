/**
 * Opens the post-buy (activation) dashboard in Chromium and keeps it open.
 * Run: npx playwright test tests/show-activation-page.spec.ts --project=chromium --headed
 * Keeps browser open for 5 minutes so you can use the page.
 */

import { test } from '@playwright/test';

const BASE = 'http://localhost:3000';
const ACTIVATION_URL = `${BASE}/c/activate-test?session_id=cs_test_123&demo=1`;

test('Show activation page and keep Chromium open', async ({ page }) => {
  await page.goto(ACTIVATION_URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Instant URL', { timeout: 15000 });
  // Keep browser open for 5 minutes
  await page.waitForTimeout(300000);
});
