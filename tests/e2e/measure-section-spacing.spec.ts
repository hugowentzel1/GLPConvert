import { test, expect } from '@playwright/test';

test('Measure spacing around How It Works section', async ({ page }) => {
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
  await expect(faq).toBeVisible({ timeout: 15000 });
  
  // Get bounding boxes
  const finalCtaBox = await finalCta.boundingBox();
  const howItWorksBox = await howItWorks.boundingBox();
  const faqBox = await faq.boundingBox();
  
  // Calculate actual spacing
  const spacingAbove = finalCtaBox && howItWorksBox
    ? howItWorksBox.y - (finalCtaBox.y + finalCtaBox.height)
    : null;
  const spacingBelow = howItWorksBox && faqBox
    ? faqBox.y - (howItWorksBox.y + howItWorksBox.height)
    : null;
  
  // Get computed styles
  const finalCtaStyles = await finalCta.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return { paddingBottom: styles.paddingBottom };
  });
  const howItWorksStyles = await howItWorks.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return { paddingTop: styles.paddingTop, paddingBottom: styles.paddingBottom };
  });
  const faqStyles = await faq.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return { marginTop: styles.marginTop };
  });
  
  console.log('📏 Spacing Measurements:');
  console.log(`  Final CTA padding-bottom: ${finalCtaStyles.paddingBottom}`);
  console.log(`  How It Works padding-top: ${howItWorksStyles.paddingTop}`);
  console.log(`  How It Works padding-bottom: ${howItWorksStyles.paddingBottom}`);
  console.log(`  FAQ margin-top: ${faqStyles.marginTop}`);
  console.log(`  Actual spacing ABOVE How It Works: ${spacingAbove?.toFixed(0)}px`);
  console.log(`  Actual spacing BELOW How It Works: ${spacingBelow?.toFixed(0)}px`);
  
  // Highlight sections
  await howItWorks.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  
  await howItWorks.evaluate((el) => {
    el.style.border = '4px solid #10b981';
  });
  await finalCta.evaluate((el) => {
    el.style.border = '2px solid #3b82f6';
  });
  await faq.evaluate((el) => {
    el.style.border = '2px solid #f59e0b';
  });
  
  await page.waitForTimeout(500);
  await page.screenshot({ 
    path: 'test-results/spacing-measurements.png', 
    fullPage: true 
  });
  
  console.log('✅ Screenshot saved');
});

