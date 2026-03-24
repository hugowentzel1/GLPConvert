const { chromium } = require('playwright');

async function measureExactSpacing() {
  console.log('📏 Measuring exact spacing on demo version...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to demo version
    const demoUrl = 'http://localhost:3000/report?address=1232+Virginia+Ct%2C+Atlanta%2C+GA+30306%2C+USA&lat=33.7785624&lng=-84.3445644&placeId=ChIJD4zdpqIG9YgRqe-qzW6mLQM&company=google&demo=1';
    
    console.log('📍 Navigating to demo version...');
    await page.goto(demoUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    
    // Measure the spacing
    const measurements = await page.evaluate(() => {
      // Get address element
      const address = document.querySelector('[data-testid="hdr-address"]');
      
      // Get meta info element
      const meta = document.querySelector('[data-testid="hdr-meta"]');
      
      // Get first estimation card (metric tiles)
      const cards = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4');
      
      if (!address || !meta || !cards) {
        return {
          error: 'Could not find required elements',
          addressFound: !!address,
          metaFound: !!meta,
          cardsFound: !!cards
        };
      }
      
      // Get bounding rectangles
      const addressRect = address.getBoundingClientRect();
      const metaRect = meta.getBoundingClientRect();
      const cardsRect = cards.getBoundingClientRect();
      
      // Calculate distances
      // Distance from bottom of address to top of meta info
      const addressToMeta = metaRect.top - addressRect.bottom;
      
      // Distance from bottom of meta info to top of cards
      const metaToCards = cardsRect.top - metaRect.bottom;
      
      return {
        addressToMeta: addressToMeta,
        metaToCards: metaToCards,
        difference: Math.abs(metaToCards - addressToMeta),
        addressBottom: addressRect.bottom,
        metaTop: metaRect.top,
        metaBottom: metaRect.bottom,
        cardsTop: cardsRect.top
      };
    });
    
    if (measurements.error) {
      console.log('❌ Error:', measurements.error);
      console.log('Address found:', measurements.addressFound);
      console.log('Meta found:', measurements.metaFound);
      console.log('Cards found:', measurements.cardsFound);
    } else {
      console.log('📊 MEASUREMENTS:');
      console.log('================');
      console.log(`Distance from BOTTOM of address to TOP of meta info: ${measurements.addressToMeta.toFixed(1)}px`);
      console.log(`Distance from BOTTOM of meta info to TOP of cards: ${measurements.metaToCards.toFixed(1)}px`);
      console.log('');
      console.log(`Difference: ${measurements.difference.toFixed(1)}px`);
      console.log('');
      
      if (measurements.difference <= 5) {
        console.log('✅ Spacing is equal (within 5px tolerance)');
      } else {
        console.log('❌ Spacing is NOT equal (difference > 5px)');
      }
      
      console.log('');
      console.log('Raw positions (for debugging):');
      console.log(`- Address bottom: ${measurements.addressBottom.toFixed(1)}px`);
      console.log(`- Meta top: ${measurements.metaTop.toFixed(1)}px`);
      console.log(`- Meta bottom: ${measurements.metaBottom.toFixed(1)}px`);
      console.log(`- Cards top: ${measurements.cardsTop.toFixed(1)}px`);
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'spacing-measurement-demo.png', 
      fullPage: true 
    });
    console.log('\n📸 Screenshot saved: spacing-measurement-demo.png');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

measureExactSpacing();
