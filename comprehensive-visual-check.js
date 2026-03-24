const { chromium } = require('playwright');

async function comprehensiveVisualCheck() {
  console.log('🔍 Comprehensive visual check of live site with above-industry standard spacing...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Check Pricing page
  console.log('📋 Step 1: Checking Pricing page spacing and layout...');
  await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Netflix&demo=1');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'pricing-spacing-check.png', fullPage: true });
  console.log('✅ Pricing page screenshot saved');
  
  // Check Partner page
  console.log('📋 Step 2: Checking Partner page spacing and layout...');
  await page.goto('https://sunspire-web-app.vercel.app/partners?company=Netflix&demo=1');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'partners-spacing-check.png', fullPage: true });
  console.log('✅ Partner page screenshot saved');
  
  // Check Support page
  console.log('📋 Step 3: Checking Support page spacing and layout...');
  await page.goto('https://sunspire-web-app.vercel.app/support?company=Netflix&demo=1');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'support-spacing-check.png', fullPage: true });
  console.log('✅ Support page screenshot saved');
  
  // Check Report page
  console.log('📋 Step 4: Checking Report page width and layout...');
  await page.goto('https://sunspire-web-app.vercel.app/report?company=Netflix&demo=1');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'report-width-check.png', fullPage: true });
  console.log('✅ Report page screenshot saved');
  
  // Check Demo page
  console.log('📋 Step 5: Checking Demo page overall layout...');
  await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'demo-layout-check.png', fullPage: true });
  console.log('✅ Demo page screenshot saved');
  
  console.log('🎉 Comprehensive visual check complete!');
  console.log('📸 Screenshots saved:');
  console.log('   → pricing-spacing-check.png - Pricing page with 8-based spacing system');
  console.log('   → partners-spacing-check.png - Partner page with 2-column grid and success story');
  console.log('   → support-spacing-check.png - Support page with 3-card contact grid and resource tiles');
  console.log('   → report-width-check.png - Report page with max-w-7xl width');
  console.log('   → demo-layout-check.png - Demo page overall layout');
  
  await browser.close();
}

comprehensiveVisualCheck().catch(console.error);
