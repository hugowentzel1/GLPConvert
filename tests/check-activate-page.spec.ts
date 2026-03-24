import { test, expect } from '@playwright/test';

test('Check activate page content', async ({ page }) => {
  await page.goto('https://sunspire-web-app.vercel.app/activate?company=TestCo&session_id=test123&plan=starter');
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: 'test-results/activate-page-check.png', fullPage: true });
  
  const content = await page.content();
  console.log('Page contains "Instant URL"?', content.includes('Instant URL'));
  console.log('Page contains "Embed Code"?', content.includes('Embed Code'));
  console.log('Page contains "Custom Domain"?', content.includes('Custom Domain'));
  console.log('Page contains "Copy"?', content.includes('Copy'));
  
  // Get visible text
  const bodyText = await page.locator('body').textContent();
  console.log('Visible text (first 500 chars):', bodyText?.substring(0, 500));
});
