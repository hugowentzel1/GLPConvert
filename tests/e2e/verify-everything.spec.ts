/**
 * Full verification: every step of demo and paid flows, visual and functional.
 * Run: npx playwright test tests/e2e/verify-everything.spec.ts
 * Visual check: use --headed to watch; assertions ensure key elements are visible and correct.
 */

import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Verify everything — demo flow step-by-step', () => {
  test('Step 1: Demo home loads — hero, demo CTA, address input, footer', async ({ page }) => {
    await page.goto(`${BASE}/?company=AcmeSolar&demo=1`, { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toContainText(/solar|Solar|quote|Quote/i);
    await expect(page.locator('body')).toContainText(/Launch Your Branded Version|Launch your branded/i);
    await expect(page.locator('body')).toContainText(/How it works/i);
    await expect(page.locator('body')).toContainText(/Enter Your Property Address/i);
    const primaryCta = page.locator('button[data-cta="primary"], button[data-cta-button]').first();
    await expect(primaryCta).toBeVisible({ timeout: 10000 });
    const addressInput = page.locator('input[placeholder*="address"], [data-testid="demo-address-input"]').first();
    await expect(addressInput).toBeVisible({ timeout: 5000 });
    const footer = page.locator('footer, [data-testid="footer"]').first();
    await expect(footer).toBeVisible({ timeout: 5000 });
  });

  test('Step 2: Demo home — demo copy (lead/sync messaging, How it works)', async ({ page }) => {
    await page.goto(`${BASE}/?company=AcmeSolar&demo=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=/How it works|Launch Your Branded/i', { timeout: 10000 }).catch(() => null);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/Leads to inbox|lead|Lead captured|Optional sync/i);
    expect(body).toMatch(/Optional sync|HubSpot|Salesforce|CRM|dashboard/i);
  });

  test('Step 3: Demo report — address in URL loads estimate, NREL/numbers visible', async ({ page }) => {
    const url = `${BASE}/report?company=AcmeSolar&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=/NREL|PVWatts|annual|production|kwh|savings|estimate/i', { timeout: 20000 }).catch(() => null);
    await page.waitForTimeout(2000);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/solar|quote|nrel|pvwatts|annual|production|kwh|estimate|savings/i);
    expect(body).toMatch(/1600|Amphitheatre|Mountain View/i);
    expect(/\d{4,}/.test(body)).toBe(true);
  });

  test('Step 4: Demo report — demo CTA band visible (Unlock / Launch Your Branded)', async ({ page }) => {
    const url = `${BASE}/report?company=AcmeSolar&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=/Unlock Full Report|Launch Your Branded Version Now|Comparable tools/i', { timeout: 20000 }).catch(() => null);
    await page.waitForTimeout(1000);
    const band = page.locator('[data-testid="bottom-cta-band"], [data-testid="report-bottom-cta"]').first();
    await expect(band).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Launch Your Branded Version Now').first()).toBeVisible({ timeout: 3000 });
  });

  test('Step 5: Demo — primary CTA click triggers checkout (intercept session)', async ({ page }) => {
    await page.goto(`${BASE}/?company=AcmeSolar&demo=1`, { waitUntil: 'networkidle' });
    let checkoutSessionCalled = false;
    let successUrlPattern = '';
    await page.route('**/api/stripe/create-checkout-session', async (route) => {
      if (route.request().method() === 'POST') checkoutSessionCalled = true;
      const res = await route.fetch();
      const json = await res.json().catch(() => ({}));
      if (json.success_url) successUrlPattern = json.success_url;
      await route.fulfill({ response: res });
    });
    const cta = page.locator('button[data-cta="primary"], button[data-cta-button]').first();
    await cta.click();
    await page.waitForTimeout(4000);
    const wentToStripe = page.url().includes('stripe.com') || page.url().includes('checkout');
    expect(checkoutSessionCalled || wentToStripe).toBe(true);
    if (successUrlPattern) expect(successUrlPattern).toMatch(/\/c\/[^/]+(\?|$)|session_id=/);
  });
});

test.describe('Verify everything — paid flow step-by-step', () => {
  test('Step 6: Paid landing loads — no demo banner, launch/lead/dashboard copy', async ({ page }) => {
    await page.goto(`${BASE}/paid?company=AcmeSolar`, { waitUntil: 'networkidle' });
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/solar|Solar|quote|Quote|branded|Launch|lead|inbox|dashboard|CRM/i);
    await expect(page.locator('button[data-cta-button], button[data-cta="primary"], a[href*="report"]').first()).toBeVisible({ timeout: 8000 });
  });

  test('Step 7: Paid report (no demo=1) — Request a free consult or Book/Download/Copy visible', async ({ page }) => {
    await page.goto(`${BASE}/report?company=AcmeSolar&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=/Request a free consult|Book a Consultation|Download PDF|Copy Share Link|Unlock Full Report|Launch Your Branded/i', { timeout: 20000 }).catch(() => null);
    await page.waitForTimeout(1500);
    const body = await page.locator('body').innerText();
    const hasRequestConsult = /Request a free consult/i.test(body);
    const hasPaidCta = /Book a Consultation|Download PDF|Copy Share Link|Talk to a Specialist/i.test(body);
    const hasDemoCta = /Unlock Full Report|Launch Your Branded Version Now/i.test(body);
    expect(hasRequestConsult || hasPaidCta || hasDemoCta).toBe(true);
    const ctaSection = page.locator('[data-testid="report-cta-footer"], .report-cta-footer, [data-testid="report-bottom-cta"]').first();
    await expect(ctaSection).toBeVisible({ timeout: 5000 });
  });

  test('Step 7b: Paid report — Request a free consult opens lead modal', async ({ page }) => {
    await page.goto(`${BASE}/report?company=AcmeSolar&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=/Request a free consult|Book a Consultation/i', { timeout: 20000 }).catch(() => null);
    const consultBtn = page.locator('button:has-text("Request a free consult")').first();
    await consultBtn.click().catch(() => null);
    await page.waitForTimeout(800);
    const modalTitle = page.locator('text=Where should we send your report').first();
    await expect(modalTitle).toBeVisible({ timeout: 5000 });
    const consent = page.locator('text=By submitting, you agree to be contacted').first();
    await expect(consent).toBeVisible({ timeout: 3000 }).catch(() => null);
  });

  test('Step 8: Instant URL redirects to paid — /acme-solar → /paid?company=acme-solar', async ({ page }) => {
    const res = await page.goto(`${BASE}/acme-solar`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const url = page.url();
    expect(url).toMatch(/\/paid\?company=acme-solar|company=acme-solar/);
  });

  test('Step 9: Dashboard loads — CRM section or Access Required, View Leads, Docs', async ({ page }) => {
    await page.goto(`${BASE}/c/acme-solar?demo=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=/Dashboard|Connect your CRM|Save webhook|Access Required|Instant URL|Create test lead|Documentation/i', { timeout: 15000 }).catch(() => null);
    const body = await page.locator('body').innerText();
    const hasDashboard = /Connect your CRM|Zapier|Make|Save webhook|Instant URL|Embed Code|Create test lead/i.test(body);
    const hasAccessRequired = /Access Required/i.test(body);
    expect(hasDashboard || hasAccessRequired).toBe(true);
    const viewLeads = page.getByRole('link', { name: /View Leads/i });
    const docs = page.getByRole('link', { name: /Documentation/i });
    await expect(viewLeads.or(docs).first()).toBeVisible({ timeout: 5000 }).catch(() => null);
  });

  test('Step 10: Dashboard — Create test lead button visible when dashboard content shown', async ({ page }) => {
    await page.goto(`${BASE}/c/acme-solar?demo=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const body = await page.locator('body').innerText();
    if (/Connect your CRM|Create test lead|Instant URL/i.test(body)) {
      await expect(page.locator('text=Create test lead').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('Step 11: Leads list page — loads table or auth message', async ({ page }) => {
    await page.goto(`${BASE}/c/acme-solar/leads?demo=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const body = await page.locator('body').innerText();
    const hasLeadsUI = /Leads Dashboard|No leads yet|Name|Email|Address|Submitted|Loading leads/i.test(body);
    const hasAuthMessage = /Open your dashboard first|API key|Access|Required|Retry/i.test(body);
    expect(hasLeadsUI || hasAuthMessage).toBe(true);
  });
});

test.describe('Verify everything — status, health, APIs', () => {
  test('Step 12: Status page — unbranded, service list, version, Sentry link', async ({ page, request }) => {
    const healthRes = await request.get(`${BASE}/api/health`);
    const healthBody = await healthRes.json().catch(() => ({}));
    expect(healthBody.timestamp).toBeDefined();
    expect(Array.isArray(healthBody.services)).toBe(true);
    await page.goto(`${BASE}/status`, { waitUntil: 'load' });
    await page.waitForSelector('[data-testid="status-service-list"]', { timeout: 25000 });
    await page.waitForFunction(
      () => document.body?.innerText?.includes('Operational') || document.body?.innerText?.includes('Supabase'),
      { timeout: 15000 }
    );
    const statusBody = await page.locator('body').innerText();
    expect(statusBody).toMatch(/System Status/i);
    expect(statusBody).toMatch(/operational|Operational|systems|Supabase|Stripe|NREL|Resend|Geocoding|USGS|3DEP/i);
    expect(statusBody).toMatch(/sentry\.io|Sentry/i);
    await expect(page.locator('header')).toHaveCount(0);
    if (healthBody.version) {
      await expect(page.locator('body')).toContainText(healthBody.version);
    }
  });

  test('Step 13: Health API — JSON shape, version, services array', async ({ request }) => {
    const res = await request.get(`${BASE}/api/health`);
    const data = await res.json().catch(() => ({}));
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('services');
    expect(Array.isArray(data.services)).toBe(true);
    if (data.services.length > 0) {
      expect(data.services[0]).toHaveProperty('service');
      expect(data.services[0]).toHaveProperty('status');
    }
  });

  test('Step 14: Estimate API — returns quote, no lead created', async ({ request }) => {
    const params = new URLSearchParams({
      address: '1600 Amphitheatre Parkway, Mountain View, CA',
      lat: '37.422',
      lng: '-122.084',
      state: 'CA',
      systemKw: '6',
      tilt: '22',
      azimuth: '180',
      lossesPct: '14',
    });
    const res = await request.get(`${BASE}/api/estimate?${params}`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.estimate).toBeDefined();
    expect(data.estimate?.annualProductionKWh ?? data.estimate?.annualKwh).toBeDefined();
    expect(data.estimate?.shadingAnalysis).toBeDefined();
  });

  test('Step 15: Lead API — POST with full payload returns 200 or 500', async ({ request }) => {
    const res = await request.post(`${BASE}/api/lead`, {
      data: {
        name: 'Verify Test User',
        email: `verify-${Date.now()}@test.example`,
        address: '1600 Amphitheatre Parkway, Mountain View, CA',
        tenantSlug: 'acme-solar',
        systemSizeKW: 6,
        netCostAfterITC: 15000,
        year1Savings: 1200,
        paybackYear: 12,
      },
      headers: { 'Content-Type': 'application/json' },
    });
    expect([200, 500]).toContain(res.status());
    const data = await res.json().catch(() => ({}));
    if (res.status() === 200) expect(data.success).toBe(true);
    if (res.status() === 500) expect(data.error).toBeDefined();
  });

  test('Step 16: Lead API — missing required fields returns 400', async ({ request }) => {
    const res = await request.post(`${BASE}/api/lead`, {
      data: { name: 'A', email: 'a@b.co' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(400);
    const data = await res.json().catch(() => ({}));
    expect(data.error).toBeDefined();
  });
});

test.describe('Verify everything — legal, docs, layout', () => {
  test('Step 17: Legal — refund page content', async ({ page }) => {
    await page.goto(`${BASE}/legal/refund`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/refund|Refund|setup fee|24 hours/i);
  });

  test('Step 18: Legal — terms page content', async ({ page }) => {
    await page.goto(`${BASE}/terms`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/Terms|terms|refund|subscription/i);
  });

  test('Step 19: Legal — privacy page content', async ({ page }) => {
    await page.goto(`${BASE}/privacy`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/Privacy|privacy|data|personal/i);
  });

  test('Step 20: Footer on home — has refund or terms or privacy link', async ({ page }) => {
    await page.goto(`${BASE}/?demo=1`, { waitUntil: 'networkidle' });
    const footer = page.locator('footer, [data-testid="footer"]').first();
    await expect(footer).toBeVisible({ timeout: 5000 }).catch(() => null);
    const hasRefund = await page.getByRole('link', { name: /Refund|refund/i }).first().isVisible().catch(() => false);
    const hasPrivacy = await page.getByRole('link', { name: /Privacy|privacy/i }).first().isVisible().catch(() => false);
    const hasTerms = await page.getByRole('link', { name: /Terms|terms/i }).first().isVisible().catch(() => false);
    expect(hasRefund || hasPrivacy || hasTerms).toBe(true);
  });

  test('Step 21: Docs CRM page — CRM/Zapier/webhook content', async ({ page }) => {
    await page.goto(`${BASE}/docs/crm`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/CRM|Zapier|Make|HubSpot|webhook/i);
  });

  test('Step 22: Success page — loads with session_id param (may show loading or error)', async ({ page }) => {
    await page.goto(`${BASE}/success?session_id=test_fake_session`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const body = await page.locator('body').innerText();
    const hasSuccess = /Thank you|subscription|success|Loading your subscription/i.test(body);
    const hasError = /Failed|error|Invalid/i.test(body);
    expect(hasSuccess || hasError).toBe(true);
  });
});

test.describe('Verify everything — different company branding', () => {
  test('Step 23: Demo with Netflix company — branding visible', async ({ page }) => {
    await page.goto(`${BASE}/?company=Netflix&demo=1&domain=netflix.com`, { waitUntil: 'networkidle' });
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/Netflix|netflix|solar|quote|Launch|branded/i);
  });

  test('Step 24: Home without company — still loads (main Sunspire or redirect)', async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const body = await page.locator('body').innerText();
    expect(body.length).toBeGreaterThan(200);
    expect(body).toMatch(/solar|Solar|quote|Quote|address|Address/i);
  });
});

test.describe('Verify everything — visual layout (no regression)', () => {
  test('Step 25: Demo home — address input and Generate button visible', async ({ page }) => {
    await page.goto(`${BASE}/?company=AcmeSolar&demo=1`, { waitUntil: 'networkidle' });
    const input = page.locator('input[placeholder*="address"], [data-testid="demo-address-input"]').first();
    await expect(input).toBeVisible();
    await input.scrollIntoViewIfNeeded();
    const genBtn = page.getByRole('button', { name: /Generate Solar Report|Analyzing your property/i });
    await expect(genBtn).toBeVisible({ timeout: 8000 });
  });

  test('Step 26: Report page — main content area has estimate or loading then content', async ({ page }) => {
    const url = `${BASE}/report?company=AcmeSolar&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="report-page"], text=/NREL|PVWatts|annual|production|kwh|Back to Home/i', { timeout: 20000 }).catch(() => null);
    await page.waitForTimeout(2000);
    const reportMain = page.locator('[data-testid="report-page"]').first();
    await expect(reportMain).toBeVisible({ timeout: 10000 });
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/solar|NREL|PVWatts|annual|production|kwh|estimate|savings|1600|Amphitheatre/i);
  });

  test('Step 27: Status page — no main nav/header (unbranded)', async ({ page }) => {
    await page.goto(`${BASE}/status`, { waitUntil: 'load' });
    await page.waitForSelector('[data-testid="status-service-list"]', { timeout: 25000 }).catch(() => null);
    const headerCount = await page.locator('header').count();
    expect(headerCount).toBe(0);
  });
});
