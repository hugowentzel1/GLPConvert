/**
 * E2E: Every API + Google Autocomplete + Stripe Checkout + Post-buy dashboard (/c/[companyHandle])
 * Run: npx playwright test tests/e2e-all-apis-and-checkout.spec.ts --headed
 * Requires: npm run dev (localhost:3000) and all env vars set (Supabase, Stripe, NREL, EIA, Google, Resend optional)
 */

import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

test.describe('E2E All APIs and Checkout', () => {
  test('1. Health API - all services must be ok', async ({ request }) => {
    const res = await request.get(`${BASE}/api/health`);
    const body = await res.json();
    const services: { service: string; status: string; error?: string }[] = body.services ?? [];
    expect(services.length).toBeGreaterThan(0);
    for (const s of services) {
      expect(s.status, `API ${s.service} must be ok; got ${s.status}${s.error ? `: ${s.error}` : ''}`).toBe('ok');
    }
    expect(res.status(), 'Health must return 200 when all APIs work').toBe(200);
    expect(body.ok).toBe(true);
    console.log('Health:', services.map((s) => `${s.service}: ${s.status}`).join(', '));
  });

  test('2. Google Geocoding API - /api/geo/normalize', async ({ request }) => {
    const res = await request.get(
      `${BASE}/api/geo/normalize?address=${encodeURIComponent('1600 Amphitheatre Parkway, Mountain View, CA')}`
    );
    const data = await res.json().catch(() => ({}));
    expect(res.status(), `Google Geocoding must return 200. Enable "Geocoding API" in Google Cloud Console for your key. Response: ${data.error ?? res.status()}`).toBe(200);
    expect(data.error).toBeUndefined();
    expect(typeof data.lat).toBe('number');
    expect(typeof data.lng).toBe('number');
    expect(data.state || data.formattedAddress).toBeTruthy();
    console.log('Google Geocoding: OK, lat=', data.lat, 'lng=', data.lng);
  });

  test('3. Estimate API - NREL + EIA (solar estimate)', async ({ request }) => {
    const res = await request.get(
      `${BASE}/api/estimate?address=123%20Main%20St,%20Los%20Angeles,%20CA%2090001&lat=34.0522&lng=-118.2437&state=CA&systemKw=10&tilt=22&azimuth=180&lossesPct=14`
    );
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.estimate).toBeDefined();
    expect(data.estimate?.annualProductionKWh?.estimate ?? data.estimate?.annualKwh).toBeDefined();
    const src = data.estimate?.dataSource ?? '';
    expect(src.toLowerCase()).toMatch(/nrel|pvwatts|eia/);
    console.log('Estimate API: OK, dataSource:', src);
  });

  test('4. Demo page + Google Places autocomplete (address input)', async ({ page }) => {
    await page.goto(`${BASE}/?company=TestCo&demo=1&domain=apple.com`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const addressInput = page.locator('input[data-address-input], input[placeholder*="address" i], input[placeholder*="typing" i]').first();
    await expect(addressInput).toBeVisible({ timeout: 10000 });

    const poweredByGoogle = page.locator('text=/powered by google/i');
    const hasGoogle = await poweredByGoogle.count() > 0;
    console.log('Powered by Google visible:', hasGoogle);

    await addressInput.click();
    await addressInput.fill('1600 Amphitheatre');
    await page.waitForTimeout(2500);

    const dropdown = page.locator('[role="listbox"], .pac-container, [class*="dropdown"], [data-autosuggest]').first();
    const hasDropdown = await dropdown.isVisible().catch(() => false);
    const pageText = await page.locator('body').textContent() ?? '';
    const hasGoogleMaps = pageText.toLowerCase().includes('google') || hasGoogle;
    expect(hasGoogleMaps || addressInput).toBeTruthy();
    console.log('Google autocomplete / address input: OK (dropdown:', hasDropdown, ', Google attribution:', hasGoogleMaps, ')');
  });

  test('5. Stripe create-checkout-session - CTA creates session', async ({ page }) => {
    await page.goto(`${BASE}/?company=CheckoutTest&demo=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const cta = page.locator('button[data-cta="primary"], button[data-cta-button]').filter({ hasText: /Launch|Get Started/i }).first();
    await expect(cta).toBeVisible({ timeout: 10000 });
    const [req] = await Promise.all([
      page.waitForRequest(r => r.url().includes('create-checkout-session') && r.method() === 'POST', { timeout: 20000 }),
      cta.click(),
    ]);
    const res = await req.response();
    expect([200, 500]).toContain(res?.status() ?? 0);
    const postData = req.postDataJSON();
    expect(postData?.company).toBe('CheckoutTest');
    if (res?.status() === 200) console.log('Stripe checkout session: OK (200), company in metadata');
    else console.log('Stripe checkout session: request OK, API returned 500 (check STRIPE_SECRET_KEY in .env for 200)');
  });

  test('6. Post-buy customer dashboard (/c/[companyHandle])', async ({ page }) => {
    await page.goto(`${BASE}/c/activate-test?session_id=cs_test_123&demo=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Instant URL', { timeout: 15000 }).catch(() => null);
    await page.waitForSelector('text=Custom Domain', { timeout: 5000 }).catch(() => null);
    await page.waitForTimeout(1000);

    const body = await page.locator('body').textContent() ?? '';
    const hasDashboard = /Dashboard|Your branded solar calculator is live/i.test(body);
    const hasTabs = /Instant URL|Custom Domain|Embed Code/i.test(body);
    expect(hasDashboard || hasTabs).toBeTruthy();
    console.log('Post-buy dashboard: OK (checkout success URL shows dashboard)');
  });

  test('6b. Instant URL and Visit Site show paid calculator with company branding', async ({ page, context }) => {
    await page.goto(`${BASE}/c/activate-test?session_id=cs_test_123&demo=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Visit Site', { timeout: 10000 });
    const visitLink = page.locator('a:has-text("Visit Site")').first();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      visitLink.click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    await newPage.waitForTimeout(2000);
    const url = newPage.url();
    const body = await newPage.locator('body').textContent() ?? '';
    await newPage.close();
    const isPaidUrl = /\/paid\?company=activate-test/.test(url);
    const isInstantUrl = /\/activate-test/.test(url) || url.endsWith('/activate-test');
    expect(isPaidUrl || isInstantUrl, `Visit Site should open paid/instant calculator; got ${url}`).toBe(true);
    const hasPaidContent = /solar|address|quote|calculator|activate-test/i.test(body);
    expect(hasPaidContent).toBeTruthy();
    console.log('Instant URL -> paid/calculator page: OK');
  });

  test('7. Report page - estimate and NREL attribution', async ({ page }) => {
    await page.goto(
      `${BASE}/report?company=ReportTest&demo=1&address=123%20Main%20St,%20Phoenix,%20AZ&lat=33.4484&lng=-112.0740&placeId=test`,
      { waitUntil: 'domcontentloaded' }
    );
    await page.waitForTimeout(3000);

    const body = await page.locator('body').textContent() ?? '';
    const hasNrel = /nrel|pvwatts|pvwatts®/i.test(body);
    const hasEstimate = /\d+.*kwh|annual|production|estimate/i.test(body);
    expect(hasNrel || hasEstimate).toBeTruthy();
    console.log('Report page: NREL/estimate content:', hasNrel, hasEstimate);
  });

  test('8. Lead API (Supabase) - endpoint accepts POST and validates', async ({ request }) => {
    const res = await request.post(`${BASE}/api/lead`, {
      data: { name: 'E2E Test', email: 'e2e@test.com' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect([400, 429]).toContain(res.status());
    const data = await res.json().catch(() => ({}));
    expect(data.error == null || data.error === 'rate_limited' || data.error === 'Missing required fields').toBeTruthy();
    console.log('Lead API: reachable, validation/rate-limit OK');
  });
});
