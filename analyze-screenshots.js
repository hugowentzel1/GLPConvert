const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🔍 Analyzing screenshots visually...\n');
  
  // Navigate to localhost
  await page.goto('http://localhost:3000/report?address=Test&lat=37.42&lng=-122.08&state=CA&systemKw=7.2&demo=1&company=Netflix');
  await page.waitForTimeout(2000);
  
  // Test Variant 2 specifically
  console.log('📋 Testing Variant 2 visually:');
  await page.keyboard.press('2');
  await page.waitForTimeout(1000);
  
  // Get the DataSources section element
  const dataSourcesSection = page.locator('section[aria-label="Data sources and methodology"]');
  
  // Check if it has white background
  const backgroundColor = await dataSourcesSection.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return computed.backgroundColor;
  });
  
  // Check if it has border
  const hasBorder = await dataSourcesSection.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return computed.border !== 'none' && computed.border !== '';
  });
  
  // Check if it has rounded corners
  const borderRadius = await dataSourcesSection.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return computed.borderRadius;
  });
  
  // Get all child divs
  const childDivs = await dataSourcesSection.locator('div').count();
  
  // Check for specific classes
  const hasWhiteClass = await dataSourcesSection.locator('div.bg-white').count();
  const hasRoundedClass = await dataSourcesSection.locator('div.rounded-2xl').count();
  
  console.log('  🎨 Background color:', backgroundColor);
  console.log('  📦 Has border:', hasBorder);
  console.log('  🔄 Border radius:', borderRadius);
  console.log('  📊 Child divs:', childDivs);
  console.log('  ⚪ Has bg-white class:', hasWhiteClass > 0);
  console.log('  🔄 Has rounded-2xl class:', hasRoundedClass > 0);
  
  // Get the actual HTML structure
  const html = await dataSourcesSection.innerHTML();
  console.log('\n📝 HTML Structure:');
  console.log(html.substring(0, 800));
  
  // Take a focused screenshot of just the DataSources section
  await dataSourcesSection.screenshot({ path: 'datasources-focused.png' });
  console.log('\n📸 Focused screenshot saved: datasources-focused.png');
  
  await browser.close();
})();
