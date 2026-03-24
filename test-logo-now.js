/**
 * Quick test to verify logo proxy is working
 */

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Testing logo proxy...\n');
  
  // Test 1: Direct proxy endpoint
  console.log('1. Testing proxy endpoint directly...');
  const proxyUrl = 'https://sunspire-web-app.vercel.app/api/logo-proxy?url=' + encodeURIComponent('https://logo.clearbit.com/apple.com');
  const response = await page.goto(proxyUrl);
  console.log('   Status:', response?.status());
  console.log('   Content-Type:', response?.headers()['content-type']);
  
  // Test 2: Full page with logo
  console.log('\n2. Testing full page with Apple logo...');
  await page.goto('https://sunspire-web-app.vercel.app/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  // Check what's rendered
  const info = await page.evaluate(() => {
    const img = document.querySelector('[data-hero-logo] img');
    return {
      exists: !!img,
      src: img?.src,
      naturalWidth: img?.naturalWidth,
      complete: img?.complete,
      onerror: img?.onerror ? 'has handler' : 'no handler'
    };
  });
  
  console.log('   Logo info:', JSON.stringify(info, null, 2));
  
  // Check network requests
  const requests = [];
  page.on('response', response => {
    if (response.url().includes('logo') || response.url().includes('favicon')) {
      requests.push({
        url: response.url(),
        status: response.status(),
        contentType: response.headers()['content-type']
      });
    }
  });
  
  await page.waitForTimeout(3000);
  
  console.log('\n3. Network requests:');
  requests.forEach(r => console.log('   ', r.status, r.contentType, r.url.substring(0, 80)));
  
  await page.screenshot({ path: 'test-results/logo-debug.png', fullPage: true });
  console.log('\n✅ Screenshot saved: test-results/logo-debug.png');
  console.log('\n⏸️  Browser open for 30 seconds...');
  
  await page.waitForTimeout(30000);
  await browser.close();
})();

