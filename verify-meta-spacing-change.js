const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('=== VERIFYING META SPACING CHANGE ===\n');
  
  await page.goto('http://localhost:3000/report?address=123+Absalom+Rd%2C+Mauldin%2C+SC+29680%2C+USA&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  const verification = await page.evaluate(() => {
    const meta = document.querySelector('[data-testid="hdr-meta"]');
    const spacer = document.querySelector('[data-testid="hdr-spacer-to-cards"]');
    const cards = document.querySelector('[data-testid="tile-systemSize"]');
    
    const getRect = (el) => el ? el.getBoundingClientRect() : null;
    const getGap = (a, b) => {
      if (!a || !b) return null;
      const aRect = getRect(a);
      const bRect = getRect(b);
      return Math.round(bRect.y - (aRect.y + aRect.height));
    };
    
    // Check the actual CSS classes being applied
    const spacerClasses = spacer ? spacer.className : null;
    const metaClasses = meta ? meta.className : null;
    
    // Check computed styles
    const spacerStyles = spacer ? window.getComputedStyle(spacer) : null;
    const metaStyles = meta ? window.getComputedStyle(meta) : null;
    
    return {
      // Actual measurements
      metaToSpacerGap: getGap(meta, spacer),
      metaToCardsGap: getGap(meta, cards),
      totalVisualGap: cards ? cards.getBoundingClientRect().top - meta.getBoundingClientRect().bottom : null,
      
      // CSS verification
      spacerClasses,
      metaClasses,
      spacerMarginTop: spacerStyles ? spacerStyles.marginTop : null,
      metaMarginTop: metaStyles ? metaStyles.marginTop : null,
      
      // Element verification
      spacerExists: !!spacer,
      metaExists: !!meta,
      cardsExist: !!cards
    };
  });
  
  console.log('=== MEASUREMENT RESULTS ===');
  console.log(`Meta → Spacer gap: ${verification.metaToSpacerGap}px`);
  console.log(`Meta → Cards gap: ${verification.metaToCardsGap}px`);
  console.log(`Total visual gap: ${Math.round(verification.totalVisualGap)}px`);
  console.log('');
  
  console.log('=== CSS VERIFICATION ===');
  console.log(`Spacer classes: ${verification.spacerClasses}`);
  console.log(`Meta classes: ${verification.metaClasses}`);
  console.log(`Spacer margin-top: ${verification.spacerMarginTop}`);
  console.log(`Meta margin-top: ${verification.metaMarginTop}`);
  console.log('');
  
  console.log('=== ELEMENT VERIFICATION ===');
  console.log(`Spacer exists: ${verification.spacerExists}`);
  console.log(`Meta exists: ${verification.metaExists}`);
  console.log(`Cards exist: ${verification.cardsExist}`);
  console.log('');
  
  console.log('=== CHANGE VERIFICATION ===');
  if (verification.metaToSpacerGap === 16) {
    console.log('✅ SUCCESS: Meta → Spacer gap is now 16px');
  } else if (verification.metaToSpacerGap === 24) {
    console.log('❌ FAILED: Meta → Spacer gap is still 24px (change not applied)');
  } else {
    console.log(`⚠️ UNEXPECTED: Meta → Spacer gap is ${verification.metaToSpacerGap}px`);
  }
  
  if (verification.spacerClasses && verification.spacerClasses.includes('mt-4')) {
    console.log('✅ SUCCESS: Spacer has mt-4 class');
  } else if (verification.spacerClasses && verification.spacerClasses.includes('mt-6')) {
    console.log('❌ FAILED: Spacer still has mt-6 class (change not applied)');
  } else {
    console.log(`⚠️ UNEXPECTED: Spacer classes: ${verification.spacerClasses}`);
  }
  
  if (verification.spacerMarginTop === '16px') {
    console.log('✅ SUCCESS: Spacer margin-top is 16px');
  } else if (verification.spacerMarginTop === '24px') {
    console.log('❌ FAILED: Spacer margin-top is still 24px');
  } else {
    console.log(`⚠️ UNEXPECTED: Spacer margin-top: ${verification.spacerMarginTop}`);
  }
  
  console.log('');
  console.log('=== FINAL ASSESSMENT ===');
  const changeApplied = verification.metaToSpacerGap === 16 && 
                       verification.spacerClasses && 
                       verification.spacerClasses.includes('mt-4') &&
                       verification.spacerMarginTop === '16px';
  
  if (changeApplied) {
    console.log('🎯 VERDICT: Change successfully applied! Meta spacing is now optimized.');
  } else {
    console.log('🚨 VERDICT: Change was NOT applied or blocked by something!');
    console.log('   Possible causes:');
    console.log('   - CSS not recompiled');
    console.log('   - Browser cache');
    console.log('   - Conflicting styles');
    console.log('   - Build process issue');
  }
  
  await browser.close();
})();
