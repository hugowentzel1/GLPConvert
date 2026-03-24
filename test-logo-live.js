/**
 * Test logo functionality on live site
 */

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🌐 Testing logo functionality on LIVE site...\n');
  
  const BASE_URL = 'https://sunspire-web-app.vercel.app';
  
  // Test 1: Proxy endpoint
  console.log('1. Testing proxy endpoint on live...');
  const proxyUrl = `${BASE_URL}/api/logo-proxy?url=${encodeURIComponent('https://logo.clearbit.com/apple.com')}`;
  try {
    const response = await page.goto(proxyUrl);
    console.log('   Status:', response?.status());
    const contentType = response?.headers()['content-type'];
    console.log('   Content-Type:', contentType);
    
    if (response?.status() === 200 && contentType?.includes('image')) {
      console.log('   ✅ Proxy endpoint working on live!');
    } else {
      console.log('   ❌ Proxy endpoint not working on live');
    }
  } catch (e) {
    console.log('   ❌ Error:', e.message);
  }
  
  // Test 2: Full page with logo - Demo
  console.log('\n2. Testing DEMO page with Apple logo...');
  await page.goto(`${BASE_URL}/?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com&demo=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  const demoInfo = await page.evaluate(() => {
    const img = document.querySelector('[data-hero-logo] img');
    return img ? {
      src: img.src.substring(0, 100),
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      visible: img.offsetWidth > 0
    } : null;
  });
  
  console.log('   Demo logo:', demoInfo ? `✅ Loaded (${demoInfo.naturalWidth}x${demoInfo.naturalHeight})` : '❌ Not found');
  
  // Test 3: Full page with logo - Paid
  console.log('\n3. Testing PAID page with Apple logo...');
  const paidPage = await browser.newPage();
  await paidPage.goto(`${BASE_URL}/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com`, { waitUntil: 'networkidle' });
  await paidPage.waitForTimeout(5000);
  
  const paidInfo = await paidPage.evaluate(() => {
    const img = document.querySelector('[data-hero-logo] img');
    return img ? {
      src: img.src.substring(0, 100),
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      visible: img.offsetWidth > 0
    } : null;
  });
  
  console.log('   Paid logo:', paidInfo ? `✅ Loaded (${paidInfo.naturalWidth}x${paidInfo.naturalHeight})` : '❌ Not found');
  
  // Wait for images to fully load
  await page.waitForTimeout(3000);
  await paidPage.waitForTimeout(3000);
  
  // Final verification
  const demoFinal = await page.evaluate(() => {
    const img = document.querySelector('[data-hero-logo] img');
    return img && img.complete && img.naturalWidth > 0;
  });
  
  const paidFinal = await paidPage.evaluate(() => {
    const img = document.querySelector('[data-hero-logo] img');
    return img && img.complete && img.naturalWidth > 0;
  });
  
  console.log('\n📊 Final Results:');
  console.log('   Demo page logo loaded:', demoFinal ? '✅ YES' : '❌ NO');
  console.log('   Paid page logo loaded:', paidFinal ? '✅ YES' : '❌ NO');
  
  await page.screenshot({ path: 'test-results/logo-live-demo.png', fullPage: true });
  await paidPage.screenshot({ path: 'test-results/logo-live-paid.png', fullPage: true });
  console.log('\n📸 Screenshots saved');
  
  console.log('\n⏸️  Browser windows open for 60 seconds for visual inspection...');
  await page.waitForTimeout(60000);
  
  await page.close();
  await paidPage.close();
  await browser.close();
  
  console.log('\n✅ Live test complete!\n');
  
  if (demoFinal && paidFinal) {
    console.log('🎉 SUCCESS: Logos are working on live site!');
    process.exit(0);
  } else {
    console.log('⚠️  WARNING: Some logos may not be loading');
    process.exit(1);
  }
})();

