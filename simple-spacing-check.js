const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🔍 Checking spacing...\n');
  
  // Navigate to localhost
  await page.goto('http://localhost:3000/report?address=Test&lat=37.42&lng=-122.08&state=CA&systemKw=7.2&demo=1&company=Netflix');
  await page.waitForTimeout(3000);
  
  // Get all elements with margin classes
  const elements = await page.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    const marginElements = [];
    
    allElements.forEach(el => {
      const classes = el.className;
      if (classes.includes('mt-') || classes.includes('mb-') || classes.includes('my-')) {
        marginElements.push({
          tag: el.tagName,
          classes: classes,
          text: el.textContent.substring(0, 50)
        });
      }
    });
    
    return marginElements;
  });
  
  console.log('📏 Elements with margin classes:');
  elements.forEach(el => {
    console.log(`  ${el.tag}: ${el.classes} - "${el.text}..."`);
  });
  
  // Take screenshot
  await page.screenshot({ path: 'current-spacing.png', fullPage: true });
  console.log('\n📸 Screenshot saved: current-spacing.png');
  
  await browser.close();
})();
