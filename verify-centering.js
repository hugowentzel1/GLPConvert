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
    
    const topHalf = ctaFooter.querySelector('.h-full.grid.place-content-center');
    const bottomHalf = ctaFooter.querySelectorAll('.h-full.grid.place-content-center')[1];
    
    const topContainerRect = topHalf.getBoundingClientRect();
    const bottomContainerRect = bottomHalf.getBoundingClientRect();
    const bookRect = bookButton.getBoundingClientRect();
    const downloadRect = downloadButton.getBoundingClientRect();
    
    // Calculate centers
    const topHalfCenter = topContainerRect.top + (topContainerRect.height / 2);
    const bottomHalfCenter = bottomContainerRect.top + (bottomContainerRect.height / 2);
    const bookCenter = bookRect.top + (bookRect.height / 2);
    const downloadCenter = downloadRect.top + (downloadRect.height / 2);
    
    return {
      topHalfHeight: topContainerRect.height,
      bottomHalfHeight: bottomContainerRect.height,
      bookOffset: Math.abs(bookCenter - topHalfCenter),
      downloadOffset: Math.abs(downloadCenter - bottomHalfCenter),
      bookCenter,
      topHalfCenter,
      downloadCenter,
      bottomHalfCenter
    };
  });
  
  console.log('=== VERTICAL CENTERING VERIFICATION ===');
  console.log('Top box height:', results.topHalfHeight, 'px');
  console.log('Bottom box height:', results.bottomHalfHeight, 'px');
  console.log('Book button center:', results.bookCenter);
  console.log('Top box center:', results.topHalfCenter);
  console.log('Book button offset from center:', results.bookOffset, 'px');
  console.log('');
  console.log('Download button center:', results.downloadCenter);
  console.log('Bottom box center:', results.bottomHalfCenter);
  console.log('Download button offset from center:', results.downloadOffset, 'px');
  console.log('');
  console.log('=== RESULTS ===');
  if (results.bookOffset < 2) {
    console.log('✅ Top buttons (Book/Talk) are vertically centered');
  } else {
    console.log('❌ Top buttons are off by', results.bookOffset, 'px');
  }
  
  if (results.downloadOffset < 2) {
    console.log('✅ Bottom buttons (Download/Copy) are vertically centered');
  } else {
    console.log('❌ Bottom buttons are off by', results.downloadOffset, 'px');
  }
  
  await browser.close();
})();
