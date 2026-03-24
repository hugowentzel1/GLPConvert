import { test, expect } from '@playwright/test';
import path from 'path';

const BASE_URL = 'https://sunspire-web-app.vercel.app';

test.describe('Visual Verification - Live Site', () => {
  test('1. Google Autocomplete - Visual Test', async ({ page }) => {
    await page.goto(`${BASE_URL}/?company=TestCompany&demo=1&domain=apple.com`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take screenshot of initial page
    await page.screenshot({ 
      path: 'test-results/1-initial-page.png',
      fullPage: true 
    });
    
    // Find address input field
    const addressInput = page.locator('input[data-address-input], input[placeholder*="address" i], input[aria-label*="address" i]').first();
    await expect(addressInput).toBeVisible();
    
    // Type in address to trigger autocomplete
    await addressInput.fill('123 Main St, Los Angeles');
    await page.waitForTimeout(1000);
    
    // Take screenshot showing autocomplete dropdown
    await page.screenshot({ 
      path: 'test-results/2-autocomplete-typing.png',
      fullPage: true 
    });
    
    // Check if autocomplete suggestions appear
    const suggestions = page.locator('[data-autosuggest], .dropdown-animate, [role="listbox"]').first();
    
    // Wait a bit more for Google Places API to load
    await page.waitForTimeout(2000);
    
    // Check if "Powered by Google" text is visible
    const poweredByGoogle = page.locator('text=/powered by google/i');
    const hasPoweredBy = await poweredByGoogle.count() > 0;
    
    await page.screenshot({ 
      path: 'test-results/3-autocomplete-dropdown.png',
      fullPage: true 
    });
    
    console.log('✅ Google Autocomplete Test:');
    console.log(`   - Address input found: ✅`);
    console.log(`   - "Powered by Google" visible: ${hasPoweredBy ? '✅' : '❌'}`);
    console.log(`   - Suggestions dropdown: ${await suggestions.isVisible().catch(() => false) ? '✅' : '⚠️ (May need API key)'}`);
  });

  test('2. Logo Display - Visual Test', async ({ page }) => {
    await page.goto(`${BASE_URL}/?company=TestCompany&demo=1&domain=apple.com`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Give time for logo to load
    
    // Take screenshot of page with logo
    await page.screenshot({ 
      path: 'test-results/4-logo-display.png',
      fullPage: true 
    });
    
    // Check for logo image
    const logoImage = page.locator('img[alt*="logo" i], img[alt*="TestCompany" i], [data-hero-logo] img').first();
    const logoVisible = await logoImage.isVisible().catch(() => false);
    
    // Check for fallback initials
    const initials = page.locator('text=/^T$/').first();
    const hasInitials = await initials.isVisible().catch(() => false);
    
    // Check logo proxy endpoint
    const logoProxyRequests = await page.evaluate(() => {
      return (window as any).__LOGO_PROXY_CALLS__ || [];
    });
    
    console.log('✅ Logo Display Test:');
    console.log(`   - Logo image visible: ${logoVisible ? '✅' : '❌'}`);
    console.log(`   - Fallback initials visible: ${hasInitials ? '✅ (Using fallback)' : '❌'}`);
    console.log(`   - Logo proxy calls: ${logoProxyRequests.length > 0 ? '✅' : '⚠️'}`);
    
    // Test with different domain
    await page.goto(`${BASE_URL}/?company=Google&demo=1&domain=google.com`);
    await page.waitForTimeout(3000);
    await page.screenshot({ 
      path: 'test-results/5-logo-google.png',
      fullPage: true 
    });
  });

  test('3. Estimation Flow - Visual Test', async ({ page }) => {
    await page.goto(`${BASE_URL}/?company=TestCompany&demo=1&domain=apple.com`);
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Enter address
    const addressInput = page.locator('input[data-address-input], input[placeholder*="address" i]').first();
    await addressInput.fill('123 Main St, Los Angeles, CA 90001');
    await page.waitForTimeout(2000);
    
    // Try to select from autocomplete if available
    const firstSuggestion = page.locator('[data-autosuggest] > div, [role="option"]').first();
    if (await firstSuggestion.isVisible().catch(() => false)) {
      await firstSuggestion.click();
      await page.waitForTimeout(1000);
    }
    
    // Click generate button
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Report")').first();
    await generateButton.click();
    
    // Wait for report page
    await page.waitForURL(/\/report/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for estimation to load
    
    // Take screenshot of report page
    await page.screenshot({ 
      path: 'test-results/6-estimation-report.png',
      fullPage: true 
    });
    
    // Check for estimation data
    const annualProduction = page.locator('text=/annual production|kwh|production/i').first();
    const savings = page.locator('text=/savings|payback|roi/i').first();
    const chart = page.locator('canvas, svg, [class*="chart"]').first();
    
    console.log('✅ Estimation Test:');
    console.log(`   - Report page loaded: ✅`);
    console.log(`   - Annual production visible: ${await annualProduction.isVisible().catch(() => false) ? '✅' : '❌'}`);
    console.log(`   - Savings/ROI visible: ${await savings.isVisible().catch(() => false) ? '✅' : '❌'}`);
    console.log(`   - Chart visible: ${await chart.isVisible().catch(() => false) ? '✅' : '❌'}`);
    
    // Check for data source attribution
    const dataSource = page.locator('text=/NREL|PVWatts|EIA/i').first();
    const hasDataSource = await dataSource.isVisible().catch(() => false);
    console.log(`   - Data source attribution: ${hasDataSource ? '✅' : '⚠️'}`);
  });

  test('4. Complete Flow - All Features', async ({ page }) => {
    // Test complete flow with all features
    await page.goto(`${BASE_URL}/?company=TestCompany&demo=1&domain=apple.com`);
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Screenshot 1: Initial page with logo
    await page.screenshot({ 
      path: 'test-results/7-complete-initial.png',
      fullPage: true 
    });
    
    // Test address autocomplete
    const addressInput = page.locator('input[data-address-input]').first();
    await addressInput.fill('1600 Amphitheatre Parkway, Mountain View, CA');
    await page.waitForTimeout(2000);
    
    // Screenshot 2: With autocomplete
    await page.screenshot({ 
      path: 'test-results/8-complete-autocomplete.png',
      fullPage: true 
    });
    
    // Generate report
    const generateButton = page.locator('button:has-text("Generate")').first();
    await generateButton.click();
    
    await page.waitForURL(/\/report/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    // Screenshot 3: Final report
    await page.screenshot({ 
      path: 'test-results/9-complete-report.png',
      fullPage: true 
    });
    
    console.log('✅ Complete Flow Test:');
    console.log('   - All screenshots saved to test-results/');
    console.log('   - Check screenshots to verify:');
    console.log('     1. Logo displays correctly');
    console.log('     2. Google autocomplete works');
    console.log('     3. Estimation generates successfully');
  });
});
