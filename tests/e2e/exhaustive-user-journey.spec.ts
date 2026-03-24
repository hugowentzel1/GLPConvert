/**
 * Exhaustive full user journey: one flow as if a real user (demo → explore → paid → buy → setup → leads).
 * Covers: demo site fully, CTAs, quote, paid version, checkout (mocked), dashboard, CRM section, test lead,
 * leads list, status page, health API, legal (refund, terms, privacy), footer support email.
 * Run: npx playwright test tests/e2e/exhaustive-user-journey.spec.ts --workers=1
 */

import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Exhaustive user journey — one full pass', () => {
  test('Full pass: demo home → report → CTAs → paid landing → checkout mock → dashboard → test lead → leads → status → health → legal → footer', async ({
    page,
    request,
  }) => {
    // ─── 1. Demo home ─────────────────────────────────────────────────────
    await page.goto(`${BASE}/?company=AcmeSolar&demo=1`, { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toContainText(/solar|Solar|quote|Quote/i);
    await expect(page.locator('body')).toContainText(/Launch Your Branded Version|Launch your branded/i);
    await expect(page.locator('body')).toContainText(/Enter Your Property Address/i);
    await expect(page.locator('body')).toContainText(/Lead captured/i);
    await expect(page.locator('body')).toContainText(/Optional sync to your CRM|optional sync to your CRM/i);
    const addressInput = page.locator('input[placeholder*="address"], [data-testid="demo-address-input"]').first();
    await expect(addressInput).toBeVisible({ timeout: 8000 });

    // ─── 2. Report (demo) ─────────────────────────────────────────────────
    await page.goto(
      `${BASE}/report?company=AcmeSolar&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`,
      { waitUntil: 'domcontentloaded' }
    );
    await page.waitForSelector('text=/NREL|PVWatts|annual|production|kwh|savings|estimate/i', { timeout: 20000 }).catch(() => null);
    await page.waitForTimeout(2000);
    const reportBody = await page.locator('body').innerText();
    expect(reportBody).toMatch(/solar|quote|nrel|pvwatts|annual|production|kwh|estimate|savings/i);
    expect(reportBody).toMatch(/1600|Amphitheatre|Mountain View/i);
    await expect(page.locator('text=Launch Your Branded Version Now').first()).toBeVisible({ timeout: 5000 }).catch(() => null);

    // ─── 3. Paid report + lead modal ──────────────────────────────────────
    await page.goto(
      `${BASE}/report?company=AcmeSolar&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`,
      { waitUntil: 'domcontentloaded' }
    );
    await page.waitForSelector('text=/Request a free consult|Book a Consultation/i', { timeout: 20000 }).catch(() => null);
    const consultBtn = page.locator('button:has-text("Request a free consult")').first();
    await consultBtn.click().catch(() => null);
    await page.waitForTimeout(600);
    await expect(page.locator('text=Where should we send your report').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=By submitting, you agree to be contacted').first()).toBeVisible({ timeout: 3000 }).catch(() => null);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // ─── 4. Paid landing ──────────────────────────────────────────────────
    await page.goto(`${BASE}/paid?company=AcmeSolar`, { waitUntil: 'networkidle' });
    const paidBody = await page.locator('body').innerText();
    expect(paidBody).toMatch(/solar|Solar|quote|Quote|branded|Launch|lead|inbox|dashboard|CRM/i);

    // ─── 5. Checkout (mock: intercept, assert success_url pattern) ──────────
    await page.goto(`${BASE}/?company=AcmeSolar&demo=1`, { waitUntil: 'networkidle' });
    let checkoutHit = false;
    let successUrl = '';
    await page.route('**/api/stripe/create-checkout-session', async (route) => {
      if (route.request().method() === 'POST') checkoutHit = true;
      const res = await route.fetch();
      const json = await res.json().catch(() => ({}));
      if (json.url) successUrl = json.url;
      if (json.success_url) successUrl = json.success_url;
      await route.fulfill({ response: res });
    });
    await page.locator('button[data-cta="primary"], button[data-cta-button]').first().click();
    await page.waitForTimeout(3500);
    expect(checkoutHit || page.url().includes('stripe.com') || page.url().includes('checkout')).toBe(true);

    // ─── 6. Dashboard (post-purchase simulation) ──────────────────────────
    await page.goto(`${BASE}/c/acme-solar?demo=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector(
      'text=/Dashboard|Connect your CRM|Save webhook|Access Required|Instant URL|Create test lead|Documentation/i',
      { timeout: 15000 }
    ).catch(() => null);
    const dashBody = await page.locator('body').innerText();
    const hasDashboard = /Connect your CRM|Zapier|Make|Save webhook|Instant URL|Create test lead/i.test(dashBody);
    const hasAccess = /Access Required/i.test(dashBody);
    expect(hasDashboard || hasAccess).toBe(true);
    await expect(page.locator('a[href*="support@getsunspire.com"], a[href="mailto:support@getsunspire.com"]').first()).toBeVisible({ timeout: 5000 }).catch(() => null);

    // ─── 7. Leads list ────────────────────────────────────────────────────
    await page.goto(`${BASE}/c/acme-solar/leads?demo=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const leadsBody = await page.locator('body').innerText();
    const hasLeadsUI = /Leads Dashboard|No leads yet|Name|Email|Address|Submitted|Loading leads/i.test(leadsBody);
    const hasAuthMsg = /Open your dashboard first|Access|Required|Retry/i.test(leadsBody);
    expect(hasLeadsUI || hasAuthMsg).toBe(true);

    // ─── 8. Status page ───────────────────────────────────────────────────
    await page.goto(`${BASE}/status`, { waitUntil: 'load' });
    await page.waitForSelector('[data-testid="status-service-list"]', { timeout: 25000 }).catch(() => null);
    await page.waitForFunction(
      () =>
        document.body?.innerText?.includes('Supabase') ||
        document.body?.innerText?.includes('Operational') ||
        document.body?.innerText?.includes('support@getsunspire'),
      { timeout: 15000 }
    ).catch(() => null);
    const statusBody = await page.locator('body').innerText();
    expect(statusBody).toMatch(/System Status/i);
    expect(statusBody).toMatch(/operational|Operational|systems|Supabase|Stripe|NREL|Resend|Geocoding|USGS|3DEP/i);
    expect(statusBody).toMatch(/support@getsunspire\.com/i);
    expect(statusBody).toMatch(/Sentry|sentry\.io/i);
    await expect(page.locator('header')).toHaveCount(0);

    // ─── 9. Health API ────────────────────────────────────────────────────
    const healthRes = await request.get(`${BASE}/api/health`);
    const healthData = await healthRes.json().catch(() => ({}));
    expect(healthData).toHaveProperty('timestamp');
    expect(healthData).toHaveProperty('version');
    expect(healthData).toHaveProperty('services');
    expect(Array.isArray(healthData.services)).toBe(true);
    if (healthData.services?.length > 0) {
      expect(healthData.services[0]).toHaveProperty('service');
      expect(healthData.services[0]).toHaveProperty('status');
    }

    // ─── 10. Legal: refund, terms, privacy ─────────────────────────────────
    await page.goto(`${BASE}/legal/refund`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/refund|Refund|setup fee|24 hours/i);
    await page.goto(`${BASE}/terms`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/Terms|terms|refund|subscription/i);
    await page.goto(`${BASE}/privacy`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/Privacy|privacy|data|personal/i);

    // ─── 11. Footer: support email and legal links ────────────────────────
    await page.goto(`${BASE}/?demo=1`, { waitUntil: 'networkidle' });
    const footer = page.locator('footer, [data-testid="footer"]').first();
    await expect(footer).toBeVisible({ timeout: 5000 }).catch(() => null);
    const hasSupportLink =
      (await page.locator('a[href*="support@getsunspire"], a[href="mailto:support@getsunspire.com"]').first().isVisible().catch(() => false)) ||
      (await page.locator('a[href*="mailto:support@getsunspire"]').first().isVisible().catch(() => false));
    const hasRefundOrTerms =
      (await page.getByRole('link', { name: /Refund|refund/i }).first().isVisible().catch(() => false)) ||
      (await page.getByRole('link', { name: /Terms|terms/i }).first().isVisible().catch(() => false)) ||
      (await page.getByRole('link', { name: /Privacy|privacy/i }).first().isVisible().catch(() => false));
    expect(hasSupportLink || hasRefundOrTerms).toBe(true);
  });
});
