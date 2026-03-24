const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🔍 Checking actual spacing on localhost...\n');
  
  // Navigate to localhost
  await page.goto('http://localhost:3000/report?address=Test&lat=37.42&lng=-122.08&state=CA&systemKw=7.2&demo=1&company=Netflix');
  await page.waitForTimeout(3000);
  
  // Find the estimation cards section
  const cardsSection = page.locator('[data-testid="tile-systemSize"]').locator('..').locator('..');
  
  // Find DataSources section
  const dataSourcesSection = page.locator('section[aria-label="Data sources and methodology"]');
  
  // Find CTA section
  const ctaSection = page.locator('[data-testid="report-bottom-cta"]');
  
  // Get computed styles for spacing
  const cardsMarginBottom = await cardsSection.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return computed.marginBottom;
  });
  
  const dataSourcesMarginTop = await dataSourcesSection.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return computed.marginTop;
  });
  
  const dataSourcesMarginBottom = await dataSourcesSection.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return computed.marginBottom;
  });
  
  const ctaMarginTop = await ctaSection.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return computed.marginTop;
  });
  
  console.log('📏 Spacing Analysis:');
  console.log('  Cards margin-bottom:', cardsMarginBottom);
  console.log('  DataSources margin-top:', dataSourcesMarginTop);
  console.log('  DataSources margin-bottom:', dataSourcesMarginBottom);
  console.log('  CTA margin-top:', ctaMarginTop);
  
  // Take screenshot to see visual spacing
  await page.screenshot({ path: 'spacing-check.png', fullPage: true });
  console.log('\n📸 Screenshot saved: spacing-check.png');
  
  await browser.close();
})();
