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
  
  // Get the preview text container (the div that contains both lines)
  const previewContainer = page.locator('text=Preview:').first().locator('..');
  const previewBox = await previewContainer.boundingBox();
  
  if (cardBox && buttonBox && previewBox) {
    const buttonBottom = buttonBox.y + buttonBox.height;
    const cardBottom = cardBox.y + cardBox.height;
    
    // Calculate the MIDDLE of the preview text
    const previewMiddle = previewBox.y + (previewBox.height / 2);
    
    const gapAbovePreviewMiddle = previewMiddle - buttonBottom;
    const gapBelowPreviewMiddle = cardBottom - previewMiddle;
    
    console.log('\n=== CENTERING MEASUREMENT (from preview TEXT MIDDLE) ===');
    console.log(`Card bottom Y: ${cardBottom}`);
    console.log(`Button bottom Y: ${buttonBottom}`);
    console.log(`Preview top Y: ${previewBox.y}`);
    console.log(`Preview middle Y: ${previewMiddle}`);
    console.log(`Preview bottom Y: ${previewBox.y + previewBox.height}`);
    console.log(`Preview height: ${previewBox.height}px`);
    console.log('');
    console.log(`Gap from button to preview MIDDLE: ${gapAbovePreviewMiddle.toFixed(1)}px`);
    console.log(`Gap from preview MIDDLE to card bottom: ${gapBelowPreviewMiddle.toFixed(1)}px`);
    console.log('');
    console.log(`Difference: ${Math.abs(gapAbovePreviewMiddle - gapBelowPreviewMiddle).toFixed(1)}px`);
    if (Math.abs(gapAbovePreviewMiddle - gapBelowPreviewMiddle) < 2) {
      console.log('✅ Preview is CENTERED!');
    } else {
      console.log(gapAbovePreviewMiddle > gapBelowPreviewMiddle ? '❌ Preview is TOO LOW (middle closer to card bottom)' : '❌ Preview is TOO HIGH (middle closer to button)');
    }
    console.log('=========================================================\n');
  }
  
  console.log('Keeping browser open for 10 seconds...');
  await page.waitForTimeout(10000);
  
  await browser.close();
})();

