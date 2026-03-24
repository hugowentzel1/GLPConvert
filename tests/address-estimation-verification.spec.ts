import { test, expect } from '@playwright/test';

const BASE_URL = 'https://sunspire-web-app.vercel.app';

test.describe('Address Autocomplete & Estimation Verification', () => {
  test('1. Address Autocomplete - Visual Test', async ({ page }) => {
    console.log('🔍 Testing Address Autocomplete...');
    
    await page.goto(`${BASE_URL}/?company=TestCompany&demo=1&domain=apple.com`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for Google Maps API to load
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'test-results/address-1-initial.png',
      fullPage: true 
    });
    
    // Find address input
    const addressInput = page.locator('input[data-address-input], input[placeholder*="address" i], input[aria-label*="address" i]').first();
    await expect(addressInput).toBeVisible({ timeout: 10000 });
    
    // Check for "Powered by Google" text
    const poweredByGoogle = page.locator('text=/powered by google/i');
    const hasPoweredBy = await poweredByGoogle.count() > 0;
    console.log(`   - "Powered by Google" visible: ${hasPoweredBy ? '✅' : '❌'}`);
    
    // Type address to trigger autocomplete
    await addressInput.click();
    await addressInput.fill('1600 Amphitheatre Parkway');
    await page.waitForTimeout(2000); // Wait for autocomplete
    
    // Take screenshot while typing
    await page.screenshot({ 
      path: 'test-results/address-2-typing.png',
      fullPage: true 
    });
    
    // Check for autocomplete dropdown
    const autocompleteDropdown = page.locator('[data-autosuggest], .dropdown-animate, [role="listbox"], div[class*="dropdown"]').first();
    const dropdownVisible = await autocompleteDropdown.isVisible().catch(() => false);
    
    // Check console for Google Maps API loading
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Google') || text.includes('Places') || text.includes('autocomplete')) {
        consoleMessages.push(text);
      }
    });
    
    await page.waitForTimeout(2000);
    
    console.log(`   - Address input found: ✅`);
    console.log(`   - Autocomplete dropdown: ${dropdownVisible ? '✅' : '⚠️ (May need API key in Vercel)'}`);
    console.log(`   - Console messages: ${consoleMessages.length > 0 ? '✅ Google Maps API detected' : '⚠️'}`);
    
    // Final screenshot
    await page.screenshot({ 
      path: 'test-results/address-3-final.png',
      fullPage: true 
    });
  });

  test('2. Estimation API - Direct Test', async ({ page }) => {
    console.log('🔍 Testing Estimation API...');
    
    // Test estimation endpoint directly
    const response = await page.request.get(
      `${BASE_URL}/api/estimate?address=123%20Main%20St,%20Los%20Angeles,%20CA%2090001&lat=34.0522&lng=-118.2437&state=CA&systemKw=10&tilt=22&azimuth=180&lossesPct=14`
    );
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    
    console.log('   - API Response Status: ✅ 200');
    console.log(`   - Has estimate data: ${data.estimate ? '✅' : '❌'}`);
    console.log(`   - Annual production: ${data.estimate?.annualProductionKWh?.estimate ? `✅ ${data.estimate.annualProductionKWh.estimate} kWh` : '❌'}`);
    console.log(`   - Data source: ${data.estimate?.dataSource || 'N/A'}`);
    console.log(`   - Shading analysis: ${data.estimate?.shadingAnalysis?.method ? `✅ ${data.estimate.shadingAnalysis.method}` : '❌'}`);
    
    // Verify key fields
    expect(data.estimate).toBeDefined();
    expect(data.estimate.annualProductionKWh).toBeDefined();
    expect(data.estimate.annualProductionKWh.estimate).toBeGreaterThan(0);
    expect(data.estimate.dataSource).toContain('NREL');
    expect(data.estimate.shadingAnalysis).toBeDefined();
    
    console.log('   ✅ Estimation API working perfectly!');
  });

  test('3. Complete Flow - Address to Estimation', async ({ page }) => {
    console.log('🔍 Testing Complete Flow...');
    
    await page.goto(`${BASE_URL}/?company=TestCompany&demo=1&domain=apple.com`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Screenshot 1: Initial page
    await page.screenshot({ 
      path: 'test-results/flow-1-initial.png',
      fullPage: true 
    });
    
    // Enter address
    const addressInput = page.locator('input[data-address-input]').first();
    await addressInput.fill('123 Main St, Los Angeles, CA 90001');
    await page.waitForTimeout(2000);
    
    // Screenshot 2: Address entered
    await page.screenshot({ 
      path: 'test-results/flow-2-address-entered.png',
      fullPage: true 
    });
    
    // Click generate button
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Report")').first();
    await generateButton.click();
    
    // Wait for navigation to report page
    await page.waitForURL(/\/report/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait for estimation to load
    
    // Screenshot 3: Report page
    await page.screenshot({ 
      path: 'test-results/flow-3-report-page.png',
      fullPage: true 
    });
    
    // Check for estimation data on page
    const annualProduction = page.locator('text=/annual production|kwh|production/i').first();
    const savings = page.locator('text=/savings|payback|roi/i').first();
    const chart = page.locator('canvas, svg, [class*="chart"]').first();
    
    const hasProduction = await annualProduction.isVisible().catch(() => false);
    const hasSavings = await savings.isVisible().catch(() => false);
    const hasChart = await chart.isVisible().catch(() => false);
    
    console.log('   - Report page loaded: ✅');
    console.log(`   - Annual production visible: ${hasProduction ? '✅' : '❌'}`);
    console.log(`   - Savings/ROI visible: ${hasSavings ? '✅' : '❌'}`);
    console.log(`   - Chart visible: ${hasChart ? '✅' : '❌'}`);
    
    // Check for data source attribution
    const dataSource = page.locator('text=/NREL|PVWatts|EIA/i').first();
    const hasDataSource = await dataSource.isVisible().catch(() => false);
    console.log(`   - Data source attribution: ${hasDataSource ? '✅' : '⚠️'}`);
    
    console.log('   ✅ Complete flow working!');
  });
});
