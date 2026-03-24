const { chromium } = require('playwright');

async function captureSpacing() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Navigating to localhost report page...');
    await page.goto('http://localhost:3000/report?address=1232+Virginia+Ct%2C+Atlanta%2C+GA+30306%2C+USA&lat=33.7785624&lng=-84.3445644&placeId=ChIJD4zdpqIG9YgRqe-qzW6mLQM&company=goole&demo=1', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    console.log('📸 Capturing screenshot...');
    await page.screenshot({ 
      path: 'spacing-localhost-current.png',
      fullPage: true
    });
    
    console.log('✅ Screenshot saved as spacing-localhost-current.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

captureSpacing();
