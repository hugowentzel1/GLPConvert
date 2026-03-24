const { chromium } = require('playwright');

async function measureSpecificSpacing() {
  console.log('📏 Measuring specific text-to-text spacing...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const demoUrl = 'http://localhost:3000/report?address=1232+Virginia+Ct%2C+Atlanta%2C+GA+30306%2C+USA&lat=33.7785624&lng=-84.3445644&placeId=ChIJD4zdpqIG9YgRqe-qzW6mLQM&company=google&demo=1';
    
    await page.goto(demoUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    
    const measurements = await page.evaluate(() => {
      // Get address element
      const address = document.querySelector('[data-testid="hdr-address"]');
      
      // Get meta info container
      const meta = document.querySelector('[data-testid="hdr-meta"]');
      
      // Get the cards element (white metric tiles)
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
      
      // Measurement 1: Bottom of "Expires in..." to TOP of white cards
      const expiresToCards = cardsRect.top - metaRect.bottom;
      
      // Measurement 2: Top of "Generated on..." to bottom of address
      const generatedToAddress = metaRect.top - addressRect.bottom;
      
      return {
        expiresToCards: expiresToCards,
        generatedToAddress: generatedToAddress,
        difference: Math.abs(expiresToCards - generatedToAddress),
        addressBottom: addressRect.bottom,
        metaTop: metaRect.top,
        metaBottom: metaRect.bottom,
        cardsTop: cardsRect.top,
        addressText: address.textContent?.substring(0, 50),
        metaText: meta.textContent?.substring(0, 100)
      };
    });
    
    if (measurements.error) {
      console.log('❌ Error:', measurements.error);
      console.log('Address found:', measurements.addressFound);
      console.log('Meta found:', measurements.metaFound);
      console.log('Cards found:', measurements.cardsFound);
    } else {
      console.log('📊 SPECIFIC MEASUREMENTS:');
      console.log('========================');
      console.log(`1. BOTTOM of "Expires in..." to TOP of white cards: ${measurements.expiresToCards.toFixed(1)}px`);
      console.log(`2. TOP of "Generated on..." to BOTTOM of address: ${measurements.generatedToAddress.toFixed(1)}px`);
      console.log('');
      console.log(`Difference: ${measurements.difference.toFixed(1)}px`);
      console.log('');
      
      if (measurements.difference <= 5) {
        console.log('✅ Spacing is equal (within 5px tolerance)');
      } else {
        console.log('❌ Spacing is NOT equal (difference > 5px)');
      }
      
      console.log('');
      console.log('For reference:');
      console.log(`- Address text: "${measurements.addressText}..."`);
      console.log(`- Meta text: "${measurements.metaText}..."`);
      console.log('');
      console.log('Raw positions:');
      console.log(`- Address bottom: ${measurements.addressBottom.toFixed(1)}px`);
      console.log(`- Meta top: ${measurements.metaTop.toFixed(1)}px`);
      console.log(`- Meta bottom: ${measurements.metaBottom.toFixed(1)}px`);
      console.log(`- Cards top: ${measurements.cardsTop.toFixed(1)}px`);
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'specific-spacing-measurement.png', 
      fullPage: true 
    });
    console.log('\n📸 Screenshot saved: specific-spacing-measurement.png');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

measureSpecificSpacing();
