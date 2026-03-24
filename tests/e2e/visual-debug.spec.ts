import { test, expect } from '@playwright/test';

test('Visual Debug - See what loads', async ({ page }) => {
  // Navigate to Metaa demo page
  await page.goto('http://localhost:3000/?company=Metaa&demo=1', { 
    waitUntil: 'networkidle',
    timeout: 30000
  });
  
  // Wait for content to appear
  await page.waitForTimeout(5000);
  
  // Check what's visible
  const bodyText = await page.textContent('body').catch(() => '');
  const hasContent = bodyText.length > 100;
  
  console.log('Body text length:', bodyText.length);
  console.log('Has content:', hasContent);
  
  // Check for specific elements
  const hasHeader = await page.locator('header').isVisible().catch(() => false);
  const hasMain = await page.locator('main').isVisible().catch(() => false);
  const hasHowItWorks = await page.locator('text=/How it works/i').isVisible().catch(() => false);
  
  console.log('Header visible:', hasHeader);
  console.log('Main visible:', hasMain);
  console.log('How it works visible:', hasHowItWorks);
  
  // Take full page screenshot
  await page.screenshot({ 
    path: 'test-results/visual-debug-full.png', 
    fullPage: true 
  });
  
  // Check for errors in console
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  await page.waitForTimeout(2000);
  
  if (errors.length > 0) {
    console.log('Console errors:', errors);
  }
  
  // Verify page loaded
  expect(hasContent).toBeTruthy();
  console.log('✅ Page content loaded');
});

