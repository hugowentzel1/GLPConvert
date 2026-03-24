/**
 * Production synthetic: homeowner quote flow.
 * Verifies demo/homeowner page → address/quote → report → CTA.
 * Run with SYNTHETIC_BASE_URL (and optionally SYNTHETIC_TEST_ADDRESS) set.
 * Do not complete real payments.
 */
import { test, expect } from '@playwright/test';

const BASE = process.env.SYNTHETIC_BASE_URL || process.env.BASE_URL || 'https://sunspire-web-app.vercel.app';
const TEST_ADDRESS = process.env.SYNTHETIC_TEST_ADDRESS || '1600 Amphitheatre Parkway, Mountain View, CA 94043';
const TEST_LAT = process.env.SYNTHETIC_TEST_LAT || '37.422';
const TEST_LNG = process.env.SYNTHETIC_TEST_LNG || '-122.084';
const TEST_STATE = process.env.SYNTHETIC_TEST_STATE || 'CA';

test.describe('Homeowner production flow (synthetic)', () => {
  test('homeowner quote flow: page load → report → CTA visible', async ({ page }) => {
    const homeownerUrl = `${BASE}/?company=SynthTest&demo=1`;
    await page.goto(homeownerUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await expect(page).toHaveURL(/\?.*company=SynthTest|demo=1/);
    await expect(page.locator('body')).toContainText(/solar|quote|Solar|Quote/i, { timeout: 15000 });

    const body = await page.locator('body').innerText();
    expect(body.length).toBeGreaterThan(200);

    const reportUrl = `${BASE}/report?company=SynthTest&demo=1&address=${encodeURIComponent(TEST_ADDRESS)}&lat=${TEST_LAT}&lng=${TEST_LNG}&state=${TEST_STATE}&placeId=synthetic`;
    await page.goto(reportUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    await expect(page.locator('[data-testid="report-page"]')).toBeVisible({ timeout: 25000 });
    const reportBody = await page.locator('body').innerText();
    expect(reportBody).toMatch(/nrel|pvwatts|annual|production|kwh|estimate|savings/i);
    expect(/\d{4,}/.test(reportBody)).toBe(true);

    const cta = page.locator('[data-testid="report-cta-footer"], [data-testid="report-bottom-cta"], [data-testid="unlock-report-cta"]').first();
    await expect(cta).toBeVisible({ timeout: 10000 });

    const hasError = await page.locator('text=Error Loading Report').isVisible().catch(() => false);
    expect(hasError).toBe(false);
  });
});
