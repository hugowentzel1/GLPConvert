const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('\n=== Testing LOCALHOST ===\n');
  
  try {
    console.log('Going to localhost...');
    await page.goto('http://localhost:3000/?company=test&demo=1', { timeout: 15000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    console.log('✅ Homepage loaded');
    
    const input = await page.locator('[data-testid="demo-address-input"]').first();
    await input.fill('1600 Amphitheatre Parkway, Mountain View, CA', { timeout: 10000 });
    console.log('✅ Address filled');
    
    await page.waitForTimeout(2000);
    const suggestion = page.locator('.pac-item').first();
    if (await suggestion.isVisible()) {
      await suggestion.click();
      console.log('✅ Suggestion clicked');
    }
    
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    
    const btn = page.getByRole('button', { name: /Generate Solar Report/i });
    await btn.click();
    console.log('✅ Button clicked');
    
    await page.waitForURL('**/report**', { timeout: 15000 });
    console.log('✅ Navigated to report page');
    
    // Wait max 15 seconds for loading to finish
    await page.waitForTimeout(15000);
    
    const content = await page.content();
    if (content.includes('Generating your solar')) {
      console.log('❌ STILL LOADING after 15 seconds');
      
      // Check browser console for errors
      const logs = await page.evaluate(() => {
        return window.console;
      });
      console.log('Browser logs:', logs);
    } else {
      console.log('✅ Page finished loading');
      
      const prodText = await page.locator('[data-testid="tile-annualProduction"]').textContent();
      console.log('Production:', prodText);
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  }
  
  await browser.close();
  process.exit(0);
})();

