import { test, expect } from '@playwright/test';

test('Pricing Page - Proof Sidebar Verification', async ({ page }) => {
  console.log('🚀 Testing Pricing Page with Proof Sidebar');
  
  await page.goto('http://localhost:3000/pricing?company=Apple&demo=1', { 
    waitUntil: 'networkidle0',
    timeout: 15000 
  });
  
  await page.waitForTimeout(2000);
  
  // Verify proof sidebar exists
  const proofSidebar = await page.locator('text=Why Installers Switch').isVisible();
  expect(proofSidebar).toBe(true);
  console.log('✅ Proof sidebar visible');
  
  // Verify proof bullets
  const proofBullet1 = await page.locator('text=Setup under 24 hours — no coding required').isVisible();
  expect(proofBullet1).toBe(true);
  console.log('✅ Proof bullet 1 verified');
  
  const proofBullet2 = await page.locator('text=Installers see +29% more booked jobs').isVisible();
  expect(proofBullet2).toBe(true);
  console.log('✅ Proof bullet 2 verified');
  
  // Take screenshot
  await page.screenshot({ path: 'pricing-check.png', fullPage: true });
  console.log('📸 Pricing page screenshot saved');
  
  console.log('🎉 Pricing page verification complete!');
});
