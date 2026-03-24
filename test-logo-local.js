/**
 * Test logo functionality locally
 */

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🧪 Testing logo functionality locally...\n');
  
  // Test 1: Proxy endpoint
  console.log('1. Testing proxy endpoint...');
  const proxyUrl = 'http://localhost:3000/api/logo-proxy?url=' + encodeURIComponent('https://logo.clearbit.com/apple.com');
  try {
    const response = await page.goto(proxyUrl);
    console.log('   Status:', response?.status());
    const contentType = response?.headers()['content-type'];
    console.log('   Content-Type:', contentType);
    
    if (response?.status() === 200 && contentType?.includes('image')) {
      console.log('   ✅ Proxy endpoint working!');
    } else {
      console.log('   ❌ Proxy endpoint not working');
    }
  } catch (e) {
    console.log('   ❌ Error:', e.message);
  }
  
  // Test 2: Full page with logo
  console.log('\n2. Testing full page with Apple logo...');
  await page.goto('http://localhost:3000/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  // Check what's rendered
  const info = await page.evaluate(() => {
    const container = document.querySelector('[data-hero-logo]');
    const img = container?.querySelector('img');
    const div = container?.querySelector('div');
    return {
      container: !!container,
      img: img ? {
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete,
        visible: img.offsetWidth > 0 && img.offsetHeight > 0
      } : null,
      div: div ? {
        text: div.textContent,
        visible: div.offsetWidth > 0
      } : null
    };
  });
  
  console.log('   Logo info:', JSON.stringify(info, null, 2));
  
  if (info.img && info.img.naturalWidth > 0) {
    console.log('   ✅ Logo image loaded successfully!');
    console.log('   Dimensions:', info.img.naturalWidth, 'x', info.img.naturalHeight);
  } else if (info.div && info.div.visible) {
    console.log('   ⚠️  Logo image failed, showing initials fallback:', info.div.text);
  } else {
    console.log('   ❌ Logo not showing at all');
  }
  
  // Wait for image to load
  await page.waitForTimeout(5000);
  
  // Check again after wait
  const finalCheck = await page.evaluate(() => {
    const img = document.querySelector('[data-hero-logo] img');
    return img && img.complete && img.naturalWidth > 0;
  });
  
  console.log('\n   Final check - Image loaded:', finalCheck);
  
  await page.screenshot({ path: 'test-results/logo-local-test.png', fullPage: true });
  console.log('\n📸 Screenshot saved: test-results/logo-local-test.png');
  
  console.log('\n⏸️  Browser open for 30 seconds for visual inspection...');
  await page.waitForTimeout(30000);
  
  await browser.close();
  console.log('\n✅ Local test complete!\n');
})();

