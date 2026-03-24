import { test, expect } from '@playwright/test';

test('Visually check activate page', async ({ page }) => {
  await page.goto('https://sunspire-web-app.vercel.app/activate?company=TestCompany&session_id=cs_test_123&plan=starter');
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: 'test-results/activate-page-visual.png', fullPage: true });
  
  // Check for key elements
  const hasInstantURL = await page.locator('text=Instant URL').isVisible().catch(() => false);
  const hasEmbedCode = await page.locator('text=Embed Code').isVisible().catch(() => false);
  const hasCustomDomain = await page.locator('text=Custom Domain').isVisible().catch(() => false);
  
  console.log('Has "Instant URL"?', hasInstantURL);
  console.log('Has "Embed Code"?', hasEmbedCode);
  console.log('Has "Custom Domain"?', hasCustomDomain);
  
  expect(hasInstantURL || hasEmbedCode || hasCustomDomain).toBe(true);
});
