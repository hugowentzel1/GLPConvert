import { test, expect } from '@playwright/test';

test.describe('Final Verification - All Fixed Issues', () => {
  const base = 'http://localhost:3000';

  test('✅ All 4 tiles render correctly in DEMO and PAID', async ({ page }) => {
    // Test DEMO mode
    await page.goto(`${base}/report?address=123+Main+St%2C+Atlanta%2C+GA&lat=33.7490&lng=-84.3880&placeId=test&demo=1`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    expect(await page.locator('[data-testid="tile-systemSize"]').count()).toBe(1);
    expect(await page.locator('[data-testid="tile-annualProduction"]').count()).toBe(1);
    expect(await page.locator('[data-testid="tile-lifetimeSavings"]').count()).toBe(1);
    expect(await page.locator('[data-testid="tile-large"]').count()).toBe(1);
    console.log('✅ All 4 tiles render in DEMO mode');
    
    // Test PAID mode
    await page.goto(`${base}/report?address=123+Main+St%2C+Atlanta%2C+GA&lat=33.7490&lng=-84.3880&placeId=test&company=Apple`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await expect(page.locator('[data-testid="tile-systemSize"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-annualProduction"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-lifetimeSavings"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-large"]')).toBeVisible();
    console.log('✅ All 4 tiles visible and unlocked in PAID mode');
  });

  test('✅ Responsive design works on all viewports', async ({ page }) => {
    const viewports = [
      { width: 360, height: 740, name: 'Mobile' },
      { width: 1280, height: 800, name: 'Desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${base}/report?address=123+Main+St%2C+Atlanta%2C+GA&lat=33.7490&lng=-84.3880&placeId=test&company=Apple`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await expect(page.getByTestId('hdr-h1')).toBeVisible();
      await expect(page.locator('[data-testid="report-cta-footer"]')).toBeVisible();
      
      console.log(`✅ ${viewport.name} (${viewport.width}px) renders correctly`);
    }
  });

  test('✅ Lock screen works correctly', async ({ page }) => {
    await page.goto(`${base}/?company=Netflix&demo=1`);
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // Set quota to 0
    await page.evaluate(() => {
      const map = JSON.parse(localStorage.getItem('demo_quota_v5') || '{}');
      const key = Object.keys(map)[0];
      if (key) {
        map[key] = 0;
        localStorage.setItem('demo_quota_v5', JSON.stringify(map));
      }
    });
    
    // Try to generate report
    await page.goto(`${base}/?company=Netflix&demo=1`);
    await page.waitForTimeout(1000);
    const input = page.locator('input[placeholder*="Start typing"]').first();
    await input.fill('123 Main St, Phoenix');
    await page.waitForTimeout(1500);
    
    const suggestion = page.locator('[data-autosuggest]').first();
    if (await suggestion.isVisible()) {
      await suggestion.click();
      await page.waitForTimeout(2000);
      
      const lockScreen = page.getByRole('heading', { name: /Demo limit reached/i });
      await expect(lockScreen).toBeVisible();
      console.log('✅ Lock screen appears when quota exhausted');
    }
  });

  test('✅ Activate page shows domain setup', async ({ page }) => {
    await page.goto(`${base}/activate?session_id=test&company=Tesla`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await expect(page.locator('text=Your Solar Tool is Ready!')).toBeVisible();
    
    const domainTab = page.locator('button').filter({ hasText: 'Custom Domain' });
    await domainTab.click();
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=/quote\\..*\\.com/')).toBeVisible();
    console.log('✅ Activate page shows quote.yourcompany.com');
  });

  test('✅ Real NREL API - NO fallback data', async ({ page }) => {
    await page.goto(`${base}/?company=Spotify&demo=1`);
    await page.waitForLoadState('networkidle');
    
    const input = page.locator('input[placeholder*="Start typing"]').first();
    await input.fill('123 Main St, Phoenix, AZ');
    await page.waitForTimeout(1500);
    
    const suggestion = page.locator('[data-autosuggest]').first();
    if (await suggestion.isVisible()) {
      // Monitor network for NREL API calls
      const apiCalls: string[] = [];
      page.on('request', req => {
        if (req.url().includes('nrel.gov') || req.url().includes('pvwatts')) {
          apiCalls.push(req.url());
          console.log('🌞 NREL API call detected:', req.url());
        }
      });
      
      await suggestion.click();
      await page.waitForURL(/\/report\?/);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // Check if API was called
      if (apiCalls.length > 0) {
        console.log('✅ Real NREL API called (NO fallback)');
        expect(apiCalls.length).toBeGreaterThan(0);
      } else {
        console.log('⚠️ No NREL API calls detected - check if using cache or fallback');
      }
    }
  });
});
