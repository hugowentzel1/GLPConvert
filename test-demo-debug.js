// Test the demo link locally
const puppeteer = require('puppeteer');

async function testDemoLink() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.text());
  });
  
  console.log('Testing demo link: http://localhost:3000/paid?company=Apple&demo=1');
  
  try {
    await page.goto('http://localhost:3000/paid?company=Apple&demo=1', { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });
    
    // Wait a bit for React to hydrate
    await page.waitForTimeout(2000);
    
    // Check if we can find Apple branding
    const title = await page.title();
    console.log('Page title:', title);
    
    // Look for Apple-specific content
    const appleContent = await page.evaluate(() => {
      const body = document.body.innerText;
      return {
        hasApple: body.includes('Apple'),
        hasDemo: body.includes('demo'),
        hasInstantSolar: body.includes('Instant Solar Analysis'),
        hasBrandTakeover: body.includes('brand takeover'),
        searchParams: window.location.search
      };
    });
    
    console.log('Content analysis:', appleContent);
    
    // Take a screenshot
    await page.screenshot({ path: 'demo-debug.png', fullPage: true });
    console.log('Screenshot saved as demo-debug.png');
    
  } catch (error) {
    console.error('Error testing demo link:', error);
  } finally {
    await browser.close();
  }
}

testDemoLink();
