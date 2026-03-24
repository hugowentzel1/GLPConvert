const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('=== TESTING HARDENED CENTERING ===\n');
  
  // Test different viewport sizes
  const viewports = [
    { name: 'Mobile (320px)', width: 320, height: 800 },
    { name: 'Tablet (768px)', width: 768, height: 800 },
    { name: 'Desktop (1440px)', width: 1440, height: 800 }
  ];
  
  for (const viewport of viewports) {
    console.log(`Testing ${viewport.name}...`);
    
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('http://localhost:3000/report?address=1600+Amphitheatre+Parkway%2C+Mountain+View%2C+CA&lat=37.4220&lng=-122.0841&company=Apple&brandColor=%23000000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const results = await page.evaluate(() => {
      const ctaFooter = document.querySelector('[data-testid="report-cta-footer"]');
      const bookButton = ctaFooter.querySelector('button[aria-label="Book a Consultation"]');
      const downloadButton = ctaFooter.querySelector('button[aria-label="Download PDF Report"]');
      
      const topHalf = ctaFooter.querySelector('.h-full.grid.place-items-center');
      const bottomHalf = ctaFooter.querySelectorAll('.h-full.grid.place-items-center')[1];
      
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
        viewport: `${viewport.width}x${viewport.height}`,
        topHalfHeight: topContainerRect.height,
        bottomHalfHeight: bottomContainerRect.height,
        bookOffset: Math.abs(bookCenter - topHalfCenter),
        downloadOffset: Math.abs(downloadCenter - bottomHalfCenter),
        minHeightMet: topContainerRect.height >= 84 && bottomContainerRect.height >= 84
      };
    });
    
    console.log(`  Top half height: ${results.topHalfHeight}px (min: 84px)`);
    console.log(`  Bottom half height: ${results.bottomHalfHeight}px (min: 84px)`);
    console.log(`  Book button offset: ${results.bookOffset}px`);
    console.log(`  Download button offset: ${results.downloadOffset}px`);
    console.log(`  Min height met: ${results.minHeightMet ? '✅' : '❌'}`);
    console.log(`  Centering: ${results.bookOffset < 2 && results.downloadOffset < 2 ? '✅ Perfect' : '❌ Off'}`);
    console.log('');
  }
  
  // Test high zoom
  console.log('Testing high zoom (200%)...');
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.evaluate(() => {
    document.body.style.zoom = '2';
  });
  await page.waitForTimeout(500);
  
  const zoomResults = await page.evaluate(() => {
    const ctaFooter = document.querySelector('[data-testid="report-cta-footer"]');
    const bookButton = ctaFooter.querySelector('button[aria-label="Book a Consultation"]');
    const downloadButton = ctaFooter.querySelector('button[aria-label="Download PDF Report"]');
    
    const topHalf = ctaFooter.querySelector('.h-full.grid.place-items-center');
    const bottomHalf = ctaFooter.querySelectorAll('.h-full.grid.place-items-center')[1];
    
    const topContainerRect = topHalf.getBoundingClientRect();
    const bottomContainerRect = bottomHalf.getBoundingClientRect();
    const bookRect = bookButton.getBoundingClientRect();
    const downloadRect = downloadButton.getBoundingClientRect();
    
    const topHalfCenter = topContainerRect.top + (topContainerRect.height / 2);
    const bottomHalfCenter = bottomContainerRect.top + (bottomContainerRect.height / 2);
    const bookCenter = bookRect.top + (bookRect.height / 2);
    const downloadCenter = downloadRect.top + (downloadRect.height / 2);
    
    return {
      topHalfHeight: topContainerRect.height,
      bottomHalfHeight: bottomContainerRect.height,
      bookOffset: Math.abs(bookCenter - topHalfCenter),
      downloadOffset: Math.abs(downloadCenter - bottomHalfCenter)
    };
  });
  
  console.log(`  Top half height: ${zoomResults.topHalfHeight}px`);
  console.log(`  Bottom half height: ${zoomResults.bottomHalfHeight}px`);
  console.log(`  Book button offset: ${zoomResults.bookOffset}px`);
  console.log(`  Download button offset: ${zoomResults.downloadOffset}px`);
  console.log(`  High zoom centering: ${zoomResults.bookOffset < 3 && zoomResults.downloadOffset < 3 ? '✅ Perfect' : '❌ Off'}`);
  
  await browser.close();
})();
