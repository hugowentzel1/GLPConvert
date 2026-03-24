const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/report?address=1600+Amphitheatre+Parkway%2C+Mountain+View%2C+CA&lat=37.4220&lng=-122.0841&company=Apple&brandColor=%23000000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const debug = await page.evaluate(() => {
    const ctaFooter = document.querySelector('[data-testid="report-cta-footer"]');
    const bookButton = ctaFooter.querySelector('button[aria-label="Book a Consultation"]');
    const downloadButton = ctaFooter.querySelector('button[aria-label="Download PDF Report"]');
    
    const topRowContainer = bookButton.closest('.cta-row');
    const bottomRowContainer = downloadButton.closest('.utility-row');
    
    // Get computed styles
    const topRowStyles = window.getComputedStyle(topRowContainer);
    const bottomRowStyles = window.getComputedStyle(bottomRowContainer);
    
    // Get actual measurements
    const topContainerRect = topRowContainer.getBoundingClientRect();
    const bottomContainerRect = bottomRowContainer.getBoundingClientRect();
    const bookRect = bookButton.getBoundingClientRect();
    const downloadRect = downloadButton.getBoundingClientRect();
    
    return {
      topRowPaddingTop: topRowStyles.paddingTop,
      topRowPaddingBottom: topRowStyles.paddingBottom,
      bottomRowPaddingTop: bottomRowStyles.paddingTop,
      bottomRowPaddingBottom: bottomRowStyles.paddingBottom,
      topContainerHeight: topContainerRect.height,
      bottomContainerHeight: bottomContainerRect.height,
      bookButtonTop: bookRect.top,
      topContainerTop: topContainerRect.top,
      downloadButtonTop: downloadRect.top,
      bottomContainerTop: bottomContainerRect.top,
      topRowInlineStyle: topRowContainer.getAttribute('style'),
      bottomRowInlineStyle: bottomRowContainer.getAttribute('style')
    };
  });
  
  console.log('=== INLINE STYLES ===');
  console.log('Top row inline style:', debug.topRowInlineStyle);
  console.log('Bottom row inline style:', debug.bottomRowInlineStyle);
  
  console.log('\n=== COMPUTED PADDING ===');
  console.log('Top row padding-top:', debug.topRowPaddingTop);
  console.log('Top row padding-bottom:', debug.topRowPaddingBottom);
  console.log('Bottom row padding-top:', debug.bottomRowPaddingTop);
  console.log('Bottom row padding-bottom:', debug.bottomRowPaddingBottom);
  
  console.log('\n=== CONTAINER HEIGHTS ===');
  console.log('Top container height:', debug.topContainerHeight);
  console.log('Bottom container height:', debug.bottomContainerHeight);
  
  console.log('\n=== BUTTON POSITIONS ===');
  console.log('Top container top:', debug.topContainerTop);
  console.log('Book button top:', debug.bookButtonTop);
  console.log('Bottom container top:', debug.bottomContainerTop);
  console.log('Download button top:', debug.downloadButtonTop);
  
  await browser.close();
})();
