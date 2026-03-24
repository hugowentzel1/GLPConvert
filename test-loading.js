const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Navigating to localhost report page...');
  await page.goto('http://localhost:3000/?company=test&demo=1');
  await page.waitForLoadState('networkidle');
  
  console.log('Filling address...');
  const input = page.locator('[data-testid="demo-address-input"]');
  await input.fill('1600 Amphitheatre Parkway, Mountain View, CA');
  await page.waitForTimeout(2000);
  
  console.log('Clicking suggestion...');
  const suggestion = page.locator('.pac-item').first();
  if (await suggestion.isVisible()) {
    await suggestion.click();
  }
  
  await page.waitForTimeout(500);
  
  console.log('Clicking generate button...');
  const btn = page.getByRole('button', { name: /Generate Solar Report/i });
  await btn.click();
  
  console.log('Waiting for report page...');
  await page.waitForURL('**/report**', { timeout: 10000 });
  
  console.log('Waiting for content to load...');
  
  // Listen to console for errors
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  await page.waitForTimeout(15000);
  
  const content = await page.content();
  if (content.includes('Generating your solar')) {
    console.log('❌ STUCK ON LOADING!');
  } else {
    console.log('✅ Page loaded successfully');
  }
  
  await browser.close();
})();

