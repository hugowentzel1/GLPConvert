import { test, expect } from '@playwright/test';

test.describe('Visual Check - Localhost', () => {
  test('How it works section spacing', async ({ page }) => {
    await page.goto('http://localhost:3000/?demo=1', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Find and highlight the "How it works" section
    const section = page.locator('text=/How it works/i').first();
    await expect(section).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/how-it-works-visual.png', 
      fullPage: true 
    });
    
    // Highlight the section
    await section.evaluate((el) => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'test-results/how-it-works-highlighted.png', 
      fullPage: true 
    });
    
    console.log('✅ Screenshots saved to test-results/');
  });
  
  test('Branded demo page - Metaa', async ({ page }) => {
    await page.goto('http://localhost:3000/?company=Metaa&demo=1', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ 
      path: 'test-results/metaa-demo-visual.png', 
      fullPage: true 
    });
    
    console.log('✅ Metaa demo screenshot saved');
  });
});

