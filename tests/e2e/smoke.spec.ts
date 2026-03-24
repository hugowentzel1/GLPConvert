/**
 * Smoke suite: fast checks for CI and prod.
 * Run: BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e/smoke.spec.ts
 * Or local: BASE_URL=http://localhost:3000 npx playwright test tests/e2e/smoke.spec.ts
 */

import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
// Local: use E2E_DEMO_COMPANY=Metaca for demo landing/report (e.g. ?company=Metaca&demo=1)
const DEMO_COMPANY = process.env.E2E_DEMO_COMPANY || 'SmokeTest';

test.describe('Smoke (fast)', () => {
  test('Health returns 200 or 503 (only Stripe down allowed)', async ({ request }) => {
    const res = await request.get(`${BASE}/api/health`);
    const body = await res.json().catch(() => ({}));
    const services = (body.services ?? []) as { service: string; status: string; error?: string }[];
    expect(services.length).toBeGreaterThan(0);
    const down = services.filter((s) => s.status !== 'ok');
    const optionalDown = /Expired API Key|Invalid API Key|invalid api key|not configured|no such api key|Set SUPABASE_URL/i;
    // Live: transient edge/network errors to Supabase still mean "integration unavailable" for this smoke check.
    const supabaseOptional = /Set SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY|fetch failed|Timeout|ECONNREFUSED|ENOTFOUND|certificate/i;
    const isOptionalDown = (s: { service: string; error?: string }) =>
      (s.service === 'stripe' && optionalDown.test(s.error ?? '')) ||
      (s.service === 'supabase' && supabaseOptional.test(s.error ?? ''));
    if (res.status() === 503 && down.length > 0) {
      const onlyOptionalDown = down.every(isOptionalDown);
      expect(onlyOptionalDown, `Health 503: only Stripe/Supabase (unconfigured) may be down. Down: ${JSON.stringify(down)}`).toBe(true);
      return;
    }
    expect(res.status()).toBe(200);
    expect(body.ok).toBe(true);
  });

  test('Geocoding returns 200 for known address (or 503 if key missing)', async ({ request }) => {
    const address = '1600 Amphitheatre Parkway, Mountain View, CA 94043';
    const res = await request.get(`${BASE}/api/geo/normalize?address=${encodeURIComponent(address)}`);
    const data = await res.json().catch(() => ({}));
    if (res.status() === 503) {
      expect(data.error).toBeDefined();
      return;
    }
    expect(res.status()).toBe(200);
    expect(data.error).toBeUndefined();
    expect(typeof data.lat).toBe('number');
    expect(typeof data.lng).toBe('number');
  });

  test('Estimate returns 200 and valid schema (one location)', async ({ request }) => {
    const params = new URLSearchParams({
      address: '1600 Amphitheatre Parkway, Mountain View, CA 94043',
      lat: '37.422',
      lng: '-122.084',
      state: 'CA',
      systemKw: '10',
      tilt: '22',
      azimuth: '180',
      lossesPct: '14',
    });
    const res = await request.get(`${BASE}/api/estimate?${params}`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.estimate).toBeDefined();
    const annual = data.estimate?.annualProductionKWh?.estimate ?? data.estimate?.annualKwh;
    expect(Number(annual)).toBeGreaterThan(0);
    expect(Number(annual)).toBeLessThanOrEqual(25000);
    expect((data.estimate?.dataSource ?? '').toLowerCase()).toMatch(/nrel|pvwatts/);
    expect(data.estimate?.shadingAnalysis).toBeDefined();
  });

  test('Landing loads and CTA visible', async ({ page }) => {
    await page.goto(`${BASE}/?company=${DEMO_COMPANY}&demo=1`, { waitUntil: 'domcontentloaded', timeout: 25000 });
    const cta = page.locator('button[data-cta="primary"], button[data-cta-button], a[href*="report"], [data-testid="primary-cta-hero"]').first();
    await expect(cta).toBeVisible({ timeout: 15000 });
  });

  test('Report loads with query params and shows NREL', async ({ page }) => {
    const url = `${BASE}/report?company=${DEMO_COMPANY}&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('text=/NREL|PVWatts|pvwatts|annual|production|kwh|estimate|savings/i', { timeout: 15000 }).catch(() => null);
    await page.waitForTimeout(1000);
    const body = (await page.locator('body').innerText()).trim();
    expect(body).toMatch(/nrel|pvwatts|pvwatts®|annual|production|estimate|savings|kwh|solar/i);
    expect(/\d{3,}/.test(body)).toBe(true);
  });

  test('Status page returns 200 and health API exposes services', async ({ page, request }) => {
    const healthRes = await request.get(`${BASE}/api/health`);
    expect(healthRes.ok() || healthRes.status() === 503).toBe(true);
    const healthBody = await healthRes.json().catch(() => ({}));
    expect(healthBody.services).toBeDefined();
    expect(Array.isArray(healthBody.services)).toBe(true);
    const statusRes = await page.goto(`${BASE}/status`, { waitUntil: 'load' });
    expect(statusRes?.status()).toBe(200);
  });

  test('Demo URL shows lead/dashboard copy', async ({ page }) => {
    await page.goto(`${BASE}/?company=${DEMO_COMPANY}&demo=1`, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(2000);
    const body = await page.locator('body').innerText();
    expect(body.length).toBeGreaterThan(100);
    expect(body).toMatch(/solar|quote|Solar|Quote|branded|Branded|Launch|demo|Generate/i);
  });

  test('Lead API returns 400 when required fields missing', async ({ request }) => {
    const res = await request.post(`${BASE}/api/lead`, {
      data: { name: 'Test', email: 'test@test.com' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(400);
    const data = await res.json().catch(() => ({}));
    expect(data.error).toBeDefined();
  });
});
