/**
 * Check if logo image is actually visible and loading
 */

const { chromium } = require('playwright');

async function checkLogoVisibility() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const url = 'https://sunspire-web-app.vercel.app/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com';
  
  console.log('Navigating to:', url);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  // Check image element details
  const imageInfo = await page.evaluate(() => {
    const img = document.querySelector('[data-hero-logo] img');
    if (!img) return { exists: false };
    
    const rect = img.getBoundingClientRect();
    const computed = window.getComputedStyle(img);
    
    return {
      exists: true,
      src: img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      width: img.width,
      height: img.height,
      display: computed.display,
      visibility: computed.visibility,
      opacity: computed.opacity,
      position: computed.position,
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      clientWidth: img.clientWidth,
      clientHeight: img.clientHeight,
      offsetWidth: img.offsetWidth,
      offsetHeight: img.offsetHeight,
      complete: img.complete,
      naturalWidthValid: img.naturalWidth > 0
    };
  });
  
  console.log('\n📊 Image Element Info:');
  console.log(JSON.stringify(imageInfo, null, 2));
  
  // Check container
  const containerInfo = await page.evaluate(() => {
    const container = document.querySelector('[data-hero-logo]');
    if (!container) return { exists: false };
    
    const rect = container.getBoundingClientRect();
    const computed = window.getComputedStyle(container);
    
    return {
      exists: true,
      display: computed.display,
      visibility: computed.visibility,
      opacity: computed.opacity,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      innerHTML: container.innerHTML.substring(0, 200)
    };
  });
  
  console.log('\n📦 Container Info:');
  console.log(JSON.stringify(containerInfo, null, 2));
  
  // Take screenshot of just the logo area
  const logoElement = page.locator('[data-hero-logo]').first();
  if (await logoElement.isVisible()) {
    await logoElement.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await logoElement.screenshot({ path: 'logo-visibility-check.png' });
    console.log('\n📸 Screenshot saved: logo-visibility-check.png');
  }
  
  // Check if image actually loaded
  const imageLoaded = await page.evaluate(() => {
    return new Promise((resolve) => {
      const img = document.querySelector('[data-hero-logo] img');
      if (!img) {
        resolve({ loaded: false, error: 'No image element' });
        return;
      }
      
      if (img.complete && img.naturalWidth > 0) {
        resolve({ loaded: true, naturalWidth: img.naturalWidth });
      } else {
        img.onload = () => resolve({ loaded: true, naturalWidth: img.naturalWidth });
        img.onerror = () => resolve({ loaded: false, error: 'Image failed to load' });
        setTimeout(() => resolve({ loaded: false, error: 'Timeout waiting for image' }), 5000);
      }
    });
  });
  
  console.log('\n🖼️  Image Load Status:');
  console.log(JSON.stringify(imageLoaded, null, 2));
  
  console.log('\n⏸️  Keeping browser open for 10 seconds...');
  await page.waitForTimeout(10000);
  
  await browser.close();
}

checkLogoVisibility().catch(console.error);

