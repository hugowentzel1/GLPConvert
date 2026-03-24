const { chromium } = require('playwright');

async function detailedMeasurementExplanation() {
  console.log('🔍 DETAILED MEASUREMENT EXPLANATION\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const demoUrl = 'http://localhost:3000/report?address=1232+Virginia+Ct%2C+Atlanta%2C+GA+30306%2C+USA&lat=33.7785624&lng=-84.3445644&placeId=ChIJD4zdpqIG9YgRqe-qzW6mLQM&company=google&demo=1';
    
    await page.goto(demoUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    
    const detailedInfo = await page.evaluate(() => {
      // Get address element
      const address = document.querySelector('[data-testid="hdr-address"]');
      
      // Get meta info container
      const meta = document.querySelector('[data-testid="hdr-meta"]');
      
      // Get the cards element (white metric tiles)
      const cards = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4');
      
      if (!address || !meta || !cards) {
        return { error: 'Elements not found' };
      }
      
      // Get bounding rectangles
      const addressRect = address.getBoundingClientRect();
      const metaRect = meta.getBoundingClientRect();
      const cardsRect = cards.getBoundingClientRect();
      
      // Get the actual text content
      const addressText = address.textContent?.trim();
      const metaText = meta.textContent?.trim();
      
      // Find individual lines within meta info
      const metaLines = Array.from(meta.children).map(child => ({
        text: child.textContent?.trim(),
        rect: child.getBoundingClientRect()
      }));
      
      return {
        // Address info
        addressText,
        addressTop: addressRect.top,
        addressBottom: addressRect.bottom,
        
        // Meta container info
        metaText,
        metaTop: metaRect.top,
        metaBottom: metaRect.bottom,
        
        // Individual meta lines
        metaLines,
        
        // Cards info
        cardsTop: cardsRect.top,
        cardsBottom: cardsRect.bottom,
        
        // The two specific measurements
        measurement1: cardsRect.top - metaRect.bottom, // Bottom of meta to top of cards
        measurement2: metaRect.top - addressRect.bottom, // Top of meta to bottom of address
      };
    });
    
    if (detailedInfo.error) {
      console.log('❌ Error:', detailedInfo.error);
      return;
    }
    
    console.log('📍 ELEMENT LOCATIONS:');
    console.log('====================');
    console.log(`Address element: "${detailedInfo.addressText}"`);
    console.log(`  - Top: ${detailedInfo.addressTop.toFixed(1)}px`);
    console.log(`  - Bottom: ${detailedInfo.addressBottom.toFixed(1)}px`);
    console.log('');
    
    console.log('Meta info container:');
    console.log(`  - Full text: "${detailedInfo.metaText}"`);
    console.log(`  - Container top: ${detailedInfo.metaTop.toFixed(1)}px`);
    console.log(`  - Container bottom: ${detailedInfo.metaBottom.toFixed(1)}px`);
    console.log('');
    
    console.log('Individual meta lines:');
    detailedInfo.metaLines.forEach((line, index) => {
      console.log(`  Line ${index + 1}: "${line.text}"`);
      console.log(`    - Top: ${line.rect.top.toFixed(1)}px`);
      console.log(`    - Bottom: ${line.rect.bottom.toFixed(1)}px`);
    });
    console.log('');
    
    console.log('White cards (metric tiles):');
    console.log(`  - Top: ${detailedInfo.cardsTop.toFixed(1)}px`);
    console.log(`  - Bottom: ${detailedInfo.cardsBottom.toFixed(1)}px`);
    console.log('');
    
    console.log('📏 THE TWO MEASUREMENTS:');
    console.log('========================');
    console.log('');
    
    console.log('MEASUREMENT 1: Bottom of meta info to top of white cards');
    console.log(`- Meta container bottom: ${detailedInfo.metaBottom.toFixed(1)}px`);
    console.log(`- Cards top: ${detailedInfo.cardsTop.toFixed(1)}px`);
    console.log(`- Distance: ${detailedInfo.cardsTop.toFixed(1)} - ${detailedInfo.metaBottom.toFixed(1)} = ${detailedInfo.measurement1.toFixed(1)}px`);
    console.log('');
    
    console.log('MEASUREMENT 2: Top of meta info to bottom of address');
    console.log(`- Address bottom: ${detailedInfo.addressBottom.toFixed(1)}px`);
    console.log(`- Meta container top: ${detailedInfo.metaTop.toFixed(1)}px`);
    console.log(`- Distance: ${detailedInfo.metaTop.toFixed(1)} - ${detailedInfo.addressBottom.toFixed(1)} = ${detailedInfo.measurement2.toFixed(1)}px`);
    console.log('');
    
    console.log('📊 SUMMARY:');
    console.log('===========');
    console.log(`Measurement 1 (meta bottom → cards top): ${detailedInfo.measurement1.toFixed(1)}px`);
    console.log(`Measurement 2 (address bottom → meta top): ${detailedInfo.measurement2.toFixed(1)}px`);
    console.log(`Difference: ${Math.abs(detailedInfo.measurement1 - detailedInfo.measurement2).toFixed(1)}px`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

detailedMeasurementExplanation();
