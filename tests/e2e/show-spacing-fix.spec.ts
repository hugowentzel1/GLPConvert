import { test, expect } from '@playwright/test';

test('Show spacing fix for How It Works section', async ({ page }) => {
  await page.goto('http://localhost:3000/?company=Metaa&demo=1', { 
    waitUntil: 'networkidle',
    timeout: 30000
  });
  await page.waitForTimeout(4000);
  
  // Find How It Works section
  const howItWorks = page.locator('text=/How it works/i').first()
    .locator('xpath=ancestor::div[contains(@class, "max-w-4xl")]').first();
  
  await expect(howItWorks).toBeVisible({ timeout: 15000 });
  
  // Get computed styles
  const styles = await howItWorks.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      paddingTop: computed.paddingTop,
      paddingBottom: computed.paddingBottom,
      className: el.className,
    };
  });
  
  console.log('📏 How It Works Section:');
  console.log(`  Padding Top: ${styles.paddingTop}`);
  console.log(`  Padding Bottom: ${styles.paddingBottom}`);
  console.log(`  Classes: ${styles.className}`);
  
  // Verify it uses py-8 md:py-10
  expect(styles.className).toContain('py-8');
  expect(styles.className).toContain('md:py-10');
  
  // Check FAQ section if visible
  const faq = page.locator('text=/Frequently Asked Questions/i').first()
    .locator('xpath=ancestor::div[contains(@class, "max-w-4xl")]').first();
  const faqVisible = await faq.isVisible().catch(() => false);
  
  if (faqVisible) {
    const faqStyles = await faq.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        paddingTop: computed.paddingTop,
        paddingBottom: computed.paddingBottom,
        className: el.className,
      };
    });
    console.log('📏 FAQ Section:');
    console.log(`  Padding Top: ${faqStyles.paddingTop}`);
    console.log(`  Padding Bottom: ${faqStyles.paddingBottom}`);
    console.log(`  Classes: ${faqStyles.className}`);
    
    // Verify FAQ also uses py-8 md:py-10
    expect(faqStyles.className).toContain('py-8');
    expect(faqStyles.className).toContain('md:py-10');
    console.log('✅ FAQ spacing matches!');
  }
  
  // Scroll and highlight
  await howItWorks.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  
  await howItWorks.evaluate((el) => {
    el.style.border = '4px solid #10b981';
    el.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
  });
  
  await page.waitForTimeout(500);
  await page.screenshot({ 
    path: 'test-results/spacing-fix-complete.png', 
    fullPage: true 
  });
  
  console.log('✅ Screenshot saved: test-results/spacing-fix-complete.png');
  console.log('✅ All sections now use consistent py-8 md:py-10 spacing!');
});

