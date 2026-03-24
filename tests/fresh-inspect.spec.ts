import { test, expect, chromium } from '@playwright/test';

test('Inspect with fresh browser', async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    bypassCSP: true,
  });
  const page = await context.newPage();
  
  // Clear all cache and storage
  await context.clearCookies();
  
  // Intercept requests
  await page.route('**localhost:3006/api/stripe/create-checkout-session', async route => {
    const request = route.request();
    const postData = request.postData();
    console.log('===== INTERCEPTED REQUEST =====');
    console.log('Post Data:', postData);
    try {
      const json = JSON.parse(postData || '{}');
      console.log('Parsed JSON:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Could not parse JSON');
    }
    console.log('===============================');
    await route.continue();
  });

  const timestamp = Date.now();
  await page.goto(`http://localhost:3006/?company=Test&demo=1&cachebust=${timestamp}`, { 
    waitUntil: 'networkidle'
  });
  
  console.log('Page loaded, waiting for CTA...');
  await page.waitForTimeout(3000);

  const ctaButton = page.locator('button[data-cta="primary"]').first();
  await expect(ctaButton).toBeVisible();
  
  console.log('Clicking CTA button...');
  await ctaButton.click();
  await page.waitForTimeout(3000);
  
  console.log('Test complete');
  await browser.close();
});
