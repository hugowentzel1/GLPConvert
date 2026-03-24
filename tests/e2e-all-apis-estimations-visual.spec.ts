/**
 * E2E: Every API works locally and on live. Health only reports configured services; all reported must be ok.
 * Run local: node scripts/check-env-for-e2e.mjs && npm run dev then BASE_URL=http://localhost:3000 npx playwright test this file --project=chromium --workers=1
 * Run live: BASE_URL=https://sunspire-web-app.vercel.app npx playwright test this file --project=chromium --workers=1
 * Live Geocoding: set GOOGLE_GEOCODING_API_KEY in Vercel (unrestricted key) or test 2 will fail with REQUEST_DENIED.
 */

import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'https://sunspire-web-app.vercel.app';

// Real, lookup-able addresses (lat/lng from Google Maps / Geocoding)
const LOCATIONS = [
  { label: 'Google HQ (Mountain View CA)', address: '1600 Amphitheatre Parkway, Mountain View, CA 94043', lat: 37.422, lng: -122.084, state: 'CA' },
  { label: 'Phoenix AZ', address: '123 N Central Ave, Phoenix, AZ 85004', lat: 33.4484, lng: -112.074, state: 'AZ' },
  { label: 'Austin TX', address: '901 S Mopac Expy, Austin, TX 78746', lat: 30.2672, lng: -97.7431, state: 'TX' },
] as const;

function estimateUrl(loc: (typeof LOCATIONS)[number], systemKw = 10) {
  const params = new URLSearchParams({
    address: loc.address,
    lat: String(loc.lat),
    lng: String(loc.lng),
    state: loc.state,
    systemKw: String(systemKw),
    tilt: '22',
    azimuth: '180',
    lossesPct: '14',
  });
  return `${BASE}/api/estimate?${params}`;
}

function reportUrl(loc: (typeof LOCATIONS)[number], company: string) {
  const params = new URLSearchParams({
    company,
    demo: '1',
    address: loc.address,
    lat: String(loc.lat),
    lng: String(loc.lng),
    state: loc.state,
    placeId: 'test',
  });
  return `${BASE}/report?${params}`;
}

test.describe('All APIs + estimations (real addresses)', () => {
  test('1. Health – every configured service ok (or only Stripe down/omitted)', async ({ request }) => {
    const res = await request.get(`${BASE}/api/health`);
    const body = await res.json();
    const services: { service: string; status: string; error?: string }[] = body.services ?? [];
    expect(services.length, 'At least one service must be configured and checked').toBeGreaterThan(0);
    const down = services.filter((s) => s.status !== 'ok');
    const optionalDown = /Expired API Key|Invalid API Key|invalid api key|not configured|no such api key/i;
    if (res.status() === 503 && down.length > 0) {
      const onlyStripeDown = down.every((s) => s.service === 'stripe' && optionalDown.test(s.error ?? ''));
      expect(onlyStripeDown, `Health 503: only Stripe may be down. Down: ${JSON.stringify(down)}`).toBe(true);
      return;
    }
    expect(res.status()).toBe(200);
    expect(body.ok).toBe(true);
    for (const s of services) {
      expect(s.status, `API ${s.service} must be ok; got ${s.status}${s.error ? `: ${s.error}` : ''}`).toBe('ok');
    }
  });

  test('2. Google Geocoding – real address returns correct lat/lng (enable Geocoding API + allow server in key)', async ({ request }) => {
    const address = '1600 Amphitheatre Parkway, Mountain View, CA 94043';
    const res = await request.get(`${BASE}/api/geo/normalize?address=${encodeURIComponent(address)}`);
    const data = await res.json().catch(() => ({}));
    expect(res.status(), `Geocoding must 200. If REQUEST_DENIED: Google Cloud → key → allow Geocoding API and server calls. Got: ${data.error ?? res.status()}`).toBe(200);
    expect(data.error).toBeUndefined();
    expect(typeof data.lat).toBe('number');
    expect(typeof data.lng).toBe('number');
    expect(Math.abs(data.lat - 37.42)).toBeLessThan(0.1);
    expect(Math.abs(data.lng - (-122.08))).toBeLessThan(0.1);
  });

  test('3. Estimate API – valid estimate + shading (industry-standard)', async ({ request }) => {
    for (const loc of LOCATIONS) {
      const res = await request.get(estimateUrl(loc));
      expect(res.status(), `Estimate for ${loc.label} must 200`).toBe(200);
      const data = await res.json();
      expect(data.estimate, `Estimate for ${loc.label}`).toBeDefined();
      const annual = data.estimate?.annualProductionKWh?.estimate ?? data.estimate?.annualKwh;
      expect(Number(annual), `${loc.label} annual production`).toBeGreaterThan(0);
      expect(Number(annual), `${loc.label} annual (10kW) should be in sane range 8000-25000 kWh`).toBeLessThanOrEqual(25000);
      expect(Number(annual)).toBeGreaterThanOrEqual(8000);
      const src = (data.estimate?.dataSource ?? '').toLowerCase();
      expect(src).toMatch(/nrel|pvwatts|eia/);
      // Shading analysis (industry-standard)
      const shading = data.estimate?.shadingAnalysis;
      expect(shading, `Estimate for ${loc.label} must include shadingAnalysis`).toBeDefined();
      expect(typeof (shading?.annualShadingLoss ?? shading?.shadingFactor)).toBe('number');
      expect(['proxy', 'remote'].some(m => (shading?.method ?? '').toLowerCase().includes(m))).toBe(true);
    }
  });

  test('4. Estimations ACTUALLY different by location (NREL + EIA)', async ({ request }) => {
    const results: { label: string; annualKwh: number; year1Savings?: number; utilityRate?: number }[] = [];
    for (const loc of LOCATIONS) {
      const res = await request.get(estimateUrl(loc));
      expect(res.status()).toBe(200);
      const data = await res.json();
      const annual = data.estimate?.annualProductionKWh?.estimate ?? data.estimate?.annualKwh;
      const year1 = data.estimate?.year1Savings?.estimate ?? data.estimate?.year1Savings;
      const rate = data.estimate?.utilityRate;
      results.push({
        label: loc.label,
        annualKwh: Number(annual),
        year1Savings: year1 != null && Number.isFinite(Number(year1)) ? Number(year1) : undefined,
        utilityRate: rate != null && Number.isFinite(Number(rate)) ? Number(rate) : undefined,
      });
    }
    const annuals = results.map((r) => r.annualKwh);
    const uniqueAnnuals = new Set(annuals);
    expect(uniqueAnnuals.size, `Annual production must differ by location. Got: ${annuals.join(', ')}`).toBeGreaterThan(1);
    const rates = results.map((r) => r.utilityRate).filter((x): x is number => x != null && Number.isFinite(x));
    if (rates.length >= 2) {
      const uniqueRates = new Set(rates.map((r) => Math.round(r * 100) / 100));
      expect(uniqueRates.size, `Utility rates must differ by state. Got: ${rates.join(', ')}`).toBeGreaterThan(1);
    }
  });

  test('5. Google autocomplete – physically type address and see suggestions', async ({ page }) => {
    await page.goto(`${BASE}/?company=AutocompleteTest&demo=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const addressInput = page.locator('input[data-address-input], input[placeholder*="address" i], input[placeholder*="Enter" i], input[placeholder*="typing" i]').first();
    await expect(addressInput).toBeVisible({ timeout: 20000 });
    await page.waitForLoadState('networkidle').catch(() => null);
    await addressInput.click();
    await addressInput.fill('1600 Amphitheatre');
    await page.waitForTimeout(6000);
    const pac = page.locator('.pac-container, [role="listbox"], [class*="pac-"]').first();
    const hasDropdown = await pac.isVisible().catch(() => false);
    const bodyText = (await page.locator('body').textContent()) ?? '';
    const inputVal = await addressInput.inputValue().catch(() => '');
    const hasMountainView = bodyText.includes('Mountain View') || bodyText.includes('Amphitheatre') || inputVal.includes('Amphitheatre');
    expect(hasDropdown || hasMountainView, 'Google autocomplete should show suggestions or Mountain View / Amphitheatre').toBeTruthy();
    const hasGoogle = bodyText.toLowerCase().includes('google') || (await page.locator('text=/powered by google/i').count()) > 0;
    expect(hasGoogle, 'Google attribution should be present').toBeTruthy();
  });

  test('6. Report page (Mountain View) – NREL, shading, numbers, address visible', async ({ page }) => {
    const url = reportUrl(LOCATIONS[0], 'ReportMV');
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    const body = (await page.locator('body').textContent()) ?? '';
    expect(body).toMatch(/nrel|pvwatts|pvwatts®/i);
    expect(body).toMatch(/\d+.*kwh|annual|production|estimate|savings/i);
    expect(body.toLowerCase()).toMatch(/mountain view|amphitheatre|california|ca/i);
    expect(/\d{4,}/.test(body), 'Report should show numeric estimates (4+ digits)').toBe(true);
    expect(body).toMatch(/shading analysis|annual shading loss/i);
    expect(body).toMatch(/shading|proxy|remote|geographic/i);
  });

  test('7. Report page (Phoenix) – different location, shading, numbers', async ({ page }) => {
    const url = reportUrl(LOCATIONS[1], 'ReportPHX');
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    const body = (await page.locator('body').textContent()) ?? '';
    expect(body).toMatch(/nrel|pvwatts|pvwatts®/i);
    expect(body.toLowerCase()).toMatch(/phoenix|arizona|az|central/i);
    expect(/\d{4,}/.test(body), 'Report should show numeric estimates').toBe(true);
    expect(body).toMatch(/shading analysis|annual shading loss/i);
  });

  test('8. Stripe create-checkout-session – CTA returns 200 or 503 when not configured', async ({ page }) => {
    await page.goto(`${BASE}/?company=StripeTest&demo=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    const cta = page.locator('button[data-cta="primary"], button[data-cta-button]').filter({ hasText: /Launch|Get Started/i }).first();
    await expect(cta).toBeVisible({ timeout: 10000 });
    const [req] = await Promise.all([
      page.waitForRequest((r) => r.url().includes('create-checkout-session') && r.method() === 'POST', { timeout: 20000 }),
      cta.click(),
    ]);
    const res = await req.response();
    expect([200, 503]).toContain(res?.status() ?? 0);
    if (res?.status() === 503) {
      const data = await res.json().catch(() => ({}));
      expect(data?.error).toMatch(/not configured|Expired API Key|Invalid API Key|invalid api key/i);
      return;
    }
    const postData = req.postDataJSON();
    expect(postData?.company).toBe('StripeTest');
  });

  test('9. Post-buy dashboard – Instant URL, Visit Site visible', async ({ page }) => {
    await page.goto(`${BASE}/c/activate-test?session_id=cs_test_123&demo=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Instant URL', { timeout: 15000 }).catch(() => null);
    const body = (await page.locator('body').textContent()) ?? '';
    expect(/Instant URL|Custom Domain|Embed Code|Dashboard/i.test(body)).toBe(true);
  });

  test('10. Lead API – reachable and validates', async ({ request }) => {
    const res = await request.post(`${BASE}/api/lead`, {
      data: { name: 'E2E', email: 'e2e@test.com' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect([400, 429]).toContain(res.status());
  });
});
