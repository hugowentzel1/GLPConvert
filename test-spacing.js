const { chromium } = require('playwright');

async function testSpacing() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Navigating to report page...');
    await page.goto('http://localhost:3000/report?address=1232+Virginia+Ct%2C+Atlanta%2C+GA+30306%2C+USA&lat=33.7785624&lng=-84.3445644&placeId=ChIJD4zdpqIG9YgRqe-qzW6mLQM&company=goole&demo=1', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    // Wait for elements to load
    await page.waitForSelector('[data-testid="hdr-meta"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="tile-systemSize"]', { timeout: 10000 });
    
    // Get the bounding boxes of the meta info and first card
    const metaInfoBox = await page.locator('[data-testid="hdr-meta"]').boundingBox();
    const firstCardBox = await page.locator('[data-testid="tile-systemSize"]').boundingBox();
    
    if (metaInfoBox && firstCardBox) {
      // Calculate the vertical gap between meta info bottom and first card top
      const gap = firstCardBox.y - (metaInfoBox.y + metaInfoBox.height);
      
      console.log('📏 SPACING MEASUREMENTS:');
      console.log(`Meta info position: y=${metaInfoBox.y.toFixed(1)}, height=${metaInfoBox.height.toFixed(1)}`);
      console.log(`First card position: y=${firstCardBox.y.toFixed(1)}, height=${firstCardBox.height.toFixed(1)}`);
      console.log(`Vertical gap between meta info and cards: ${gap.toFixed(1)}px`);
      
      // Take a screenshot for visual verification
      await page.screenshot({ 
        path: 'spacing-measurement.png',
        fullPage: true
      });
      console.log('📸 Screenshot saved as spacing-measurement.png');
      
      // Test if the gap is small enough (less than 20px would indicate tight spacing)
      if (gap < 20) {
        console.log('✅ SUCCESS: Gap is small, negative margin is working!');
      } else {
        console.log('❌ FAIL: Gap is still too large, negative margin not effective enough');
      }
      
    } else {
      console.log('❌ Could not get bounding boxes for elements');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testSpacing();
