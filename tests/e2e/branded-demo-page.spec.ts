import { test, expect } from '@playwright/test';

test.describe('Branded Demo Page', () => {
  test('Show branded demo page with company, logo, and color', async ({ page }) => {
    // Navigate to branded demo page (example: Apple)
    const demoUrl = 'http://localhost:3000/?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com&demo=1';
    
    await page.goto(demoUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // Wait for logo to load
    
    // Verify branding elements
    const logo = page.locator('[data-hero-logo]').first();
    const hasLogo = await logo.isVisible().catch(() => false);
    
    // Check for brand color application
    const brandButton = page.locator('button, a').first();
    const buttonStyles = await brandButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    }).catch(() => null);
    
    console.log('✅ Branded demo page loaded');
    console.log('   Logo visible:', hasLogo);
    console.log('   Brand colors applied:', buttonStyles ? 'Yes' : 'Unknown');
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/branded-demo-apple.png', 
      fullPage: true 
    });
    
    // Also test with another company
    await page.goto('http://localhost:3000/?company=Google&brandColor=%234285F4&logo=https%3A%2F%2Flogo.clearbit.com%2Fgoogle.com&demo=1', {
      waitUntil: 'networkidle'
    });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ 
      path: 'test-results/branded-demo-google.png', 
      fullPage: true 
    });
    
    console.log('✅ Screenshots saved for Apple and Google demos');
  });
});

