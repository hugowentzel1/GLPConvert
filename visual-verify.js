const { chromium } = require('playwright');

async function visualVerify() {
  console.log('🚀 VISUAL VERIFICATION - Starting...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('📋 Checking demo page...');
  await page.goto('http://localhost:3001/?company=Apple&demo=1');
  await page.waitForTimeout(2000);
  
  // Take screenshot
  await page.screenshot({ path: 'demo-verification.png', fullPage: true });
  console.log('📸 Demo page screenshot saved');
  
  // Quick checks
  const heroText = await page.locator('h1').textContent();
  const socialProof = await page.locator('text=Trusted by 100+ installers').isVisible();
  const testimonials = await page.locator('text=Cut quoting time').isVisible();
  const stats = await page.locator('text=28,417 quotes').isVisible();
  const ctaButton = await page.locator('[data-cta-button]').isVisible();
  
  console.log('✅ Hero:', heroText?.includes('Your Branded Solar Quote Tool'));
  console.log('✅ Social proof:', socialProof);
  console.log('✅ Testimonials:', testimonials);
  console.log('✅ Stats:', stats);
  console.log('✅ CTA button:', ctaButton);
  
  console.log('📋 Checking pricing page...');
  await page.goto('http://localhost:3001/pricing?company=Apple&demo=1');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'pricing-verification.png', fullPage: true });
  
  const proofSidebar = await page.locator('text=Why Installers Switch').isVisible();
  console.log('✅ Proof sidebar:', proofSidebar);
  
  console.log('🎉 VISUAL VERIFICATION COMPLETE!');
  await browser.close();
}

visualVerify().catch(console.error);
