import { test, expect } from '@playwright/test';

test.describe('How It Works Section Spacing', () => {
  test('Verify spacing matches rest of page', async ({ page }) => {
    // Navigate to demo page
    await page.goto('http://localhost:3000/?demo=1', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Find the "How it works" section
    const howItWorksSection = page.locator('text=/How it works/i').first();
    await expect(howItWorksSection).toBeVisible();
    
    // Get the wrapper div (parent container)
    const wrapper = howItWorksSection.locator('xpath=ancestor::div[contains(@class, "max-w-4xl")]').first();
    
    // Verify it has the correct spacing classes
    const className = await wrapper.getAttribute('class');
    console.log('Wrapper classes:', className);
    
    // Check that it has pt-10 pb-10 md:pt-12 md:pb-12
    expect(className).toContain('pt-10');
    expect(className).toContain('pb-10');
    expect(className).toContain('md:pt-12');
    expect(className).toContain('md:pb-12');
    
    // Take screenshot of the section
    await wrapper.screenshot({ path: 'test-results/how-it-works-spacing-verified.png' });
    
    // Take full page screenshot for context
    await page.screenshot({ path: 'test-results/how-it-works-full-page.png', fullPage: true });
    
    console.log('✅ Spacing verified: pt-10 pb-10 md:pt-12 md:pb-12');
  });
});

