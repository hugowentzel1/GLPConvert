const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/report?address=1600+Amphitheatre+Parkway%2C+Mountain+View%2C+CA&lat=37.4220&lng=-122.0841&company=Apple&brandColor=%23000000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const centering = await page.evaluate(() => {
    const ctaFooter = document.querySelector('[data-testid="report-cta-footer"]');
    const bookButton = ctaFooter.querySelector('button[aria-label="Book a Consultation"]');
    const downloadButton = ctaFooter.querySelector('button[aria-label="Download PDF Report"]');
    
    const topRowContainer = bookButton.closest('.cta-row');
    const bottomRowContainer = downloadButton.closest('.utility-row');
    
    const topContainerRect = topRowContainer.getBoundingClientRect();
    const bottomContainerRect = bottomRowContainer.getBoundingClientRect();
    const bookRect = bookButton.getBoundingClientRect();
    const downloadRect = downloadButton.getBoundingClientRect();
    
    // Calculate centers
    const topContainerCenter = topContainerRect.top + (topContainerRect.height / 2);
    const bottomContainerCenter = bottomContainerRect.top + (bottomContainerRect.height / 2);
    const bookCenter = bookRect.top + (bookRect.height / 2);
    const downloadCenter = downloadRect.top + (downloadRect.height / 2);
    
    return {
      topContainerCenter,
      bottomContainerCenter,
      bookCenter,
      downloadCenter,
      bookOffset: bookCenter - topContainerCenter,
      downloadOffset: downloadCenter - bottomContainerCenter,
      bookHeight: bookRect.height,
      downloadHeight: downloadRect.height,
      topContainerHeight: topContainerRect.height,
      bottomContainerHeight: bottomContainerRect.height
    };
  });
  
  console.log('=== CENTERING ANALYSIS ===');
  console.log('Top container center:', centering.topContainerCenter);
  console.log('Book button center:', centering.bookCenter);
  console.log('Book button offset from container center:', centering.bookOffset, 'px');
  console.log('Book button height:', centering.bookHeight, 'px');
  console.log('Top container height:', centering.topContainerHeight, 'px');
  
  console.log('\nBottom container center:', centering.bottomContainerCenter);
  console.log('Download button center:', centering.downloadCenter);
  console.log('Download button offset from container center:', centering.downloadOffset, 'px');
  console.log('Download button height:', centering.downloadHeight, 'px');
  console.log('Bottom container height:', centering.bottomContainerHeight, 'px');
  
  console.log('\n=== RESULTS ===');
  if (Math.abs(centering.bookOffset) < 2) {
    console.log('✅ Top row buttons are centered');
  } else {
    console.log('❌ Top row buttons are off by', Math.abs(centering.bookOffset), 'px');
  }
  
  if (Math.abs(centering.downloadOffset) < 2) {
    console.log('✅ Bottom row buttons are centered');
  } else {
    console.log('❌ Bottom row buttons are off by', Math.abs(centering.downloadOffset), 'px');
  }
  
  await browser.close();
})();
