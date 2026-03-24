const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to localhost report page
  await page.goto('http://localhost:3000/report?address=Test&lat=37.42&lng=-122.08&state=CA&systemKw=7.2&demo=1&company=Netflix');
  
  // Wait for page to load
  await page.waitForTimeout(2000);
  
  // Press '2' to jump to variant 2
  await page.keyboard.press('2');
  await page.waitForTimeout(1000);
  
  // Take screenshot
  await page.screenshot({ path: 'variant2-screenshot.png', fullPage: true });
  
  // Get the variant indicator text
  const variantText = await page.locator('text=VARIANT').textContent();
  console.log('Current variant:', variantText);
  
  // Get the DataSources section HTML
  const dataSourcesHTML = await page.locator('section[aria-label="Data sources and methodology"]').innerHTML();
  console.log('\nDataSources HTML:');
  console.log(dataSourcesHTML.substring(0, 500) + '...');
  
  // Check if white box exists
  const hasWhiteBox = await page.locator('section[aria-label="Data sources and methodology"] >> div.bg-white').count();
  console.log('\nHas white box:', hasWhiteBox > 0);
  
  // Check for vertical dividers
  const hasVerticalDividers = await page.locator('section[aria-label="Data sources and methodology"] >> span.w-px').count();
  console.log('Vertical dividers count:', hasVerticalDividers);
  
  console.log('\n✅ Screenshot saved as variant2-screenshot.png');
  console.log('Check the screenshot to see what Variant 2 looks like!');
  
  await page.waitForTimeout(3000);
  await browser.close();
})();
