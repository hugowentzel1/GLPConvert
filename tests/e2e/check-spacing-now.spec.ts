import { test, expect } from '@playwright/test';

test('Check How It Works spacing visually', async ({ page }) => {
  await page.goto('http://localhost:3000/?company=Metaa&demo=1', { 
    waitUntil: 'networkidle',
    timeout: 30000
  });
  await page.waitForTimeout(4000);
  
  // Find the section
  const section = page.locator('text=/How it works/i').first()
    .locator('xpath=ancestor::div[contains(@class, "max-w-4xl")]').first();
  
  await expect(section).toBeVisible();
  
  // Get the actual classes
  const className = await section.getAttribute('class');
  console.log('Current classes:', className);
  
  // Highlight it
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  
  await section.evaluate((el) => {
    el.style.border = '5px solid red';
    el.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
  });
  
  // Get measurements
  const box = await section.boundingBox();
  console.log('Section position:', box);
  
  // Find sections before and after
  const kpiBand = page.locator('[data-testid="kpi-band"]').first();
  const finalCta = page.locator('text=/Launch Your Branded Version Now/i').first()
    .locator('xpath=ancestor::div[contains(@class, "max-w-4xl")]').first();
  
  const kpiBox = await kpiBand.boundingBox();
  const ctaBox = await finalCta.boundingBox();
  
  if (kpiBox && box) {
    const spacingBefore = box.y - (kpiBox.y + kpiBox.height);
    console.log(`Spacing BEFORE: ${spacingBefore}px`);
  }
  
  if (box && ctaBox) {
    const spacingAfter = ctaBox.y - (box.y + box.height);
    console.log(`Spacing AFTER: ${spacingAfter}px`);
  }
  
  // Screenshot
  await page.screenshot({ 
    path: 'test-results/spacing-check-now.png', 
    fullPage: true 
  });
  
  console.log('✅ Screenshot saved: test-results/spacing-check-now.png');
});

