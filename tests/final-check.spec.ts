import { test, expect, chromium } from '@playwright/test';

test('Final check with console', async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen to console
  page.on('console', msg => {
    console.log('BROWSER CONSOLE:', msg.text());
  });
  
  // Intercept
  await page.route('**localhost:3007/api/stripe/create-checkout-session', async route => {
    const postData = route.request().postData();
    console.log('===== REQUEST DATA =====');
    console.log(postData);
    const json = JSON.parse(postData || '{}');
    console.log('HAS cancel_url?', 'cancel_url' in json);
    console.log('HAS email?', 'email' in json);
    console.log('cancel_url value:', json.cancel_url);
    console.log('========================');
    await route.continue();
  });

  await page.goto(`http://localhost:3007/?company=TestCo&demo=1&v=${Date.now()}`);
  await page.waitForTimeout(3000);

  const cta = page.locator('button[data-cta="primary"]').first();
  await expect(cta).toBeVisible();
  await cta.click();
  await page.waitForTimeout(3000);
  
  await browser.close();
});
