const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Opening demo page...');
  await page.goto('http://localhost:3000?company=Meta&demo=1');
  await page.waitForTimeout(2000);
  
  // Submit first report
  console.log('Submitting first report...');
  const addressInput = page.locator('input[placeholder*="Start typing"]').first();
  await addressInput.click();
  await addressInput.fill('1600 Amphitheatre Parkway, Mountain View, CA');
  await page.waitForTimeout(1000);
  
  // Click the first autocomplete suggestion
  await page.locator('text=1600 Amphitheatre').first().click();
  await page.waitForTimeout(500);
  
  const button = page.locator('button[data-cta-button]').first();
  await button.click();
  
  console.log('Waiting for first report to load...');
  await page.waitForTimeout(5000);
  
  // Go back to home
  console.log('Going back to home for second report...');
  await page.goto('http://localhost:3000?company=Meta&demo=1');
  await page.waitForTimeout(2000);
  
  // Submit second report
  console.log('Submitting second report...');
  await addressInput.click();
  await addressInput.fill('1 Apple Park Way, Cupertino, CA');
  await page.waitForTimeout(1000);
  
  await page.locator('text=1 Apple Park').first().click();
  await page.waitForTimeout(500);
  
  await button.click();
  
  console.log('Waiting for second report to load...');
  await page.waitForTimeout(5000);
  
  // Go back to home - should now be locked
  console.log('Going back to home - should be locked now...');
  await page.goto('http://localhost:3000?company=Meta&demo=1');
  await page.waitForTimeout(2000);
  
  console.log('Checking if locked state is visible...');
  
  // Get the white card
  const card = page.locator('div.bg-white\\/80.backdrop-blur-xl.rounded-3xl').first();
  const cardBox = await card.boundingBox();
  
  // Get the button
  const genButton = page.locator('text=Generate Solar Report').first();
  const buttonBox = await genButton.boundingBox();
  
  // Look for the locked text
  const lockedText = page.locator('text=Demo limit reached');
  const isVisible = await lockedText.isVisible();
  
  console.log(`Locked state visible: ${isVisible}`);
  
  if (isVisible) {
    // Get the container with both lines of text
    const lockedContainer = lockedText.locator('../..');
    const lockedBox = await lockedContainer.boundingBox();
    
    if (cardBox && buttonBox && lockedBox) {
      const buttonBottom = buttonBox.y + buttonBox.height;
      const cardBottom = cardBox.y + cardBox.height;
      
      // Calculate the MIDDLE of the locked text block
      const lockedMiddle = lockedBox.y + (lockedBox.height / 2);
      
      const gapAboveLockedMiddle = lockedMiddle - buttonBottom;
      const gapBelowLockedMiddle = cardBottom - lockedMiddle;
      
      console.log('\n=== LOCKED STATE CENTERING (from locked text MIDDLE) ===');
      console.log(`Card bottom Y: ${cardBottom}`);
      console.log(`Button bottom Y: ${buttonBottom}`);
      console.log(`Locked text top Y: ${lockedBox.y}`);
      console.log(`Locked text middle Y: ${lockedMiddle}`);
      console.log(`Locked text bottom Y: ${lockedBox.y + lockedBox.height}`);
      console.log(`Locked text height: ${lockedBox.height}px`);
      console.log('');
      console.log(`Gap from button to locked text MIDDLE: ${gapAboveLockedMiddle.toFixed(1)}px`);
      console.log(`Gap from locked text MIDDLE to card bottom: ${gapBelowLockedMiddle.toFixed(1)}px`);
      console.log('');
      console.log(`Difference: ${Math.abs(gapAboveLockedMiddle - gapBelowLockedMiddle).toFixed(1)}px`);
      if (Math.abs(gapAboveLockedMiddle - gapBelowLockedMiddle) < 3) {
        console.log('✅ Locked text is CENTERED!');
      } else {
        console.log(gapAboveLockedMiddle > gapBelowLockedMiddle ? '❌ Locked text is TOO LOW (middle closer to card bottom)' : '❌ Locked text is TOO HIGH (middle closer to button)');
      }
      console.log('==========================================================\n');
    }
  } else {
    console.log('❌ Could not find locked state text');
  }
  
  console.log('Keeping browser open for 15 seconds...');
  await page.waitForTimeout(15000);
  
  await browser.close();
})();
