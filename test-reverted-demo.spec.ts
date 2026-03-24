import { test, expect } from '@playwright/test';

test('Test reverted demo link', async ({ page }) => {
  // Enable console logging
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.text());
  });
  
  console.log('Testing demo link: http://localhost:3000/?company=Apple&demo=1');
  
  await page.goto('http://localhost:3000/?company=Apple&demo=1', { 
    waitUntil: 'networkidle0',
    timeout: 10000 
  });
  
  // Wait for React to hydrate
  await page.waitForTimeout(2000);
  
  // Check page title
  const title = await page.title();
  console.log('Page title:', title);
  
  // Check for Apple branding
  const content = await page.evaluate(() => {
    const body = document.body.innerText;
    return {
      hasApple: body.includes('Apple'),
      hasDemo: body.includes('demo'),
      hasInstantSolar: body.includes('Instant Solar Analysis'),
      hasTrustComponents: body.includes('LogoWall') || body.includes('Testimonial') || body.includes('MetricsBar'),
      searchParams: window.location.search
    };
  });
  
  console.log('Content analysis:', content);
  
  // Take a screenshot
  await page.screenshot({ path: 'reverted-demo-test.png', fullPage: true });
  console.log('Screenshot saved as reverted-demo-test.png');
  
  // Check if we can find Apple branding in the page
  const appleElements = await page.locator('text=Apple').count();
  console.log('Apple elements found:', appleElements);
  
  // Check if the page shows the correct content
  expect(content.hasApple).toBe(true);
});
