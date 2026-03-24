const { chromium } = require('playwright');

async function quickVisualCheck() {
  console.log('🔍 Quick visual check of live site...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Check demo page
  console.log('📋 Checking demo page...');
  await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'demo-page.png', fullPage: true });
  console.log('✅ Demo page screenshot saved');
  
  // Check report page
  console.log('📋 Checking report page...');
  await page.goto('https://sunspire-web-app.vercel.app/report?company=Netflix&demo=1');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'report-page.png', fullPage: true });
  console.log('✅ Report page screenshot saved');
  
  console.log('🎉 Visual check complete!');
  
  await browser.close();
}

quickVisualCheck().catch(console.error);