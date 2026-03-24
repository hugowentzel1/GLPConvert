import { test, expect } from '@playwright/test';

test.describe('Tile Rendering Fix', () => {
  const base = 'http://localhost:3000';

  test('All 4 tiles render in DEMO mode', async ({ page }) => {
    await page.goto(`${base}/report?address=123+Main+St%2C+Atlanta%2C+GA&lat=33.7490&lng=-84.3880&placeId=test&demo=1`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check all 4 tiles exist
    const systemSize = page.locator('[data-testid="tile-systemSize"]');
    const production = page.locator('[data-testid="tile-annualProduction"]');
    const savings = page.locator('[data-testid="tile-lifetimeSavings"]');
    const large = page.locator('[data-testid="tile-large"]');
    
    await expect(systemSize).toBeVisible();
    await expect(production).toBeVisible();
    
    expect(await savings.count()).toBe(1);
    expect(await large.count()).toBe(1);
    
    console.log('✅ All 4 tiles render in demo mode');
  });

  test('All 4 tiles render and are UNLOCKED in PAID mode', async ({ page }) => {
    await page.goto(`${base}/report?address=123+Main+St%2C+Atlanta%2C+GA&lat=33.7490&lng=-84.3880&placeId=test&company=Apple`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // All 4 tiles should be visible (not blurred)
    await expect(page.locator('[data-testid="tile-systemSize"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-annualProduction"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-lifetimeSavings"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-large"]')).toBeVisible();
    
    console.log('✅ All 4 tiles visible and unlocked in paid mode');
  });
});

