const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/report?address=1600+Amphitheatre+Parkway%2C+Mountain+View%2C+CA&lat=37.4220&lng=-122.0841&company=Apple&brandColor=%23000000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const results = await page.evaluate(() => {
    // Find the Apple logo
    const logo = document.querySelector('[data-testid="hdr-logo"] img');
    const logoRect = logo.getBoundingClientRect();
    const logoCenter = logoRect.left + (logoRect.width / 2);
    
    // Find the button gaps
    const ctaFooter = document.querySelector('[data-testid="report-cta-footer"]');
    const bookButton = ctaFooter.querySelector('button[aria-label="Book a Consultation"]');
    const talkButton = ctaFooter.querySelector('a[aria-label="Talk to a Specialist"]');
    const downloadButton = ctaFooter.querySelector('button[aria-label="Download PDF Report"]');
    const copyButton = ctaFooter.querySelector('button[aria-label="Copy Share Link"]');
    
    const bookRect = bookButton.getBoundingClientRect();
    const talkRect = talkButton.getBoundingClientRect();
    const downloadRect = downloadButton.getBoundingClientRect();
    const copyRect = copyButton.getBoundingClientRect();
    
    // Calculate gap centers
    const topGapCenter = (bookRect.right + talkRect.left) / 2;
    const bottomGapCenter = (downloadRect.right + copyRect.left) / 2;
    
    return {
      logoCenter,
      topGapCenter,
      bottomGapCenter,
      topGapOffset: topGapCenter - logoCenter,
      bottomGapOffset: bottomGapCenter - logoCenter,
      logoLeft: logoRect.left,
      logoRight: logoRect.right,
      logoWidth: logoRect.width
    };
  });
  
  console.log('=== LOGO ALIGNMENT CHECK ===');
  console.log('Apple logo center:', results.logoCenter);
  console.log('Apple logo left:', results.logoLeft);
  console.log('Apple logo right:', results.logoRight);
  console.log('Apple logo width:', results.logoWidth);
  console.log('');
  console.log('Top button gap center:', results.topGapCenter);
  console.log('Bottom button gap center:', results.bottomGapCenter);
  console.log('');
  console.log('Top gap offset from logo center:', results.topGapOffset, 'px');
  console.log('Bottom gap offset from logo center:', results.bottomGapOffset, 'px');
  console.log('');
  console.log('=== ALIGNMENT RESULTS ===');
  if (Math.abs(results.topGapOffset) < 2) {
    console.log('✅ Top button gap is aligned with logo center');
  } else {
    console.log('❌ Top button gap is off by', results.topGapOffset, 'px');
    console.log('Need to move', results.topGapOffset > 0 ? 'LEFT' : 'RIGHT', Math.abs(results.topGapOffset), 'px');
  }
  
  if (Math.abs(results.bottomGapOffset) < 2) {
    console.log('✅ Bottom button gap is aligned with logo center');
  } else {
    console.log('❌ Bottom button gap is off by', results.bottomGapOffset, 'px');
    console.log('Need to move', results.bottomGapOffset > 0 ? 'LEFT' : 'RIGHT', Math.abs(results.bottomGapOffset), 'px');
  }
  
  await browser.close();
})();
