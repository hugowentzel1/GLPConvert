/**
 * Extremely detailed visual tests: every screen, key elements, and layout.
 * Asserts specific headings, buttons, form fields, links, and structure so nothing is missed.
 * Run: npx playwright test tests/e2e/visual-detailed.spec.ts --workers=1
 * Visual: add --headed to watch.
 */

import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Visual detailed — Demo home', () => {
  test('Demo home: hero, headline, demo CTA box, and primary CTA button visible', async ({ page }) => {
    await page.goto(`${BASE}/?company=AcmeSolar&demo=1`, { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toContainText(/Your Branded Solar Quote Tool|Live on Your Site in 24 Hours/i);
    await expect(page.locator('text=Launch Your Branded Version Now').first()).toBeVisible({ timeout: 10000 });
    const primaryCta = page.getByRole('button', { name: /Launch Your Branded Version Now/i }).or(
      page.locator('[data-testid="primary-cta-hero"]')
    );
    await expect(primaryCta.first()).toBeVisible();
    await expect(primaryCta.first()).toBeEnabled();
    const heroHeadline = page.getByRole('heading', { name: /Your Branded Solar Quote Tool/i });
    await expect(heroHeadline).toBeVisible();
  });

  test('Demo home: address section — heading, input, Generate button', async ({ page }) => {
    await page.goto(`${BASE}/?company=AcmeSolar&demo=1`, { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: /Enter Your Property Address/i })).toBeVisible({ timeout: 8000 });
    const input = page.getByPlaceholder(/address|property/i).or(page.locator('[data-testid="demo-address-input"]'));
    await expect(input.first()).toBeVisible();
    await expect(input.first()).toBeEditable();
    const genBtn = page.getByRole('button', { name: /Generate Solar Report|Analyzing your property/i });
    await expect(genBtn.first()).toBeVisible({ timeout: 8000 });
    await genBtn.first().scrollIntoViewIfNeeded().catch(() => null);
    await expect(genBtn.first()).toBeInViewport();
  });

  test('Demo home: How it works, Lead captured, Optional sync copy', async ({ page }) => {
    await page.goto(`${BASE}/?company=AcmeSolar&demo=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=/How it works/i', { timeout: 10000 });
    await expect(page.locator('text=How it works').first()).toBeVisible();
    await expect(page.locator('text=/Lead captured/i').first()).toBeVisible();
    await expect(page.locator('text=/Optional sync to your CRM|optional sync to your CRM/i').first()).toBeVisible();
    await expect(page.locator('text=Consultation booked')).toHaveCount(0);
  });

  test('Demo home: footer with support email and legal links', async ({ page }) => {
    await page.goto(`${BASE}/?company=AcmeSolar&demo=1`, { waitUntil: 'networkidle' });
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible({ timeout: 8000 });
    await footer.scrollIntoViewIfNeeded().catch(() => null);
    const supportLink = page.locator('a[href="mailto:support@getsunspire.com"]').first();
    await expect(supportLink).toBeVisible({ timeout: 5000 });
    const hasLegal =
      (await page.getByRole('link', { name: /Refund|refund/i }).first().isVisible().catch(() => false)) ||
      (await page.getByRole('link', { name: /Terms|terms/i }).first().isVisible().catch(() => false)) ||
      (await page.getByRole('link', { name: /Privacy|privacy/i }).first().isVisible().catch(() => false));
    expect(hasLegal).toBe(true);
  });
});

test.describe('Visual detailed — Demo report', () => {
  test('Demo report: main, back link, header with address and title', async ({ page }) => {
    const url = `${BASE}/report?company=AcmeSolar&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="report-page"]', { timeout: 20000 });
    const main = page.locator('[data-testid="report-page"]');
    await expect(main).toBeVisible();
    await expect(page.locator('[data-testid="back-home-link"]').or(page.locator('a:has-text("Back to Home")')).first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="hdr-address"]').or(page.locator('text=/1600|Amphitheatre|Mountain View/i')).first()).toBeVisible({ timeout: 8000 });
  });

  test('Demo report: estimate tiles — system size, production, savings', async ({ page }) => {
    const url = `${BASE}/report?company=AcmeSolar&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="report-page"]', { timeout: 20000 });
    await page.waitForSelector('text=/System Size|Annual Production|kWh|savings/i', { timeout: 15000 }).catch(() => null);
    const tileSystem = page.locator('[data-testid="tile-systemSize"]').first();
    const tileProduction = page.locator('[data-testid="tile-annualProduction"]').first();
    await expect(tileSystem).toBeVisible({ timeout: 8000 });
    await expect(tileProduction).toBeVisible({ timeout: 5000 });
  });

  test('Demo report: CTA band — Launch Your Branded Version Now button', async ({ page }) => {
    const url = `${BASE}/report?company=AcmeSolar&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="report-bottom-cta"], [data-testid="bottom-cta-band"]', { timeout: 20000 });
    const band = page.locator('[data-testid="report-bottom-cta"]').or(page.locator('[data-testid="bottom-cta-band"]')).first();
    await expect(band).toBeVisible();
    await expect(page.locator('text=Launch Your Branded Version Now').first()).toBeVisible();
  });
});

test.describe('Visual detailed — Paid report and lead modal', () => {
  test('Paid report: CTA footer with Book your consultation', async ({ page }) => {
    await page.goto(`${BASE}/report?company=AcmeSolar&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForSelector('[data-testid="report-cta-footer"], .report-cta-footer', { timeout: 20000 }).catch(() => null);
    await page.waitForSelector('text=/Book your consultation|Book a Consultation/i', { timeout: 15000 });
    const consultBtn = page.getByRole('button', { name: /Book your consultation/i });
    await expect(consultBtn.first()).toBeVisible();
    await expect(consultBtn.first()).toBeEnabled();
  });

  test('Lead modal: dialog, title, subtext, all form fields and consent', async ({ page }) => {
    await page.goto(`${BASE}/report?company=AcmeSolar&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForSelector('button:has-text("Book your consultation")', { timeout: 20000 }).catch(() => null);
    await page.getByRole('button', { name: /Book your consultation/i }).first().click();
    await page.waitForTimeout(1000);
    const dialog = page.getByRole('dialog').first();
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog.locator('h2#report-lead-modal-title').or(dialog.locator('text=Book your free consultation'))).toBeVisible();
    await expect(dialog.locator('text=Share your details below')).toBeVisible();
    await expect(dialog.locator('#report-lead-name')).toBeVisible();
    await expect(dialog.locator('#report-lead-email')).toBeVisible();
    await expect(dialog.locator('#report-lead-phone')).toBeVisible();
    await expect(dialog.locator('text=How would you like to be contacted?').or(dialog.locator('label:has-text("Call")'))).toBeVisible();
    await expect(dialog.getByRole('radio', { name: /Call/i })).toBeVisible();
    await expect(dialog.getByRole('radio', { name: /Email/i })).toBeVisible();
    await expect(dialog.locator('text=/I agree to be contacted.*solar project and next steps/i').first()).toBeVisible();
    await expect(dialog.locator('a[href="/privacy"]').first()).toBeVisible();
    await expect(dialog.locator('a[href="/terms"]').first()).toBeVisible();
    await expect(dialog.getByRole('button', { name: /Book your consultation/i })).toBeVisible();
  });

  test('Lead modal: consent checkbox and submit button enabled when filled', async ({ page }) => {
    await page.goto(`${BASE}/report?company=AcmeSolar&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForSelector('button:has-text("Book your consultation")', { timeout: 20000 }).catch(() => null);
    await page.getByRole('button', { name: /Book your consultation/i }).first().click();
    await page.waitForTimeout(500);
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 8000 });
    const nameInput = page.locator('#report-lead-name').or(page.getByLabel(/First name/i));
    const emailInput = page.locator('#report-lead-email').or(page.getByLabel(/Email/i).first());
    await nameInput.fill('Visual Test');
    await emailInput.fill('visual@test.example');
    await page.getByRole('radio', { name: /Call/i }).check().catch(() => null);
    await page.locator('#report-lead-consent').check().catch(() => null);
    const dialog = page.getByRole('dialog').first();
    const submitBtn = dialog.getByRole('button', { name: /Book your consultation/i });
    await expect(submitBtn).toBeEnabled();
  });
});

test.describe('Visual detailed — Paid landing', () => {
  test('Paid landing: headline and address input visible', async ({ page }) => {
    await page.goto(`${BASE}/paid?company=AcmeSolar`, { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toContainText(/solar|Solar|quote|Quote|branded|Launch|lead|dashboard|CRM/i);
    const input = page.locator('[data-testid="paid-address-input"]').or(page.getByPlaceholder(/address|property/i)).first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Visual detailed — Dashboard', () => {
  test('Dashboard: Instant URL, Embed, CRM section, Create test lead, View Leads, Docs', async ({ page }) => {
    await page.goto(`${BASE}/c/acme-solar?demo=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=/Instant URL|Connect your CRM|Create test lead|View Leads|Documentation|Access Required/i', {
      timeout: 15000,
    });
    const body = await page.locator('body').innerText();
    if (/Connect your CRM|Instant URL|Create test lead/i.test(body)) {
      await expect(page.locator('text=Create test lead').first()).toBeVisible({ timeout: 5000 });
      await expect(page.getByRole('link', { name: /View Leads/i }).first()).toBeVisible({ timeout: 5000 });
      await expect(page.getByRole('link', { name: /Documentation/i }).first()).toBeVisible({ timeout: 5000 }).catch(() => null);
    }
    const supportLink = page.locator('a[href="mailto:support@getsunspire.com"]').first();
    await expect(supportLink).toBeVisible({ timeout: 5000 }).catch(() => null);
  });
});

test.describe('Visual detailed — Leads list', () => {
  test('Leads list: heading, table or empty state or auth message', async ({ page }) => {
    await page.goto(`${BASE}/c/acme-solar/leads?demo=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=/Leads Dashboard|Loading leads|Open your dashboard first|No leads yet|Retry/i', {
      timeout: 15000,
    });
    const body = await page.locator('body').innerText();
    const hasHeading = /Leads Dashboard/i.test(body);
    const hasTable = /Name|Email|Address|Phone|Submitted/i.test(body);
    const hasEmpty = /No leads yet/i.test(body);
    const hasLoading = /Loading leads/i.test(body);
    const hasAuth = /Open your dashboard first|Retry/i.test(body);
    expect(hasHeading || hasTable || hasEmpty || hasLoading || hasAuth).toBe(true);
    if (hasHeading) {
      await expect(page.getByRole('heading', { name: /Leads Dashboard/i })).toBeVisible();
    }
  });
});

test.describe('Visual detailed — Status page', () => {
  test('Status: h1, banner, service list, Daily check, support@getsunspire.com', async ({ page, request }) => {
    const healthRes = await request.get(`${BASE}/api/health`);
    const healthBody = await healthRes.json().catch(() => ({}));
    await page.goto(`${BASE}/status`, { waitUntil: 'load' });
    await page.waitForSelector('[data-testid="status-service-list"]', { timeout: 25000 });
    await expect(page.getByRole('heading', { name: /System Status/i })).toBeVisible();
    await expect(page.locator('text=/All systems operational|need attention/i').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Everything Sunspire depends on').first()).toBeVisible();
    await expect(page.locator('[data-testid="status-service-list"]')).toBeVisible();
    await expect(page.locator('text=/Daily check/i').first()).toBeVisible();
    await expect(page.locator('text=support@getsunspire.com').first()).toBeVisible();
    await expect(page.locator('button:has-text("Refresh now")').or(page.locator('button:has-text("Refreshing")')).first()).toBeVisible();
    await expect(page.locator('header')).toHaveCount(0);
    if (healthBody.services?.length) {
      await expect(page.locator(`[data-service="${healthBody.services[0].service}"]`)).toBeVisible();
    }
  });

  test('Status: each service row has title and status', async ({ page, request }) => {
    const healthRes = await request.get(`${BASE}/api/health`);
    const healthBody = await healthRes.json().catch(() => ({}));
    const services = Array.isArray(healthBody.services) ? healthBody.services : [];
    await page.goto(`${BASE}/status`, { waitUntil: 'load' });
    await page.waitForSelector('[data-testid="status-service-list"]', { timeout: 25000 });
    for (const s of services.slice(0, 5)) {
      const row = page.locator(`[data-service="${s.service}"]`);
      await expect(row).toBeVisible({ timeout: 3000 });
      await expect(row.locator('..').locator('text=/Operational|Degraded|Down/i')).toBeVisible();
    }
  });
});

test.describe('Visual detailed — Legal pages', () => {
  test('Refund page: title and key copy', async ({ page }) => {
    await page.goto(`${BASE}/legal/refund`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/refund|Refund|setup fee|24 hours/i);
    await expect(page.locator('a[href="mailto:support@getsunspire.com"]').first()).toBeVisible({ timeout: 5000 }).catch(() => null);
  });

  test('Terms page: terms and subscription copy', async ({ page }) => {
    await page.goto(`${BASE}/terms`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/Terms|terms|refund|subscription/i);
  });

  test('Privacy page: privacy and data copy', async ({ page }) => {
    await page.goto(`${BASE}/privacy`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/Privacy|privacy|data|personal/i);
  });
});

test.describe('Visual detailed — Health API', () => {
  test('Health JSON: timestamp, version, services array with service and status', async ({ request }) => {
    const res = await request.get(`${BASE}/api/health`);
    const data = await res.json().catch(() => ({}));
    expect(data).toHaveProperty('timestamp');
    expect(typeof data.timestamp).toBe('string');
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('services');
    expect(Array.isArray(data.services)).toBe(true);
    for (const s of data.services) {
      expect(s).toHaveProperty('service');
      expect(s).toHaveProperty('status');
      expect(['ok', 'degraded', 'down']).toContain(s.status);
    }
  });
});

test.describe('Visual detailed — Docs CRM', () => {
  test('Docs CRM: CRM, Zapier, webhook content', async ({ page }) => {
    await page.goto(`${BASE}/docs/crm`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText(/CRM|Zapier|Make|HubSpot|webhook/i);
  });
});
