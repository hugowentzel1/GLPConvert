/**
 * Step 43: /status UI must reflect /api/health per-service status (Operational / Degraded / Down).
 * Run: BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e/status-page-health-mapping.spec.ts
 */
import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Status page ↔ health JSON mapping', () => {
  test('Each health service row shows correct Operational / Degraded / Down', async ({ page, request }) => {
    test.setTimeout(90000);
    const healthRes = await request.get(`${BASE}/api/health`);
    const health = await healthRes.json().catch(() => null);
    expect(health && Array.isArray(health.services)).toBe(true);

    await page.goto(`${BASE}/status`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('[data-testid="status-service-list"]', { timeout: 45000 });

    for (const s of health.services as { service: string; status: string }[]) {
      const row = page.locator(`[data-testid="status-service-row"][data-service="${s.service}"]`);
      const count = await row.count();
      if (count === 0) continue;

      const label =
        s.status === 'ok' ? 'Operational' : s.status === 'degraded' ? 'Degraded' : 'Down';
      await expect(row.locator(`text=${label}`).first()).toBeVisible({ timeout: 10000 });
    }

    // Overall banner matches health.ok
    if (health.ok === true) {
      await expect(page.getByText('All systems operational').first()).toBeVisible({ timeout: 5000 });
    } else {
      await expect(page.getByText(/need attention|service/).first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('Synthetic monitoring section is present on /status', async ({ page }) => {
    await page.goto(`${BASE}/status`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('[data-testid="synthetic-monitoring-section"]', { timeout: 30000 });
    await expect(page.getByText('Synthetic monitoring').first()).toBeVisible();
  });
});
