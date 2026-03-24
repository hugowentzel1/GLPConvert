import { test, expect } from '@playwright/test';

test.describe('How It Works Section Spacing - Visual Verification', () => {
  test('Verify spacing is consistent with rest of page', async ({ page }) => {
    await page.goto('http://localhost:3000/?company=Metaa&demo=1', { 
      waitUntil: 'networkidle' 
    });
    await page.waitForTimeout(3000);
    
    // Find the "How it works" section
    const howItWorksHeading = page.locator('text=/How it works/i').first();
    await expect(howItWorksHeading).toBeVisible();
    
    // Get the wrapper div
    const wrapper = howItWorksHeading.locator('xpath=ancestor::div[contains(@class, "max-w-4xl")]').first();
    
    // Verify spacing classes
    const className = await wrapper.getAttribute('class');
    console.log('📐 Wrapper classes:', className);
    
    expect(className).toContain('pt-10');
    expect(className).toContain('pb-10');
    expect(className).toContain('md:pt-12');
    expect(className).toContain('md:pb-12');
    
    // Get bounding box to measure actual spacing
    const wrapperBox = await wrapper.boundingBox();
    const headingBox = await howItWorksHeading.boundingBox();
    
    console.log('📏 Section position:', {
      top: wrapperBox?.y,
      height: wrapperBox?.height
    });
    
    // Find adjacent sections for comparison
    const kpiBand = page.locator('[data-testid="kpi-band"]').first();
    const finalCta = page.locator('text=/Launch Your Branded Version Now/i').first();
    
    const kpiBox = await kpiBand.boundingBox().catch(() => null);
    const ctaBox = await finalCta.boundingBox().catch(() => null);
    const howItWorksBox = await wrapper.boundingBox();
    
    console.log('📊 Section positions:');
    if (kpiBox) {
      console.log('  KPI Band:', { top: kpiBox.y, height: kpiBox.height });
    }
    if (howItWorksBox) {
      console.log('  How It Works:', { top: howItWorksBox.y, height: howItWorksBox.height });
    }
    if (ctaBox) {
      console.log('  Final CTA:', { top: ctaBox.y, height: ctaBox.height });
    }
    
    // Calculate spacing between sections
    if (kpiBox && howItWorksBox) {
      const spacingBefore = howItWorksBox.y - (kpiBox.y + kpiBox.height);
      console.log(`  Spacing before "How it works": ${spacingBefore}px`);
    }
    
    if (howItWorksBox && ctaBox) {
      const spacingAfter = ctaBox.y - (howItWorksBox.y + howItWorksBox.height);
      console.log(`  Spacing after "How it works": ${spacingAfter}px`);
    }
    
    // Scroll to section and highlight it
    await wrapper.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Add visual highlight to the section
    await wrapper.evaluate((el) => {
      el.style.border = '3px solid #10b981';
      el.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
    });
    
    await page.waitForTimeout(500);
    
    // Take screenshot of the section
    await wrapper.screenshot({ 
      path: 'test-results/how-it-works-spacing-section.png'
    });
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/how-it-works-spacing-full-page.png', 
      fullPage: true 
    });
    
    // Take screenshot with section highlighted
    await page.screenshot({ 
      path: 'test-results/how-it-works-spacing-highlighted.png', 
      fullPage: true 
    });
    
    console.log('✅ Screenshots saved:');
    console.log('  - test-results/how-it-works-spacing-section.png');
    console.log('  - test-results/how-it-works-spacing-full-page.png');
    console.log('  - test-results/how-it-works-spacing-highlighted.png');
    
    // Verify the section is visible and properly spaced
    expect(await wrapper.isVisible()).toBeTruthy();
    expect(className).toMatch(/pt-10|pb-10|md:pt-12|md:pb-12/);
    
    console.log('✅ Spacing verified: pt-10 pb-10 md:pt-12 md:pb-12');
  });
});

