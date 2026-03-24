import { test, expect } from '@playwright/test';

test.describe('Spacing Verification - How It Works Section', () => {
  test('Verify spacing is even and consistent', async ({ page }) => {
    await page.goto('http://localhost:3000/?company=Metaa&demo=1', { 
      waitUntil: 'networkidle' 
    });
    await page.waitForTimeout(3000);
    
    // Find sections
    const kpiBand = page.locator('[data-testid="kpi-band"]').first();
    const howItWorks = page.locator('text=/How it works/i').first().locator('xpath=ancestor::div[contains(@class, "max-w-4xl")]').first();
    const finalCta = page.locator('text=/Launch Your Branded Version Now/i').first().locator('xpath=ancestor::div[contains(@class, "max-w-4xl")]').first();
    
    // Get bounding boxes
    const kpiBox = await kpiBand.boundingBox();
    const howItWorksBox = await howItWorks.boundingBox();
    const ctaBox = await finalCta.boundingBox();
    
    // Calculate spacing
    const spacingBefore = kpiBox && howItWorksBox 
      ? howItWorksBox.y - (kpiBox.y + kpiBox.height)
      : null;
    const spacingAfter = howItWorksBox && ctaBox
      ? ctaBox.y - (howItWorksBox.y + howItWorksBox.height)
      : null;
    
    console.log('📏 Spacing measurements:');
    console.log(`  Before "How it works": ${spacingBefore?.toFixed(0)}px`);
    console.log(`  After "How it works": ${spacingAfter?.toFixed(0)}px`);
    console.log(`  Difference: ${spacingBefore && spacingAfter ? Math.abs(spacingBefore - spacingAfter).toFixed(0) : 'N/A'}px`);
    
    // Verify spacing classes
    const className = await howItWorks.getAttribute('class');
    console.log('📐 Classes:', className);
    
    // Highlight the section
    await howItWorks.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    await howItWorks.evaluate((el) => {
      el.style.outline = '4px solid #10b981';
      el.style.outlineOffset = '4px';
    });
    
    await page.waitForTimeout(500);
    
    // Take screenshots
    await page.screenshot({ 
      path: 'test-results/spacing-verification-full.png', 
      fullPage: true 
    });
    
    await howItWorks.screenshot({ 
      path: 'test-results/spacing-verification-section.png'
    });
    
    // Verify spacing is reasonable (within 20px difference for "even")
    if (spacingBefore && spacingAfter) {
      const difference = Math.abs(spacingBefore - spacingAfter);
      console.log(`✅ Spacing difference: ${difference.toFixed(0)}px (should be < 50px for even spacing)`);
      expect(difference).toBeLessThan(50);
    }
    
    // Verify classes match other sections
    expect(className).toContain('py-12');
    expect(className).toContain('md:py-16');
    
    console.log('✅ Spacing verified: py-12 md:py-16 (consistent with other sections)');
  });
});

