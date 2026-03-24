/**
 * VISUAL LOGO DEMONSTRATION
 * Opens browser windows to visually verify logos are working
 */

import { test } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://sunspire-web-app.vercel.app';

test.describe('🎨 Visual Logo Demonstration', () => {
  
  test('Open Demo & Paid versions with logos - VISUAL CHECK', async ({ page, browser }) => {
    console.log('\n🎨 Opening browser windows for visual logo verification...\n');
    
    // Demo version - Apple
    console.log('📱 Opening DEMO version with Apple logo...');
    const demoApple = await browser.newPage();
    await demoApple.goto(
      `${BASE_URL}/?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com&demo=1`,
      { waitUntil: 'networkidle' }
    );
    await demoApple.waitForTimeout(3000);
    
    // Check logo
    const logo1 = demoApple.locator('[data-hero-logo] img').first();
    const logo1Visible = await logo1.isVisible().catch(() => false);
    console.log(`   ✅ Apple logo (demo) visible: ${logo1Visible}`);
    
    if (logo1Visible) {
      await logo1.scrollIntoViewIfNeeded();
      await demoApple.screenshot({ path: 'test-results/visual-apple-demo.png', fullPage: true });
      console.log('   📸 Screenshot: test-results/visual-apple-demo.png');
    }
    
    // Paid version - Apple
    console.log('💼 Opening PAID version with Apple logo...');
    const paidApple = await browser.newPage();
    await paidApple.goto(
      `${BASE_URL}/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com`,
      { waitUntil: 'networkidle' }
    );
    await paidApple.waitForTimeout(3000);
    
    const logo2 = paidApple.locator('[data-hero-logo] img').first();
    const logo2Visible = await logo2.isVisible().catch(() => false);
    console.log(`   ✅ Apple logo (paid) visible: ${logo2Visible}`);
    
    if (logo2Visible) {
      await logo2.scrollIntoViewIfNeeded();
      await paidApple.screenshot({ path: 'test-results/visual-apple-paid.png', fullPage: true });
      console.log('   📸 Screenshot: test-results/visual-apple-paid.png');
    }
    
    // Demo version - Google
    console.log('📱 Opening DEMO version with Google logo...');
    const demoGoogle = await browser.newPage();
    await demoGoogle.goto(
      `${BASE_URL}/?company=Google&brandColor=%234285F4&logo=https%3A%2F%2Flogo.clearbit.com%2Fgoogle.com&demo=1`,
      { waitUntil: 'networkidle' }
    );
    await demoGoogle.waitForTimeout(3000);
    
    const logo3 = demoGoogle.locator('[data-hero-logo] img').first();
    const logo3Visible = await logo3.isVisible().catch(() => false);
    console.log(`   ✅ Google logo (demo) visible: ${logo3Visible}`);
    
    if (logo3Visible) {
      await logo3.scrollIntoViewIfNeeded();
      await demoGoogle.screenshot({ path: 'test-results/visual-google-demo.png', fullPage: true });
      console.log('   📸 Screenshot: test-results/visual-google-demo.png');
    }
    
    // Paid version - Google
    console.log('💼 Opening PAID version with Google logo...');
    const paidGoogle = await browser.newPage();
    await paidGoogle.goto(
      `${BASE_URL}/paid?company=Google&brandColor=%234285F4&logo=https%3A%2F%2Flogo.clearbit.com%2Fgoogle.com`,
      { waitUntil: 'networkidle' }
    );
    await paidGoogle.waitForTimeout(3000);
    
    const logo4 = paidGoogle.locator('[data-hero-logo] img').first();
    const logo4Visible = await logo4.isVisible().catch(() => false);
    console.log(`   ✅ Google logo (paid) visible: ${logo4Visible}`);
    
    if (logo4Visible) {
      await logo4.scrollIntoViewIfNeeded();
      await paidGoogle.screenshot({ path: 'test-results/visual-google-paid.png', fullPage: true });
      console.log('   📸 Screenshot: test-results/visual-google-paid.png');
    }
    
    // Wait for images to load and verify
    console.log('\n⏳ Waiting for logos to fully load...\n');
    await demoApple.waitForTimeout(5000);
    await paidApple.waitForTimeout(5000);
    await demoGoogle.waitForTimeout(5000);
    await paidGoogle.waitForTimeout(5000);
    
    // Verify logos actually loaded
    const verifyLogo = async (page: any, name: string) => {
      const loaded = await page.evaluate(() => {
        const img = document.querySelector('[data-hero-logo] img') as HTMLImageElement;
        return img && img.complete && img.naturalWidth > 0;
      });
      console.log(`   ${loaded ? '✅' : '❌'} ${name}: ${loaded ? 'LOADED' : 'NOT LOADED'}`);
      return loaded;
    };
    
    await verifyLogo(demoApple, 'Apple (demo)');
    await verifyLogo(paidApple, 'Apple (paid)');
    await verifyLogo(demoGoogle, 'Google (demo)');
    await verifyLogo(paidGoogle, 'Google (paid)');
    
    console.log('\n✅ All browser windows are open!');
    console.log('👀 Check the browser windows to see the logos visually.');
    console.log('⏸️  Keeping windows open for 60 seconds for inspection...\n');
    
    // Keep windows open for visual inspection
    await new Promise(resolve => setTimeout(resolve, 60000));
    
    await demoApple.close();
    await paidApple.close();
    await demoGoogle.close();
    await paidGoogle.close();
    
    console.log('✅ Visual demonstration complete!\n');
  });
});

