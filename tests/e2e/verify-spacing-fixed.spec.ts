import { test, expect } from '@playwright/test';

test('Verify How It Works spacing is fixed and consistent', async ({ page }) => {
  await page.goto('http://localhost:3000/?company=Metaa&demo=1', { 
    waitUntil: 'networkidle',
    timeout: 30000
  });
  await page.waitForTimeout(4000);
  
  // Find "How it works" section
  const howItWorks = page.locator('text=/How it works/i').first()
    .locator('xpath=ancestor::div[contains(@class, "max-w-4xl")]').first();
  
  await expect(howItWorks).toBeVisible({ timeout: 15000 });
  
  // Get computed styles
  const howItWorksStyles = await howItWorks.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      paddingTop: styles.paddingTop,
      paddingBottom: styles.paddingBottom,
      marginTop: styles.marginTop,
      marginBottom: styles.marginBottom,
      className: el.className,
    };
  });
  
  console.log('📏 How It Works Section Analysis:');
  console.log(`  Padding Top: ${howItWorksStyles.paddingTop}`);
  console.log(`  Padding Bottom: ${howItWorksStyles.paddingBottom}`);
  console.log(`  Margin Top: ${howItWorksStyles.marginTop}`);
  console.log(`  Margin Bottom: ${howItWorksStyles.marginBottom}`);
  console.log(`  Classes: ${howItWorksStyles.className}`);
  
  // Verify padding classes are correct
  expect(howItWorksStyles.className).toContain('py-8');
  expect(howItWorksStyles.className).toContain('md:py-10');
  
  // Verify padding values (py-8 = 2rem = 32px, md:py-10 = 2.5rem = 40px)
  const paddingTopValue = parseFloat(howItWorksStyles.paddingTop);
  const paddingBottomValue = parseFloat(howItWorksStyles.paddingBottom);
  
  console.log(`  Padding Top Value: ${paddingTopValue}px`);
  console.log(`  Padding Bottom Value: ${paddingBottomValue}px`);
  
  // Check that top and bottom padding are equal (within 2px tolerance)
  const paddingDifference = Math.abs(paddingTopValue - paddingBottomValue);
  console.log(`  Padding Difference: ${paddingDifference.toFixed(1)}px`);
  expect(paddingDifference).toBeLessThan(2);
  
  // Scroll to section and highlight
  await howItWorks.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  
  await howItWorks.evaluate((el) => {
    el.style.border = '4px solid #10b981';
    el.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
  });
  
  await page.waitForTimeout(500);
  
  // Take screenshot
  await page.screenshot({ 
    path: 'test-results/how-it-works-spacing-fixed.png', 
    fullPage: true 
  });
  
  console.log('✅ Screenshot saved: test-results/how-it-works-spacing-fixed.png');
  console.log('✅ Spacing is fixed and consistent!');
});

