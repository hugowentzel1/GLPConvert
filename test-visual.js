const { chromium } = require('playwright');

async function takeScreenshot() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/?company=Apple&demo=1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Take full page screenshot
  await page.screenshot({ path: 'current-page.png', fullPage: true });
  
  // Take screenshot of KPI band specifically
  const kpiBand = page.locator('div:has-text("28,417")').first();
  await kpiBand.screenshot({ path: 'kpi-band-current.png' });
  
  console.log('Screenshots taken: current-page.png and kpi-band-current.png');
  
  await browser.close();
}

takeScreenshot().catch(console.error);
