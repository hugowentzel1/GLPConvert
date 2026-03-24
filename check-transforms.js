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
    
    const topRow = bookButton.closest('.cta-row');
    const bottomRow = downloadButton.closest('.utility-row');
    
    const topRowStyles = window.getComputedStyle(topRow);
    const bottomRowStyles = window.getComputedStyle(bottomRow);
    
    const bookRect = bookButton.getBoundingClientRect();
    const downloadRect = downloadButton.getBoundingClientRect();
    
    return {
      topRowTransform: topRowStyles.transform,
      bottomRowTransform: bottomRowStyles.transform,
      topRowInlineStyle: topRow.getAttribute('style'),
      bottomRowInlineStyle: bottomRow.getAttribute('style'),
      bookButtonTop: bookRect.top,
      downloadButtonTop: downloadRect.top
    };
  });
  
  console.log('=== TRANSFORM CHECK ===');
  console.log('Top row inline style:', results.topRowInlineStyle);
  console.log('Bottom row inline style:', results.bottomRowInlineStyle);
  console.log('Top row computed transform:', results.topRowTransform);
  console.log('Bottom row computed transform:', results.bottomRowTransform);
  console.log('Book button top position:', results.bookButtonTop);
  console.log('Download button top position:', results.downloadButtonTop);
  
  await browser.close();
})();
