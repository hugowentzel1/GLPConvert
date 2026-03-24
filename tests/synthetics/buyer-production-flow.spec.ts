/**
 * Production synthetic: buyer/checkout flow up to session creation.
 * Verifies demo buyer page → upgrade CTA → checkout session created (no real payment).
 * Run with SYNTHETIC_BASE_URL set. We intercept the API and assert success without following Stripe redirect.
 */
import { test, expect } from '@playwright/test';

const BASE = process.env.SYNTHETIC_BASE_URL || process.env.BASE_URL || 'https://sunspire-web-app.vercel.app';

test.describe('Buyer production flow (synthetic)', () => {
  test('buyer flow: page load → checkout CTA → session created, no payment', async ({ page }) => {
    const buyerUrl = `${BASE}/?company=SynthBuyer&demo=1`;
    await page.goto(buyerUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await expect(page).toHaveURL(/\?.*company=SynthBuyer|demo=1/);
    await expect(page.locator('body')).toContainText(/solar|quote|Solar|Launch|branded|demo/i, { timeout: 15000 });

    const body = await page.locator('body').innerText();
    expect(body.length).toBeGreaterThan(200);

    const cta = page.locator('button[data-cta="primary"], button[data-cta-button]').first();
    await expect(cta).toBeVisible({ timeout: 15000 });
    await expect(cta).toBeEnabled({ timeout: 25000 });

    let sessionCreated = false;
    let sessionUrl: string | null = null;
    await page.route('**/api/stripe/create-checkout-session', async (route) => {
      const res = await route.fetch();
      const json = await res.json().catch(() => ({}));
      if (res.ok() && json?.url) {
        sessionCreated = true;
        sessionUrl = json.url;
      }
      await route.fulfill({ response: res });
    });

    await cta.click();
    await page.waitForTimeout(4000);

    expect(sessionCreated, 'Checkout session should be created (API returned url)').toBe(true);
    expect(sessionUrl).toBeTruthy();
    expect(sessionUrl).toMatch(/stripe\.com|checkout/);
  });
});
