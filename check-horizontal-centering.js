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
    
    const topRow = bookButton.closest('.cta-row');
    const bottomRow = downloadButton.closest('.utility-row');
    
    const topRowRect = topRow.getBoundingClientRect();
    const bottomRowRect = bottomRow.getBoundingClientRect();
    const bookRect = bookButton.getBoundingClientRect();
    const talkRect = talkButton.getBoundingClientRect();
    const downloadRect = downloadButton.getBoundingClientRect();
    const copyRect = copyButton.getBoundingClientRect();
    
    // Calculate centers
    const topRowCenter = topRowRect.left + (topRowRect.width / 2);
    const bottomRowCenter = bottomRowRect.left + (bottomRowRect.width / 2);
    
    // Calculate button group centers
    const topGroupCenter = (bookRect.left + bookRect.right + talkRect.left + talkRect.right) / 4;
    const bottomGroupCenter = (downloadRect.left + downloadRect.right + copyRect.left + copyRect.right) / 4;
    
    return {
      topRowCenter,
      bottomRowCenter,
      topGroupCenter,
      bottomGroupCenter,
      topOffset: topGroupCenter - topRowCenter,
      bottomOffset: bottomGroupCenter - bottomRowCenter,
      topRowWidth: topRowRect.width,
      bottomRowWidth: bottomRowRect.width
    };
  });
  
  console.log('=== HORIZONTAL CENTERING CHECK ===');
  console.log('Top row center:', results.topRowCenter);
  console.log('Top button group center:', results.topGroupCenter);
  console.log('Top offset:', results.topOffset, 'px');
  console.log('');
  console.log('Bottom row center:', results.bottomRowCenter);
  console.log('Bottom button group center:', results.bottomGroupCenter);
  console.log('Bottom offset:', results.bottomOffset, 'px');
  console.log('');
  console.log('=== RESULTS ===');
  if (Math.abs(results.topOffset) < 2) {
    console.log('✅ Top buttons are horizontally centered');
  } else {
    console.log('❌ Top buttons are off by', results.topOffset, 'px');
    console.log('Need to move', results.topOffset > 0 ? 'LEFT' : 'RIGHT', Math.abs(results.topOffset), 'px');
  }
  
  if (Math.abs(results.bottomOffset) < 2) {
    console.log('✅ Bottom buttons are horizontally centered');
  } else {
    console.log('❌ Bottom buttons are off by', results.bottomOffset, 'px');
    console.log('Need to move', results.bottomOffset > 0 ? 'LEFT' : 'RIGHT', Math.abs(results.bottomOffset), 'px');
  }
  
  await browser.close();
})();
