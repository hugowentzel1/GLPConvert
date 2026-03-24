const { chromium } = require('playwright');

async function testAllSpacing() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Navigating to report page...');
    await page.goto('http://localhost:3000/report?address=1232+Virginia+Ct%2C+Atlanta%2C+GA+30306%2C+USA&lat=33.7785624&lng=-84.3445644&placeId=ChIJD4zdpqIG9YgRqe-qzW6mLQM&company=goole&demo=1', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    // Wait for elements to load
    await page.waitForSelector('[data-testid="hdr-logo"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="hdr-sub"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="hdr-address"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="hdr-meta"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="tile-systemSize"]', { timeout: 10000 });
    
    // Get the bounding boxes of all elements
    const logoBox = await page.locator('[data-testid="hdr-logo"]').boundingBox();
    const subheaderBox = await page.locator('[data-testid="hdr-sub"]').boundingBox();
    const addressBox = await page.locator('[data-testid="hdr-address"]').boundingBox();
    const metaBox = await page.locator('[data-testid="hdr-meta"]').boundingBox();
    const firstCardBox = await page.locator('[data-testid="tile-systemSize"]').boundingBox();
    
    if (logoBox && subheaderBox && addressBox && metaBox && firstCardBox) {
      // Calculate all the gaps
      const logoToSubheader = subheaderBox.y - (logoBox.y + logoBox.height);
      const subheaderToAddress = addressBox.y - (subheaderBox.y + subheaderBox.height);
      const addressToMeta = metaBox.y - (addressBox.y + addressBox.height);
      const metaToCards = firstCardBox.y - (metaBox.y + metaBox.height);
      
      console.log('📏 SPACING MEASUREMENTS:');
      console.log(`Logo to Subheader: ${logoToSubheader.toFixed(1)}px`);
      console.log(`Subheader to Address: ${subheaderToAddress.toFixed(1)}px`);
      console.log(`Address to Meta: ${addressToMeta.toFixed(1)}px`);
      console.log(`Meta to Cards: ${metaToCards.toFixed(1)}px`);
      
      console.log('\n🎯 TARGET SPACING:');
      console.log(`Logo to Subheader should be: ${logoToSubheader + 8}px (current + 8px)`);
      console.log(`Meta to Cards should match Address to Meta: ${addressToMeta.toFixed(1)}px`);
      
      // Take a screenshot for visual verification
      await page.screenshot({ 
        path: 'all-spacing-measurement.png',
        fullPage: true
      });
      console.log('📸 Screenshot saved as all-spacing-measurement.png');
      
    } else {
      console.log('❌ Could not get bounding boxes for elements');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testAllSpacing();
