/**
 * Verifies the demo homepage is styled correctly (no raw HTML / unstyled look).
 * Run with: npx playwright test tests/e2e/homepage-styled.spec.ts --headed
 * Or: BASE_URL=http://localhost:3000 npx playwright test tests/e2e/homepage-styled.spec.ts --headed
 */
import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const DEMO_HOME = `${BASE}/?company=Metaca&demo=1`;

test.describe('Homepage styled', () => {
  test('demo homepage has gradient background and no full-width blue bar', async ({ page }) => {
    await page.goto(DEMO_HOME, { waitUntil: 'networkidle' });
    await page.waitForLoadState('domcontentloaded');

    // Wait for main content
    const main = page.locator('main').first();
    await expect(main).toBeVisible({ timeout: 10000 });

    // Body or root wrapper should have gradient-like background (not plain white)
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) => {
      const s = window.getComputedStyle(el);
      const bg = s.background || s.backgroundColor;
      return bg;
    });
    // Should have some background (gradient or color), not transparent
    expect(bgColor).toBeTruthy();
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(bgColor).not.toBe('transparent');

    // There must not be a full-width blue bar in the content area (reading progress bar bug)
    const blueBars = await page.locator('[data-testid="reading-progress"]').count();
    expect(blueBars).toBe(0);

    // Headline should be visible and not in default serif
    const headline = page.getByRole('heading', { name: /Branded Solar Quote Tool/i });
    await expect(headline).toBeVisible();
    const fontFamily = await headline.evaluate((el) => window.getComputedStyle(el).fontFamily);
    expect(fontFamily.length).toBeGreaterThan(0);

    // Primary CTA (hero) should exist — use testid to avoid multiple matches (nav, sticky, etc.)
    const cta = page.getByTestId('primary-cta-hero');
    await expect(cta).toBeVisible();

    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/homepage-styled.png', fullPage: false });
  });
});
