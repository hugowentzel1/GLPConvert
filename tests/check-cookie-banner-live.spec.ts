import { test } from '@playwright/test';

test('Check if cookie banner shows on production', async ({ page }) => {
  console.log('\n🍪 CHECKING COOKIE BANNER ON PRODUCTION\n');
  
  await page.goto('https://sunspire-web-app.vercel.app/?company=TestCo&demo=1');
  await page.waitForTimeout(8000);
  
  const bannerCount = await page.locator('#cookie-banner, [data-cookie-banner]').count();
  const bannerVisible = await page.locator('#cookie-banner, [data-cookie-banner]').isVisible().catch(() => false);
  
  console.log('Cookie banner element count:', bannerCount);
  console.log('Cookie banner visible:', bannerVisible);
  
  // Check localStorage
  const hasAccepted = await page.evaluate(() => {
    return localStorage.getItem('cookie-consent');
  });
  console.log('LocalStorage cookie-consent:', hasAccepted);
  
  // Take screenshot
  await page.screenshot({ path: 'cookie-banner-check.png', fullPage: true });
  
  console.log('\n✅ Screenshot saved to cookie-banner-check.png');
  console.log('\n🍪 COOKIE BANNER STATUS:', bannerVisible ? '✅ PRESENT' : '❌ NOT VISIBLE');
});


