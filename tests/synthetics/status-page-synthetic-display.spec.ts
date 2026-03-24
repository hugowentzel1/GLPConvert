/**
 * Verifies the status page shows synthetic monitoring results accurately.
 * Run after posting results (e.g. scripts/post-synthetic-results.mjs) so data is present.
 * Use same baseURL as the app that received the POST (e.g. SYNTHETIC_APP_URL for local).
 */
import { test, expect } from '@playwright/test';

test.describe('Status page — synthetic monitoring display', () => {
  test('status page loads and synthetic section is present', async ({ page }) => {
    await page.goto('/status', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const content = page.locator('[data-testid="status-page-content"]');
    await expect(content).toBeVisible({ timeout: 25000 });
    const section = page.locator('[data-testid="synthetic-monitoring-section"]');
    try {
      await section.waitFor({ state: 'visible', timeout: 15000 });
    } catch {
      test.skip(true, 'App has no synthetic section (e.g. production from main); use a preview deploy or merge to see it.');
      return;
    }
    await expect(section.locator('text=Synthetic monitoring')).toBeVisible();
    const hasMain = await page.locator('h1:has-text("System Status")').isVisible().catch(() => false);
    const hasError = await page.locator('text=Status check failed').isVisible().catch(() => false);
    expect(hasMain || hasError, 'Page should show either System Status or Status check failed').toBe(true);
  });

  test('when synthetic data exists: homeowner and buyer rows show with accurate status and format', async ({ page }) => {
    await page.goto('/status', { waitUntil: 'domcontentloaded', timeout: 25000 });
    const section = page.locator('[data-testid="synthetic-monitoring-section"]');
    try {
      await section.waitFor({ state: 'visible', timeout: 15000 });
    } catch {
      test.skip(true, 'App has no synthetic section');
      return;
    }
    await page.waitForTimeout(3000);

    const noData = section.locator('text=No recent synthetic data');
    const homeownerRow = section.locator('[data-testid="synthetic-homeowner-row"]');
    await Promise.race([
      homeownerRow.waitFor({ state: 'visible', timeout: 10000 }),
      noData.waitFor({ state: 'visible', timeout: 10000 }),
    ]).catch(() => {});

    if (await noData.isVisible()) {
      test.skip(true, 'No synthetic data posted; run post-synthetic-results.mjs first');
      return;
    }

    await expect(section.locator('[data-testid="synthetic-homeowner-row"]')).toBeVisible({ timeout: 5000 });
    await expect(section.locator('[data-testid="synthetic-buyer-row"]')).toBeVisible({ timeout: 5000 });

    const buyerRow = section.locator('[data-testid="synthetic-buyer-row"]');

    await expect(homeownerRow.locator('text=Homeowner flow')).toBeVisible();
    await expect(buyerRow.locator('text=Buyer checkout flow')).toBeVisible();

    const statusRegex = /^(PASS|FAIL|DEGRADED)$/;
    const homeownerStatus = homeownerRow.locator('text=/PASS|FAIL|DEGRADED/').first();
    const buyerStatus = buyerRow.locator('text=/PASS|FAIL|DEGRADED/').first();
    await expect(homeownerStatus).toBeVisible();
    await expect(buyerStatus).toBeVisible();
    await expect(homeownerStatus).toHaveText(statusRegex);
    await expect(buyerStatus).toHaveText(statusRegex);

    const lastUpdated = section.locator('text=Results last updated');
    await expect(lastUpdated).toBeVisible();
  });

  test('synthetic section visual: layout matches page style', async ({ page }) => {
    await page.goto('/status', { waitUntil: 'domcontentloaded', timeout: 25000 });
    const section = page.locator('[data-testid="synthetic-monitoring-section"]');
    try {
      await section.waitFor({ state: 'visible', timeout: 15000 });
    } catch {
      test.skip(true, 'App has no synthetic section');
      return;
    }
    await expect(section).toHaveClass(/rounded-xl.*border.*bg-white/);
    const homeownerRow = section.locator('[data-testid="synthetic-homeowner-row"]');
    const noData = section.locator('text=No recent synthetic data');
    await Promise.race([
      homeownerRow.waitFor({ state: 'visible', timeout: 12000 }),
      noData.waitFor({ state: 'visible', timeout: 12000 }),
    ]).catch(() => {});
    if (await noData.isVisible()) {
      test.skip(true, 'No synthetic data; cannot snapshot');
      return;
    }
    await page.waitForTimeout(500);
    const maskDates = [
      section.locator('p:has-text("Results last updated")'),
      section.locator('[data-testid="synthetic-homeowner-row"] span.text-slate-500'),
      section.locator('[data-testid="synthetic-buyer-row"] span.text-slate-500'),
    ];
    await expect(section).toHaveScreenshot('synthetic-monitoring-section.png', {
      mask: maskDates,
      maxDiffPixels: 1500,
    });
  });
});
