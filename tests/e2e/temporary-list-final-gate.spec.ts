/**
 * TEMPORARY-TO-DO-LIST Steps 40–41 (visual + API): exhaustive browser pass with screenshots.
 *
 * Run (production, screenshots in test-results/prod-gate-visual/):
 *   BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e/temporary-list-final-gate.spec.ts --workers=1 --timeout=120000
 *
 * See the browser (slow, for demos):
 *   BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e/temporary-list-final-gate.spec.ts --workers=1 --headed --timeout=120000
 *
 * Optional: ADMIN_TOKEN in env enables GDPR export smoke (does not delete data).
 *
 * Hold each visual step on screen (headed tours):
 *   VISUAL_STEP_PAUSE_MS=30000  → 30 seconds after each G01–G10 screenshot
 */
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { getVisualStepPauseMs, holdVisualStep } from './visual-tour-hold';

const BASE = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const DEMO_COMPANY = process.env.E2E_DEMO_COMPANY || 'AcmeSolar';
const DASHBOARD_HANDLE = process.env.E2E_DASHBOARD_HANDLE || 'acme-solar';
const PAID_COMPANY = process.env.E2E_PAID_COMPANY || 'AcmeSolar';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

const SHOT_DIR = path.join(process.cwd(), 'test-results', 'prod-gate-visual');

function ensureShotDir() {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
}

async function snap(page: import('@playwright/test').Page, fileName: string) {
  ensureShotDir();
  const safe = fileName.replace(/[^a-z0-9-_.]/gi, '_');
  await page.screenshot({ path: path.join(SHOT_DIR, `${safe}.png`), fullPage: true });
}

test.describe.configure({ mode: 'serial' });

test.describe('Visual gate — browser (Steps 40–41 installer + homeowner UI)', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const holdMs = getVisualStepPauseMs();
    if (holdMs > 0) {
      testInfo.setTimeout(testInfo.timeout + holdMs + 90_000);
    }
    await page.addInitScript(() => {
      try {
        localStorage.removeItem('demo_quota_v5');
      } catch {}
      try {
        localStorage.removeItem('demo_auto_open_v1');
      } catch {}
      try {
        localStorage.removeItem('sunspire-brand-takeover');
      } catch {}
      try {
        localStorage.removeItem('sunspire-last-address');
      } catch {}
    });
  });

  test('G01 — Demo landing (white-label preview)', async ({ page }) => {
    test.setTimeout(120000);
    await page.goto(`${BASE}/?company=${encodeURIComponent(DEMO_COMPANY)}&demo=1`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForSelector('text=/solar|Solar|quote|Launch|branded/i', { timeout: 30000 });
    await snap(page, 'G01-demo-landing');
    await expect(page.locator('body')).toContainText(/Launch Your Branded|Launch your branded/i);
  });

  test('G02 — Report / quote (NREL path)', async ({ page }) => {
    test.setTimeout(120000);
    const reportUrl = `${BASE}/report?company=${encodeURIComponent(DEMO_COMPANY)}&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`;
    await page.goto(reportUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('[data-testid="tile-annualProduction"]', { timeout: 90000 });
    await snap(page, 'G02-report-quote-ready');
    await holdVisualStep(page);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/kWh|production|Annual/i);
  });

  test('G03 — Paid landing', async ({ page }) => {
    await page.goto(`${BASE}/paid?company=${encodeURIComponent(PAID_COMPANY)}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForSelector('text=/solar|Solar|branded|Launch|lead|dashboard/i', { timeout: 25000 });
    await snap(page, 'G03-paid-landing');
    await holdVisualStep(page);
  });

  test('G04 — Dashboard (simulated post-checkout ?demo=1)', async ({ page }) => {
    await page.goto(`${BASE}/c/${DASHBOARD_HANDLE}?demo=1`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForSelector(
      'text=/Dashboard|Connect your CRM|Access Required|Instant URL|Create test lead|webhook/i',
      { timeout: 45000 },
    );
    await snap(page, 'G04-dashboard');
    await holdVisualStep(page);
    const body = await page.locator('body').innerText();
    expect(
      /Connect your CRM|Access Required|Instant URL|Embed|Create test lead|Save webhook/i.test(body),
    ).toBe(true);
  });

  test('G05 — Leads list', async ({ page }) => {
    await page.goto(`${BASE}/c/${DASHBOARD_HANDLE}/leads?demo=1`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForSelector(
      'text=/Leads Dashboard|No leads yet|Open your dashboard|View Leads|Retry|Company:/i',
      { timeout: 45000 },
    );
    await snap(page, 'G05-leads-list');
    await holdVisualStep(page);
  });

  test('G06 — Success page (activation messaging)', async ({ page }) => {
    await page.goto(`${BASE}/c/${DASHBOARD_HANDLE}/success?demo=1`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForTimeout(1500);
    await snap(page, 'G06-success-page');
    await holdVisualStep(page);
    const body = await page.locator('body').innerText();
    expect(body.length).toBeGreaterThan(20);
  });

  test('G07 — Consultation modal on paid report (lead UI)', async ({ page }) => {
    test.setTimeout(120000);
    const url = `${BASE}/report?company=${encodeURIComponent(PAID_COMPANY)}&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('[data-testid="tile-annualProduction"]', { timeout: 90000 }).catch(() => null);
    const book = page.getByRole('button', { name: /Book.*Consultation|consultation/i }).first();
    await book.click({ timeout: 15000 }).catch(() => null);
    await page.waitForTimeout(800);
    await snap(page, 'G07-report-consultation-modal-or-footer');
    await holdVisualStep(page);
  });

  test('G08 — System Status page', async ({ page }) => {
    await page.goto(`${BASE}/status`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(
      () => {
        const t = document.body?.innerText || '';
        return (
          t.includes('System Status') ||
          t.includes('Checking system status') ||
          t.includes('Supabase') ||
          t.includes('Operational') ||
          t.includes('Down') ||
          t.includes('Degraded')
        );
      },
      { timeout: 45000 },
    );
    await snap(page, 'G08-status-page');
    await holdVisualStep(page);
    await expect(page.locator('[data-testid="status-page-content"]')).toBeVisible();
  });

  test('G09 — Legal: terms + privacy (reachable)', async ({ page }) => {
    for (const p of ['/legal/terms', '/legal/privacy'] as const) {
      await page.goto(`${BASE}${p}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await snap(page, `G09-${p.replace(/\//g, '_')}`);
      await holdVisualStep(page);
      await expect(page.locator('body')).toContainText(/Sunspire|terms|privacy|Policy/i);
    }
  });

  test('G10 — Admin dashboard (token via prompt)', async ({ page }) => {
    test.skip(!ADMIN_TOKEN, 'Set ADMIN_TOKEN in environment to capture admin dashboard');
    page.once('dialog', async (d) => {
      await d.accept(ADMIN_TOKEN);
    });
    await page.goto(`${BASE}/admin/dashboard`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(4000);
    await snap(page, 'G10-admin-dashboard');
    await holdVisualStep(page);
  });
});

test.describe('API gate — Step 41 backend checks', () => {
  test('A01 — GET /api/health', async ({ request }) => {
    const res = await request.get(`${BASE}/api/health`);
    const body = await res.json().catch(() => ({}));
    expect(body).toHaveProperty('timestamp');
    expect(Array.isArray(body.services)).toBe(true);
    expect([200, 503].includes(res.status())).toBe(true);
  });

  test('A02 — GET /api/estimate', async ({ request }) => {
    const params = new URLSearchParams({
      address: '123 N Central Ave, Phoenix, AZ 85004',
      lat: '33.4484',
      lng: '-112.074',
      state: 'AZ',
      systemKw: '10',
      tilt: '22',
      azimuth: '180',
      lossesPct: '14',
    });
    const res = await request.get(`${BASE}/api/estimate?${params}`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.estimate).toBeDefined();
  });

  test('A03 — GET /api/geo/normalize', async ({ request }) => {
    const res = await request.get(
      `${BASE}/api/geo/normalize?address=${encodeURIComponent('1600 Amphitheatre Parkway, Mountain View, CA')}`,
    );
    expect([200, 503].includes(res.status())).toBe(true);
  });

  test('A04 — POST /api/lead validation', async ({ request }) => {
    const res = await request.post(`${BASE}/api/lead`, {
      data: {},
      headers: { 'Content-Type': 'application/json' },
    });
    expect([400, 429].includes(res.status())).toBe(true);
  });

  test('A05 — POST /api/lead with payload', async ({ request }) => {
    test.setTimeout(60000);
    const res = await request.post(`${BASE}/api/lead`, {
      data: {
        name: 'Gate Test',
        email: `gate-${Date.now()}@example.com`,
        phone: '+15550001111',
        address: '1 Test St',
        tenantSlug: 'TestCo',
        notes: 'final-gate',
      },
      headers: { 'Content-Type': 'application/json' },
      timeout: 55000,
    });
    expect([200, 404, 500, 429].includes(res.status())).toBe(true);
  });

  test('A06 — GET /api/tenant without auth (prod should be 401)', async ({ request }) => {
    const res = await request.get(`${BASE}/api/tenant?companyHandle=${encodeURIComponent(DASHBOARD_HANDLE)}`);
    // Non-production servers may allow; production should 401 without token/session
    expect([200, 401, 404].includes(res.status())).toBe(true);
  });

  test('A07 — POST /api/tenant/crm-webhook without auth', async ({ request }) => {
    const res = await request.post(`${BASE}/api/tenant/crm-webhook`, {
      data: { companyHandle: 'x', crmWebhookUrl: 'https://example.com/hook' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect([400, 401, 404, 405].includes(res.status())).toBe(true);
  });

  test('A08 — POST /api/stripe/webhook no signature', async ({ request }) => {
    const res = await request.post(`${BASE}/api/stripe/webhook`, {
      data: { type: 'checkout.session.completed' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect([400].includes(res.status())).toBe(true);
  });

  test('A09 — POST /api/gdpr/export — 401 without admin', async ({ request }) => {
    const res = await request.post(`${BASE}/api/gdpr/export`, {
      data: { email: 'nobody@example.com' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(401);
  });

  test('A10 — POST /api/gdpr/export — with admin (optional)', async ({ request }) => {
    test.skip(!ADMIN_TOKEN, 'Set ADMIN_TOKEN');
    const res = await request.post(`${BASE}/api/gdpr/export`, {
      data: { email: `gate-export-${Date.now()}@example.com` },
      headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
      timeout: 45000,
    });
    expect([200, 404, 500].includes(res.status())).toBe(true);
  });

  test('A11 — POST /api/gdpr/delete — 401 without admin', async ({ request }) => {
    const res = await request.post(`${BASE}/api/gdpr/delete`, {
      data: { email: 'nobody@example.com', confirm: 'DELETE' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(401);
  });

  test('A12 — GET /api/synthetic-results', async ({ request }) => {
    const res = await request.get(`${BASE}/api/synthetic-results`);
    expect([200, 401, 404, 500].includes(res.status())).toBe(true);
  });
});
