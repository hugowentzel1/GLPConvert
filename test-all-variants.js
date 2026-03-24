const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🚀 Testing all DataSources variants...\n');
  
  // Navigate to localhost report page
  await page.goto('http://localhost:3000/report?address=Test&lat=37.42&lng=-122.08&state=CA&systemKw=7.2&demo=1&company=Netflix');
  await page.waitForTimeout(2000);
  
  // Test each variant
  for (let i = 1; i <= 5; i++) {
    console.log(`\n📋 Testing Variant ${i}:`);
    
    // Jump to variant
    await page.keyboard.press(i.toString());
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ path: `variant${i}-test.png`, fullPage: true });
    
    // Check for white box
    const hasWhiteBox = await page.locator('section[aria-label="Data sources and methodology"] >> div.bg-white').count();
    
    // Check for vertical dividers
    const verticalDividers = await page.locator('section[aria-label="Data sources and methodology"] >> span.w-px').count();
    
    // Check for bullet points
    const bulletPoints = await page.locator('section[aria-label="Data sources and methodology"] >> span.text-gray-300').count();
    
    // Get text content
    const textContent = await page.locator('section[aria-label="Data sources and methodology"]').textContent();
    
    console.log(`  ✅ Screenshot: variant${i}-test.png`);
    console.log(`  📦 White box: ${hasWhiteBox > 0 ? 'YES' : 'NO'}`);
    console.log(`  📏 Vertical dividers: ${verticalDividers}`);
    console.log(`  🔘 Bullet points: ${bulletPoints}`);
    console.log(`  📝 Text preview: ${textContent.substring(0, 100)}...`);
    
    // Specific checks for Variant 2
    if (i === 2) {
      const hasDisclaimerFirst = textContent.includes('Modeled estimate') && textContent.indexOf('Modeled estimate') < textContent.indexOf('NREL');
      console.log(`  🎯 Disclaimer first: ${hasDisclaimerFirst ? 'YES' : 'NO'}`);
      console.log(`  🎯 No white box: ${hasWhiteBox === 0 ? 'YES' : 'NO'}`);
      console.log(`  🎯 Vertical dividers: ${verticalDividers > 0 ? 'YES' : 'NO'}`);
    }
  }
  
  console.log('\n✅ All variants tested! Check the screenshots.');
  console.log('\nExpected Variant 2:');
  console.log('- No white box');
  console.log('- Disclaimer first');
  console.log('- Vertical dividers (|) instead of bullets (•)');
  
  await page.waitForTimeout(3000);
  await browser.close();
})();
