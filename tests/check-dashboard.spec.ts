import { test } from '@playwright/test';

test('Check dashboard page', async ({ page }) => {
  await page.goto('https://sunspire-web-app.vercel.app/c/sunrun?demo=1');
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: 'test-results/dashboard-page-check.png', fullPage: true });
  
  const bodyText = await page.locator('body').textContent();
  console.log('Full page text:', bodyText);
});
