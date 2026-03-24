const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/report?address=1600+Amphitheatre+Parkway%2C+Mountain+View%2C+CA&lat=37.4220&lng=-122.0841&company=Apple&brandColor=%23000000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const results = await page.evaluate(() => {
    const ctaFooter = document.querySelector('[data-testid="report-cta-footer"]');
    const bookButton = ctaFooter.querySelector('button[aria-label="Book a Consultation"]');
    const downloadButton = ctaFooter.querySelector('button[aria-label="Download PDF Report"]');
    
    const ctaFooterRect = ctaFooter.getBoundingClientRect();
    const bookRect = bookButton.getBoundingClientRect();
    const downloadRect = downloadButton.getBoundingClientRect();
    
    // Calculate the four quarters of the white card
    const cardHeight = ctaFooterRect.height;
    const quarterHeight = cardHeight / 4;
    
    const quarter1Top = ctaFooterRect.top;
    const quarter1Bottom = quarter1Top + quarterHeight;
    const quarter2Top = quarter1Bottom;
    const quarter2Bottom = quarter2Top + quarterHeight;
    const quarter3Top = quarter2Bottom;
    const quarter3Bottom = quarter3Top + quarterHeight;
    const quarter4Top = quarter3Bottom;
    const quarter4Bottom = quarter4Top + quarterHeight;
    
    // Calculate button centers
    const topButtonsCenter = (bookRect.top + bookRect.bottom) / 2;
    const bottomButtonsCenter = (downloadRect.top + downloadRect.bottom) / 2;
    
    // Calculate the lines between quarters (where buttons should be centered)
    const line1_2 = quarter1Bottom; // Line between 1st and 2nd quarter
    const line3_4 = quarter3Bottom; // Line between 3rd and 4th quarter
    
    return {
      cardTop: ctaFooterRect.top,
      cardBottom: ctaFooterRect.bottom,
      cardHeight: cardHeight,
      quarterHeight: quarterHeight,
      
      // Quarter boundaries
      quarter1Top,
      quarter1Bottom,
      quarter2Top,
      quarter2Bottom,
      quarter3Top,
      quarter3Bottom,
      quarter4Top,
      quarter4Bottom,
      
      // Target lines
      line1_2,
      line3_4,
      
      // Button centers
      topButtonsCenter,
      bottomButtonsCenter,
      
      // Offsets from target lines
      topButtonsOffset: topButtonsCenter - line1_2,
      bottomButtonsOffset: bottomButtonsCenter - line3_4
    };
  });
  
  console.log('=== VERTICAL QUARTERS ANALYSIS ===');
  console.log('White card height:', results.cardHeight, 'px');
  console.log('Each quarter height:', results.quarterHeight, 'px');
  console.log('');
  console.log('Quarter 1:', results.quarter1Top, '-', results.quarter1Bottom);
  console.log('Quarter 2:', results.quarter2Top, '-', results.quarter2Bottom);
  console.log('Quarter 3:', results.quarter3Top, '-', results.quarter3Bottom);
  console.log('Quarter 4:', results.quarter4Top, '-', results.quarter4Bottom);
  console.log('');
  console.log('Line between 1st & 2nd quarter:', results.line1_2);
  console.log('Line between 3rd & 4th quarter:', results.line3_4);
  console.log('');
  console.log('Top buttons center:', results.topButtonsCenter);
  console.log('Bottom buttons center:', results.bottomButtonsCenter);
  console.log('');
  console.log('=== ALIGNMENT RESULTS ===');
  console.log('Top buttons offset from line 1-2:', results.topButtonsOffset, 'px');
  console.log('Bottom buttons offset from line 3-4:', results.bottomButtonsOffset, 'px');
  console.log('');
  
  if (Math.abs(results.topButtonsOffset) < 2) {
    console.log('✅ Top buttons are centered on line between 1st & 2nd quarter');
  } else {
    console.log('❌ Top buttons are off by', Math.abs(results.topButtonsOffset), 'px from line 1-2');
    console.log('Need to move', results.topButtonsOffset > 0 ? 'DOWN' : 'UP', Math.abs(results.topButtonsOffset), 'px');
  }
  
  if (Math.abs(results.bottomButtonsOffset) < 2) {
    console.log('✅ Bottom buttons are centered on line between 3rd & 4th quarter');
  } else {
    console.log('❌ Bottom buttons are off by', Math.abs(results.bottomButtonsOffset), 'px from line 3-4');
    console.log('Need to move', results.bottomButtonsOffset > 0 ? 'DOWN' : 'UP', Math.abs(results.bottomButtonsOffset), 'px');
  }
  
  await browser.close();
})();
