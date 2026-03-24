import { test, expect } from '@playwright/test';

test('Test checkout function directly', async ({ page }) => {
  // Enable console logging
  page.on('console', msg => {
    if (msg.text().includes('[checkout]')) {
      console.log('BROWSER:', msg.text());
    }
  });

  await page.goto('http://localhost:3000/?company=Test&demo=1');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  // Click the CTA button
  console.log('Clicking CTA button...');
  const ctaButton = page.locator('button[data-cta="primary"]').first();
  await expect(ctaButton).toBeVisible();
  
  await ctaButton.click();
  await page.waitForTimeout(2000);
  
  console.log('Test complete');
});
