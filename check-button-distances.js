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
    const talkButton = ctaFooter.querySelector('a[aria-label="Talk to a Specialist"]');
    const downloadButton = ctaFooter.querySelector('button[aria-label="Download PDF Report"]');
    const copyButton = ctaFooter.querySelector('button[aria-label="Copy Share Link"]');
    
    const bookRect = bookButton.getBoundingClientRect();
    const talkRect = talkButton.getBoundingClientRect();
    const downloadRect = downloadButton.getBoundingClientRect();
    const copyRect = copyButton.getBoundingClientRect();
    
    // Calculate the gap between buttons in each pair
    const topGap = talkRect.left - bookRect.right;
    const bottomGap = copyRect.left - downloadRect.right;
    
    // Calculate the distance between the two pairs (center to center)
    const topPairCenter = (bookRect.top + bookRect.bottom + talkRect.top + talkRect.bottom) / 4;
    const bottomPairCenter = (downloadRect.top + downloadRect.bottom + copyRect.top + copyRect.bottom) / 4;
    const pairDistance = bottomPairCenter - topPairCenter;
    
    // Calculate the distance between the divider and each pair
    const divider = ctaFooter.querySelector('.h-px.bg-gray-200');
    const dividerRect = divider.getBoundingClientRect();
    const dividerCenter = (dividerRect.top + dividerRect.bottom) / 2;
    
    const topPairToDivider = Math.abs(topPairCenter - dividerCenter);
    const bottomPairToDivider = Math.abs(bottomPairCenter - dividerCenter);
    
    return {
      topGap,
      bottomGap,
      pairDistance,
      topPairCenter,
      bottomPairCenter,
      dividerCenter,
      topPairToDivider,
      bottomPairToDivider,
      gapDifference: Math.abs(topGap - bottomGap)
    };
  });
  
  console.log('=== BUTTON DISTANCE ANALYSIS ===');
  console.log('Top pair gap (Book ↔ Talk):', results.topGap, 'px');
  console.log('Bottom pair gap (Download ↔ Copy):', results.bottomGap, 'px');
  console.log('Gap difference:', results.gapDifference, 'px');
  console.log('');
  console.log('Distance between pairs (center to center):', results.pairDistance, 'px');
  console.log('');
  console.log('Top pair center:', results.topPairCenter);
  console.log('Bottom pair center:', results.bottomPairCenter);
  console.log('Divider center:', results.dividerCenter);
  console.log('');
  console.log('Top pair to divider distance:', results.topPairToDivider, 'px');
  console.log('Bottom pair to divider distance:', results.bottomPairToDivider, 'px');
  console.log('Divider distance difference:', Math.abs(results.topPairToDivider - results.bottomPairToDivider), 'px');
  console.log('');
  console.log('=== RESULTS ===');
  if (results.gapDifference < 1) {
    console.log('✅ Button gaps within pairs are equal');
  } else {
    console.log('❌ Button gaps are different by', results.gapDifference, 'px');
  }
  
  if (Math.abs(results.topPairToDivider - results.bottomPairToDivider) < 2) {
    console.log('✅ Pairs are equidistant from the divider');
  } else {
    console.log('❌ Pairs are not equidistant from divider');
  }
  
  await browser.close();
})();
