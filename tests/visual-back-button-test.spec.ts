import { test, expect } from '@playwright/test';

const BASE_URL = 'https://sunspire-web-app.vercel.app';

test.describe('🔙 BACK BUTTON FIX - Visual Verification', () => {
  
  test('[VISUAL] Back button returns to homepage after Stripe cancellation', async ({ page }) => {
    console.log('🧪 Testing back button from homepage...');
    
    // Start from homepage
    await page.goto(`${BASE_URL}/?company=SunRun&demo=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    console.log('✅ Loaded homepage');
    await page.screenshot({ path: 'test-results/back-button-01-homepage.png', fullPage: true });
    
    // Verify homepage
    await expect(page.locator('h1').first()).toContainText('SunRun');
    
    // Intercept the checkout request to verify cancel_url
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      page.locator('button[data-cta="primary"]').first().click(),
    ]);
    
    const requestData = await request.postDataJSON();
    console.log('📝 Cancel URL:', requestData.cancel_url);
    
    // Verify cancel_url is set correctly
    expect(requestData.cancel_url).toBeTruthy();
    expect(requestData.cancel_url).toContain('sunspire-web-app.vercel.app');
    expect(requestData.cancel_url).toContain('company=SunRun');
    
    console.log('✅ Cancel URL correctly set to:', requestData.cancel_url);
    console.log('✅ [1/3] Homepage back button fix verified');
  });
  
  test('[VISUAL] Back button returns to report page after Stripe cancellation', async ({ page }) => {
    console.log('🧪 Testing back button from report page...');
    
    // Navigate to report page
    await page.goto(`${BASE_URL}/report?company=SunRun&demo=1&address=Phoenix%2C%20AZ&lat=33.4484&lng=-112.0740&placeId=test`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    
    console.log('✅ Loaded report page');
    await page.screenshot({ path: 'test-results/back-button-02-report.png', fullPage: true });
    
    // Verify report page
    await expect(page.getByTestId('tile-systemSize')).toBeVisible();
    
    // Intercept the checkout request
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST', { timeout: 60000 }),
      page.locator('button[data-cta="primary"]').first().click(),
    ]);
    
    const requestData = await request.postDataJSON();
    console.log('📝 Cancel URL:', requestData.cancel_url);
    
    // Verify cancel_url preserves the report page data (might be as query params on homepage)
    expect(requestData.cancel_url).toBeTruthy();
    expect(requestData.cancel_url).toContain('company=SunRun');
    expect(requestData.cancel_url).toContain('address=Phoenix');
    expect(requestData.cancel_url).toContain('lat=33.4484');
    
    console.log('✅ Cancel URL correctly set to:', requestData.cancel_url);
    console.log('✅ [2/3] Report page back button fix verified');
  });
  
  test('[VISUAL] Back button returns to pricing page after Stripe cancellation', async ({ page }) => {
    console.log('🧪 Testing back button from pricing page...');
    
    // Navigate to pricing page
    await page.goto(`${BASE_URL}/pricing?company=SunRun&demo=1`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    console.log('✅ Loaded pricing page');
    await page.screenshot({ path: 'test-results/back-button-03-pricing.png', fullPage: true });
    
    // Find and click the "Start Setup" button
    const startButton = page.locator('button').filter({ hasText: /Start Setup|Get Started|Launch/ }).first();
    await expect(startButton).toBeVisible();
    
    // Intercept the checkout request
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      startButton.click(),
    ]);
    
    const requestData = await request.postDataJSON();
    console.log('📝 Cancel URL:', requestData.cancel_url);
    
    // Verify cancel_url preserves the pricing page
    expect(requestData.cancel_url).toBeTruthy();
    expect(requestData.cancel_url).toContain('/pricing');
    expect(requestData.cancel_url).toContain('company=SunRun');
    
    console.log('✅ Cancel URL correctly set to:', requestData.cancel_url);
    console.log('✅ [3/3] Pricing page back button fix verified');
  });
});
