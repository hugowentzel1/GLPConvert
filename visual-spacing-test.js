const { chromium } = require('playwright');

async function compareSpacing() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Capture localhost version
    console.log('🚀 Capturing localhost version...');
    await page.goto('http://localhost:3000/report?address=1232+Virginia+Ct%2C+Atlanta%2C+GA+30306%2C+USA&lat=33.7785624&lng=-84.3445644&placeId=ChIJD4zdpqIG9YgRqe-qzW6mLQM&company=goole&demo=1', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    await page.waitForSelector('[data-testid="hdr-h1"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="hdr-logo"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="hdr-sub"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="hdr-address"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="hdr-meta"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="tile-systemSize"]', { timeout: 10000 });
    
    await page.screenshot({ 
      path: 'spacing-localhost-final.png',
      fullPage: true
    });
    
    console.log('📸 Localhost screenshot saved as spacing-localhost-final.png');
    
    // Capture live demo version for comparison
    console.log('🚀 Capturing live demo version...');
    await page.goto('https://sunspire-web-app.vercel.app/report?address=1232+Virginia+Ct%2C+Atlanta%2C+GA+30306%2C+USA&lat=33.7785624&lng=-84.3445644&placeId=ChIJD4zdpqIG9YgRqe-qzW6mLQM&company=goole&demo=1', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    await page.waitForSelector('[data-testid="hdr-h1"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="hdr-logo"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="hdr-sub"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="hdr-address"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="hdr-meta"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="tile-systemSize"]', { timeout: 10000 });
    
    await page.screenshot({ 
      path: 'spacing-live-demo.png',
      fullPage: true
    });
    
    console.log('📸 Live demo screenshot saved as spacing-live-demo.png');
    console.log('✅ Both screenshots captured for comparison');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

compareSpacing();
