const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('=== META-TO-CARDS SPACING ANALYSIS ===\n');
  
  await page.goto('http://localhost:3000/report?address=123+Absalom+Rd%2C+Mauldin%2C+SC+29680%2C+USA&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  const analysis = await page.evaluate(() => {
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
    
    return {
      currentGap: getGap(meta, spacer),
      metaToCardsGap: getGap(meta, cards),
      metaHeight: meta ? meta.getBoundingClientRect().height : null,
      cardsHeight: cards ? cards.getBoundingClientRect().height : null,
      
      // Visual analysis
      visual: {
        metaBottom: meta ? meta.getBoundingClientRect().bottom : null,
        cardsTop: cards ? cards.getBoundingClientRect().top : null,
        totalGap: cards ? cards.getBoundingClientRect().top - meta.getBoundingClientRect().bottom : null
      }
    };
  });
  
  console.log('=== CURRENT SPACING ===');
  console.log(`Meta → Spacer: ${analysis.currentGap}px`);
  console.log(`Meta → Cards: ${analysis.metaToCardsGap}px`);
  console.log(`Total visual gap: ${Math.round(analysis.visual.totalGap)}px`);
  console.log('');
  
  console.log('=== ANALYSIS ===');
  
  // Check if 24px is actually optimal
  const currentGap = analysis.metaToCardsGap;
  
  console.log('🤔 QUESTION: Is 24px between meta and cards optimal?');
  console.log('');
  
  console.log('Arguments FOR 24px:');
  console.log('✅ Follows 8px grid (24px = 3×8px)');
  console.log('✅ Creates visual separation between header and content');
  console.log('✅ Matches other major spacing in the design');
  console.log('');
  
  console.log('Arguments AGAINST 24px:');
  console.log('❌ Might be too much air - meta info feels disconnected from cards');
  console.log('❌ Cards are the main content - meta should feel connected to them');
  console.log('❌ 24px might break the visual flow from address → meta → cards');
  console.log('');
  
  console.log('=== ALTERNATIVE SPACING OPTIONS ===');
  console.log('16px (2×8px): Tighter connection, meta feels part of header');
  console.log('12px (1.5×8px): Even tighter, creates unified header block');
  console.log('8px (1×8px): Very tight, meta and cards feel connected');
  console.log('');
  
  console.log('=== DESIGN PRINCIPLE ANALYSIS ===');
  console.log('The meta information (Generated on, Preview, Expires) is:');
  console.log('1. Contextual information about the report');
  console.log('2. Should feel connected to the data it describes');
  console.log('3. Currently feels disconnected with 24px gap');
  console.log('');
  
  console.log('=== RECOMMENDATION ===');
  if (currentGap >= 20) {
    console.log('🎯 RECOMMENDATION: Reduce meta-to-cards spacing to 16px');
    console.log('   Reasoning:');
    console.log('   - Still follows 8px grid (16px = 2×8px)');
    console.log('   - Creates better visual connection between meta and cards');
    console.log('   - Meta info feels more relevant to the data');
    console.log('   - Maintains good hierarchy without excessive separation');
    console.log('');
    console.log('   This would change the spacing from:');
    console.log('   24px/16px/8px/16px/24px → 24px/16px/8px/16px/16px');
  } else {
    console.log('✅ Current spacing is already optimal');
  }
  
  await browser.close();
})();
