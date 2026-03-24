const { chromium } = require('playwright');

async function testBackButtonSpacing() {
  console.log('📏 Testing if back button spacing is actually changing...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const demoUrl = 'http://localhost:3000/report?address=1232+Virginia+Ct%2C+Atlanta%2C+GA+30306%2C+USA&lat=33.7785624&lng=-84.3445644&placeId=ChIJD4zdpqIG9YgRqe-qzW6mLQM&company=google&demo=1';
    
    await page.goto(demoUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    const measurement = await page.evaluate(() => {
      // Get back button and H1 elements
      const backButton = document.querySelector('[data-testid="back-home-link"]');
      const h1 = document.querySelector('[data-testid="hdr-h1"]');
      
      if (!backButton || !h1) {
        return { error: 'Elements not found' };
      }
      
      // Get bounding rectangles
      const backRect = backButton.getBoundingClientRect();
      const h1Rect = h1.getBoundingClientRect();
      
      // Calculate the gap
      const gap = h1Rect.top - backRect.bottom;
      
      // Also check the CSS class being used
      const backContainer = backButton.closest('div');
      const containerClass = backContainer?.className;
      
      return {
        gap: gap,
        containerClass: containerClass,
        backBottom: backRect.bottom,
        h1Top: h1Rect.top
      };
    });
    
    if (measurement.error) {
      console.log('❌ Error:', measurement.error);
      return;
    }
    
    console.log('📊 BACK BUTTON SPACING MEASUREMENT:');
    console.log('==================================');
    console.log(`Actual gap between back button and H1: ${measurement.gap.toFixed(1)}px`);
    console.log(`Container CSS class: ${measurement.containerClass}`);
    console.log(`Back button bottom: ${measurement.backBottom.toFixed(1)}px`);
    console.log(`H1 top: ${measurement.h1Top.toFixed(1)}px`);
    console.log('');
    
    // Check what the CSS class should produce
    const expectedSpacing = {
      'mb-3': 12,
      'mb-4': 16,
      'mb-5': 20,
      'mb-6': 24,
      'mb-8': 32
    };
    
    console.log('🎯 EXPECTED VS ACTUAL:');
    console.log('======================');
    for (const [class_, expected] of Object.entries(expectedSpacing)) {
      if (measurement.containerClass?.includes(class_)) {
        const actual = measurement.gap;
        const difference = actual - expected;
        console.log(`Current class: ${class_} (expected: ${expected}px, actual: ${actual.toFixed(1)}px, diff: ${difference.toFixed(1)}px)`);
        
        if (Math.abs(difference) > 5) {
          console.log('⚠️  Large difference - spacing might not be working as expected');
        } else {
          console.log('✅ Spacing is working correctly');
        }
        break;
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

testBackButtonSpacing();
