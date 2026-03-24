import { test, expect } from '@playwright/test';

test('Verify spacing above and below How It Works is equal', async ({ page }) => {
  await page.goto('http://localhost:3000/?company=Metaa&demo=1', { 
    waitUntil: 'networkidle',
    timeout: 30000
  });
  await page.waitForTimeout(4000);
  
  // Find sections
  const finalCta = page.locator('text=/Launch Your Branded Version Now/i').first()
    .locator('xpath=ancestor::div[contains(@class, "max-w-4xl")]').first();
  const howItWorks = page.locator('text=/How it works/i').first()
    .locator('xpath=ancestor::div[contains(@class, "max-w-4xl")]').first();
  const faq = page.locator('text=/Frequently Asked Questions/i').first()
    .locator('xpath=ancestor::div[contains(@class, "max-w-4xl")]').first();
  
  await expect(finalCta).toBeVisible({ timeout: 15000 });
  await expect(howItWorks).toBeVisible({ timeout: 15000 });
  
  // FAQ might not be visible in all cases, check if it exists
  const faqVisible = await faq.isVisible().catch(() => false);
  
  // Get bounding boxes
  const finalCtaBox = await finalCta.boundingBox();
  const howItWorksBox = await howItWorks.boundingBox();
  const faqBox = faqVisible ? await faq.boundingBox() : null;
  
  // Calculate actual spacing
  const spacingAbove = finalCtaBox && howItWorksBox
    ? howItWorksBox.y - (finalCtaBox.y + finalCtaBox.height)
    : null;
  const spacingBelow = howItWorksBox && faqBox
    ? faqBox.y - (howItWorksBox.y + howItWorksBox.height)
    : null;
  
  // If no FAQ, check footer or next section
  let spacingBelowAlt = null;
  if (!faqVisible) {
    const footer = page.locator('footer').first();
    const footerBox = await footer.boundingBox();
    if (footerBox && howItWorksBox) {
      spacingBelowAlt = footerBox.y - (howItWorksBox.y + howItWorksBox.height);
    }
  }
  
  console.log('📏 Spacing Analysis:');
  console.log(`  Space ABOVE "How it works": ${spacingAbove?.toFixed(0)}px`);
  console.log(`  Space BELOW "How it works": ${spacingBelow?.toFixed(0) || spacingBelowAlt?.toFixed(0) || 'N/A'}px`);
  
  const actualSpacingBelow = spacingBelow || spacingBelowAlt;
  if (spacingAbove && actualSpacingBelow) {
    const difference = Math.abs(spacingAbove - actualSpacingBelow);
    console.log(`  Difference: ${difference.toFixed(0)}px`);
    expect(difference).toBeLessThan(15); // Allow 15px tolerance
    console.log('✅ Spacing is equal!');
  }
  
  // Get computed styles to verify
  const howItWorksStyles = await howItWorks.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      paddingTop: styles.paddingTop,
      paddingBottom: styles.paddingBottom,
      className: el.className,
    };
  });
  
  console.log(`  How It Works: ${howItWorksStyles.paddingTop} / ${howItWorksStyles.paddingBottom}`);
  
  // Verify FAQ uses padding if visible
  if (faqVisible) {
    const faqStyles = await faq.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        paddingTop: styles.paddingTop,
        paddingBottom: styles.paddingBottom,
        className: el.className,
      };
    });
    console.log(`  FAQ: ${faqStyles.paddingTop} / ${faqStyles.paddingBottom}`);
    expect(faqStyles.className).toContain('py-8');
    expect(faqStyles.className).toContain('md:py-10');
  }
  
  // Highlight sections
  await howItWorks.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  
  await howItWorks.evaluate((el) => {
    el.style.border = '4px solid #10b981';
    el.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
  });
  
  await page.waitForTimeout(500);
  await page.screenshot({ 
    path: 'test-results/equal-spacing-verified.png', 
    fullPage: true 
  });
  
  console.log('✅ Screenshot saved: test-results/equal-spacing-verified.png');
});

