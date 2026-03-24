const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000?company=Meta&demo=1');
  await page.waitForTimeout(2000);
  
  // Find the preview text
  const previewText = page.locator('text=Preview:').first();
  const button = page.locator('text=Generate Solar Report').first();
  
  const previewBox = await previewText.boundingBox();
  const buttonBox = await button.boundingBox();
  
  if (previewBox && buttonBox) {
    const gap = previewBox.y - (buttonBox.y + buttonBox.height);
    console.log('\n=== MEASUREMENT ===');
    console.log(`Button bottom Y: ${buttonBox.y + buttonBox.height}`);
    console.log(`Preview text top Y: ${previewBox.y}`);
    console.log(`Gap between button and text: ${gap}px`);
    console.log('==================\n');
  }
  
  console.log('\nKeeping browser open for 10 seconds...');
  await page.waitForTimeout(10000);
  
  await browser.close();
})();

