import { test, expect } from '@playwright/test';

test('Inspect actual request sent', async ({ page, context }) => {
  // Disable cache
  await context.route('**/*', route => {
    const headers = route.request().headers();
    headers['cache-control'] = 'no-cache, no-store, must-revalidate';
    route.continue({ headers });
  });
  
  // Intercept all fetch requests
  await page.route('**localhost:3005/api/stripe/create-checkout-session', async route => {
    const request = route.request();
    const postData = request.postData();
    console.log('===== INTERCEPTED REQUEST =====');
    console.log('URL:', request.url());
    console.log('Method:', request.method());
    console.log('Post Data:', postData);
    try {
      const json = JSON.parse(postData || '{}');
      console.log('Parsed JSON:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Could not parse JSON');
    }
    console.log('===============================');
    // Continue the request
    await route.continue();
  });

  await page.goto(`http://localhost:3005/?company=Test&demo=1&v=${Date.now()}`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  // Click the CTA button
  console.log('Clicking CTA button...');
  const ctaButton = page.locator('button[data-cta="primary"]').first();
  await expect(ctaButton).toBeVisible();
  
  await ctaButton.click();
  await page.waitForTimeout(3000);
  
  console.log('Test complete');
});
