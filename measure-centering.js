const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000?company=Meta&demo=1');
  await page.waitForTimeout(2000);
  
  // Get the white card
  const card = page.locator('div.bg-white\\/80.backdrop-blur-xl.rounded-3xl').first();
  const cardBox = await card.boundingBox();
  
  // Get the button
  const button = page.locator('text=Generate Solar Report').first();
  const buttonBox = await button.boundingBox();
  
  // Get the preview text
  const previewText = page.locator('text=Preview:').first();
  const previewBox = await previewText.boundingBox();
  
  if (cardBox && buttonBox && previewBox) {
    const buttonBottom = buttonBox.y + buttonBox.height;
    const cardBottom = cardBox.y + cardBox.height;
    const previewTop = previewBox.y;
    const previewBottom = previewBox.y + previewBox.height;
    
    const gapAbovePreview = previewTop - buttonBottom;
    const gapBelowPreview = cardBottom - previewBottom;
    
    console.log('\n=== CENTERING MEASUREMENT ===');
    console.log(`Card bottom Y: ${cardBottom}`);
    console.log(`Button bottom Y: ${buttonBottom}`);
    console.log(`Preview top Y: ${previewTop}`);
    console.log(`Preview bottom Y: ${previewBottom}`);
    console.log('');
    console.log(`Gap ABOVE preview (button to preview): ${gapAbovePreview.toFixed(1)}px`);
    console.log(`Gap BELOW preview (preview to card bottom): ${gapBelowPreview.toFixed(1)}px`);
    console.log('');
    console.log(`Difference: ${Math.abs(gapAbovePreview - gapBelowPreview).toFixed(1)}px`);
    console.log(gapAbovePreview > gapBelowPreview ? '❌ Preview is TOO HIGH (closer to button)' : '❌ Preview is TOO LOW (closer to card bottom)');
    console.log('===========================\n');
  }
  
  console.log('Keeping browser open for 10 seconds...');
  await page.waitForTimeout(10000);
  
  await browser.close();
})();

