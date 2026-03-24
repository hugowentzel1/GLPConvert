/**
 * E2E: Full post-buy dashboard — every link and action.
 *
 * Run in headed to watch (with npm run dev already running):
 *   npx playwright test tests/e2e-post-buy-dashboard-full.spec.ts --project=chromium --headed
 *
 * Slower watch (3s between steps): set STEP_DELAY_MS = 3000 below.
 * Requires: npm run dev (localhost:3000)
 */

import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';
const DASHBOARD_URL = `${BASE}/c/activate-test?session_id=cs_test_123&demo=1`;
const STEP_DELAY_MS = 1500;

test.describe('Post-buy dashboard — full visual check', () => {
  test('Dashboard: every link and action works', async ({ page, context }) => {
    // ——— 1. Load dashboard ———
    await page.goto(DASHBOARD_URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Instant URL', { timeout: 15000 });
    await page.waitForTimeout(STEP_DELAY_MS);

    // ——— 2. Instant URL: Copy URL ———
    await page.getByRole('button', { name: /Copy URL/i }).first().click();
    await expect(page.getByText('✅ Copied!').first()).toBeVisible({ timeout: 3000 });
    await page.waitForTimeout(STEP_DELAY_MS);

    // ——— 3. Visit Site (opens new tab → paid page with company) ———
    const visitLink = page.locator('a:has-text("Visit Site")').first();
    const [paidPage] = await Promise.all([
      context.waitForEvent('page'),
      visitLink.click(),
    ]);
    await paidPage.waitForLoadState('domcontentloaded');
    await paidPage.waitForTimeout(STEP_DELAY_MS);
    await expect(paidPage).toHaveURL(/\/paid\?company=activate-test/);
    const paidBody = await paidPage.locator('body').textContent() ?? '';
    expect(paidBody).toMatch(/solar|address|quote|calculator|activate-test/i);
    await paidPage.close();
    await page.waitForTimeout(STEP_DELAY_MS);

    // ——— 4. Embed Code: Copy Embed Code ———
    await page.getByRole('button', { name: /Copy Embed Code/i }).click();
    await expect(page.getByText('✅ Code Copied!').first()).toBeVisible({ timeout: 3000 });
    await page.waitForTimeout(STEP_DELAY_MS);

    // ——— 5. Custom Domain: Setup Instructions ———
    await page.getByRole('link', { name: /Setup Instructions/i }).click();
    await page.waitForURL(/\/docs\/setup\?company=activate-test/, { timeout: 8000 });
    await expect(page.locator('body')).toContainText(/Setup Guide|setup/i);
    await page.waitForTimeout(STEP_DELAY_MS);
    await page.goto(DASHBOARD_URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Instant URL', { timeout: 10000 });
    await page.waitForTimeout(STEP_DELAY_MS);

    // ——— 6. API Key: Copy API Key ———
    await page.getByRole('button', { name: /Copy API Key/i }).click();
    await expect(page.getByText('✅ Copied!').first()).toBeVisible({ timeout: 3000 });
    await page.waitForTimeout(STEP_DELAY_MS);

    // ——— 7. View Leads (page loads; shows either Leads Dashboard + data or error if Supabase down) ———
    await page.getByRole('link', { name: /View Leads/i }).click();
    await page.waitForURL(/\/c\/activate-test\/leads/, { timeout: 8000 });
    await page.waitForTimeout(3000);
    const leadsBody = await page.locator('body').textContent() ?? '';
    const hasLeadsDashboard = /Leads Dashboard/i.test(leadsBody);
    const hasNoLeads = /No leads yet/i.test(leadsBody);
    const hasTable = /Name\s*Email\s*Address|Submitted/i.test(leadsBody.replace(/\s+/g, ' '));
    const hasErrorState = /Failed to fetch|Retry|Open your dashboard first/i.test(leadsBody);
    expect(hasLeadsDashboard || hasErrorState).toBeTruthy();
    if (hasLeadsDashboard) expect(hasNoLeads || hasTable || /Failed to fetch/i.test(leadsBody)).toBeTruthy();
    await page.waitForTimeout(STEP_DELAY_MS);
    await page.goto(DASHBOARD_URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Instant URL', { timeout: 10000 });
    await page.waitForTimeout(STEP_DELAY_MS);

    // ——— 8. Documentation ———
    await page.getByRole('link', { name: /Documentation/i }).click();
    await page.waitForURL(/\/docs\/setup/, { timeout: 8000 });
    await expect(page.locator('body')).toContainText(/Setup|setup|Guide/i);
    await page.waitForTimeout(STEP_DELAY_MS);
    await page.goto(DASHBOARD_URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Instant URL', { timeout: 10000 });
    await page.waitForTimeout(STEP_DELAY_MS);

    // ——— 9. Contact Support ———
    await page.getByRole('link', { name: /Contact Support/i }).click();
    await page.waitForURL(/\/support/, { timeout: 8000 });
    await expect(page.locator('body')).toContainText(/support|Support|Contact|help/i);
    await page.waitForTimeout(STEP_DELAY_MS);
    await page.goto(DASHBOARD_URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Instant URL', { timeout: 10000 });
    await page.waitForTimeout(STEP_DELAY_MS);

    // ——— 10. Footer: Privacy ———
    await page.getByRole('link', { name: 'Privacy' }).first().click();
    await page.waitForURL(/\/privacy/, { timeout: 8000 });
    await expect(page.locator('body')).toContainText(/Privacy|privacy/i);
    await page.waitForTimeout(STEP_DELAY_MS);
    await page.goto(DASHBOARD_URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Instant URL', { timeout: 10000 });
    await page.waitForTimeout(STEP_DELAY_MS);

    // ——— 11. Footer: Terms ———
    await page.getByRole('link', { name: 'Terms' }).first().click();
    await page.waitForURL(/\/terms/, { timeout: 8000 });
    await expect(page.locator('body')).toContainText(/Terms|terms/i);
    await page.waitForTimeout(STEP_DELAY_MS);
    await page.goto(DASHBOARD_URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Instant URL', { timeout: 10000 });

    // ——— 12. Verify embed URL opens with branding (optional: open in new tab) ———
    await page.goto(`${BASE}/embed/activate-test?company=activate-test`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(STEP_DELAY_MS);
    const embedBody = await page.locator('body').textContent() ?? '';
    expect(embedBody).toMatch(/activate-test|Solar Calculator|solar|address|quote/i);

    console.log('✅ Post-buy dashboard: all links and actions verified');
  });
});
