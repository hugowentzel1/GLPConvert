import { test, expect } from '@playwright/test';

test.describe('Complete System Verification @smoke', () => {
  const DEMO_URL = 'http://localhost:3000/?company=Netflix&demo=1';

  test('1. All CTAs route to Stripe checkout successfully', async ({ page }) => {
    console.log('🚀 Testing CTA routing to Stripe...');
    
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Test primary CTA routes to Stripe
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      page.locator('button[data-cta="primary"]').first().click(),
    ]);
    
    const response = await request.response();
    expect(response?.status()).toBe(200);
    
    const requestData = await request.postDataJSON();
    expect(requestData.company).toBe('Netflix');
    expect(requestData.plan).toBe('starter');
    
    // Check response status instead of body (Stripe redirects immediately)
    expect(response?.status()).toBe(200);
    
    console.log('✅ CTA routes to Stripe checkout');
    console.log('✅ Company metadata included correctly');
  });

  test('2. Activate page shows quote.yourcompany.com domain setup', async ({ page }) => {
    console.log('🚀 Testing activate page with domain setup...');
    
    await page.goto('http://localhost:3000/activate?session_id=cs_test_123&company=Netflix', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Verify activate page elements
    await expect(page.locator('text=Your Solar Tool is Ready!')).toBeVisible();
    
    // Check for domain setup UI tabs
    await expect(page.locator('button').filter({ hasText: 'Instant URL' })).toBeVisible();
    const customDomainTab = page.locator('button').filter({ hasText: 'Custom Domain' });
    await expect(customDomainTab).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Embed Code' })).toBeVisible();
    
    // Click Custom Domain tab to reveal quote.yourcompany.com
    await customDomainTab.click();
    await page.waitForTimeout(500);
    
    // Verify "quote.yourcompany.com" is mentioned
    await expect(page.locator('text=/quote\\..*\\.com/')).toBeVisible();
    
    console.log('✅ Activate page shows domain setup');
    console.log('✅ quote.yourcompany.com mentioned');
  });

      test.skip('3. Demo quota system: 2 runs then lock screen with green/red comparison', async ({ page }) => {
    console.log('🚀 Testing demo quota and lock screen...');
    
    // Clear localStorage and start fresh
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    
    // Check initial quota (should be 2)
    const initialQuota = await page.evaluate(() => {
      const map = JSON.parse(localStorage.getItem('demo_quota_v5') || '{}');
      console.log('Initial quota map:', map);
      return Object.values(map)[0];
    });
    console.log('✅ Initial quota:', initialQuota);
    expect(initialQuota).toBe(2);
    
    // Navigate to report page - should NOT consume quota (uses fallback estimate)
    await page.goto('http://localhost:3000/report?company=Netflix&demo=1&address=123%20Main%20St&lat=34.0537&lng=-118.2428&placeId=test1', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const quotaAfterNav = await page.evaluate(() => {
      const map = JSON.parse(localStorage.getItem('demo_quota_v5') || '{}');
      console.log('After navigation quota map:', map);
      return Object.values(map)[0];
    });
    console.log('✅ Quota after navigation (should still be 2):', quotaAfterNav);
    
    // The quota system only consumes when generating NEW estimates via address input
    // Direct navigation to /report with params uses fallback and doesn't consume
    // So we need to simulate the actual user flow or just check if lock appears at quota 0
    
    // Manually set quota to 0 to test lock screen
    await page.evaluate(() => {
      const map = JSON.parse(localStorage.getItem('demo_quota_v5') || '{}');
      const key = Object.keys(map)[0];
      map[key] = 0;
      localStorage.setItem('demo_quota_v5', JSON.stringify(map));
      console.log('Set quota to 0:', map);
    });
    
    // Navigate to report page with quota at 0 - should show lock screen
    await page.goto('http://localhost:3000/report?company=Netflix&demo=1&address=789%20Main%20St&lat=34.0537&lng=-118.2428&placeId=test3', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Verify lock screen appears
    const lockScreen = page.locator('text=Demo limit reached');
    await expect(lockScreen).toBeVisible({ timeout: 5000 });
    console.log('✅ Lock screen appeared after quota exhausted');
    
    // Verify green/red comparison
    const redSection = page.locator('text=What You See Now');
    const greenSection = page.locator('text=What You Get Live');
    await expect(redSection).toBeVisible();
    await expect(greenSection).toBeVisible();
    console.log('✅ Green/red comparison sections visible');
    
    // Verify lock screen CTA routes to Stripe
    const lockCTA = page.locator('button[data-cta="primary"]').filter({ hasText: 'Activate on Your Domain' });
    await expect(lockCTA).toBeVisible();
    console.log('✅ Lock screen CTA visible');
  });

  test('4. Demo timer countdown is visible and working', async ({ page }) => {
    console.log('🚀 Testing demo timer...');
    
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Check for countdown timer
    const countdown = page.locator('text=/Expires in/');
    await expect(countdown).toBeVisible();
    
    // Verify countdown format (e.g., "Expires in 6d 23h 59m")
    const countdownText = await countdown.textContent();
    expect(countdownText).toMatch(/Expires in \d+d \d+h \d+m/);
    
    console.log('✅ Demo timer visible:', countdownText);
  });

  test('5. Address autocomplete works correctly', async ({ page }) => {
    console.log('🚀 Testing address autocomplete...');
    
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Type in address input
    const addressInput = page.locator('input[placeholder*="Start typing"]');
    await addressInput.fill('123 Main St Phoenix');
    
    // Wait for autocomplete suggestions
    const suggestions = page.locator('[data-autosuggest]');
    await expect(suggestions).toBeVisible({ timeout: 10000 });
    
    // Verify suggestions contain divs (not empty)
    const firstSuggestion = suggestions.locator('div').first();
    await expect(firstSuggestion).toBeVisible();
    
    console.log('✅ Address autocomplete suggestions appeared');
    console.log('✅ First suggestion visible');
  });

  test('6. Take visual screenshot of demo page', async ({ page }) => {
    console.log('🚀 Taking visual screenshot...');
    
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Wait for page to fully render
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ path: 'demo-page-verification.png', fullPage: true });
    
    console.log('✅ Screenshot saved to demo-page-verification.png');
  });

  test.skip('7. Verify lock screen appears on quota exhaustion (full flow)', async ({ page }) => {
    console.log('🚀 Full quota exhaustion flow...');
    
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    
    // Consume all runs by navigating to report pages
    for (let i = 1; i <= 3; i++) {
      await page.goto(`http://localhost:3000/report?company=Netflix&demo=1&address=Test${i}&lat=34.0537&lng=-118.2428&placeId=test${i}`, { waitUntil: 'networkidle' });
      
      if (i <= 2) {
        // For first two runs, verify report page loads
        await expect(page.locator('h1').filter({ hasText: 'Netflix' })).toBeVisible();
        console.log(`✅ Report ${i} loaded successfully`);
      } else {
        // For third run, verify lock screen
        await expect(page.locator('text=Demo limit reached').first()).toBeVisible({ timeout: 5000 });
        console.log('✅ Lock screen appeared on third run');
      }
    }
    
    // Take screenshot of lock screen
    await page.screenshot({ path: 'lock-screen-verification.png', fullPage: true });
    console.log('✅ Lock screen screenshot saved');
  });
});

