import { test, expect } from '@playwright/test';

test('Visual check of customer dashboard', async ({ page }) => {
  console.log('📸 Loading customer dashboard page...');
  
  await page.goto('https://sunspire-web-app.vercel.app/c/sunrun?demo=1');
  await page.waitForTimeout(5000);
  
  console.log('📸 Taking screenshot...');
  await page.screenshot({ path: 'test-results/dashboard-visual-check.png', fullPage: true });
  
  // Check what's on the page
  const bodyText = await page.locator('body').textContent();
  console.log('=== PAGE CONTENT ===');
  console.log(bodyText?.substring(0, 1000));
  console.log('===================');
  
  // Check for key elements
  const hasInstantURL = await page.locator('text=Instant URL').isVisible().catch(() => false);
  const hasEmbedCode = await page.locator('text=Embed Code').isVisible().catch(() => false);
  const hasCustomDomain = await page.locator('text=Custom Domain').isVisible().catch(() => false);
  const hasAPIKey = await page.locator('text=API Key').isVisible().catch(() => false);
  const hasActive = await page.locator('text=Active').isVisible().catch(() => false);
  
  console.log('\n=== DASHBOARD ELEMENTS ===');
  console.log('✓ Instant URL:', hasInstantURL);
  console.log('✓ Embed Code:', hasEmbedCode);
  console.log('✓ Custom Domain:', hasCustomDomain);
  console.log('✓ API Key:', hasAPIKey);
  console.log('✓ Active Badge:', hasActive);
  console.log('========================\n');
  
  console.log('✅ Screenshot saved to: test-results/dashboard-visual-check.png');
});
