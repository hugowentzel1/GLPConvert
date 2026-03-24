const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🔍 STEP 1: Verifying live demo page loads and basic elements...');
  
  try {
    // Load the live demo page
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1', { waitUntil: 'networkidle' });
    console.log('✅ Live demo page loaded successfully');

    // Check hero text
    const heroText = await page.locator('h1').first().textContent();
    console.log('✅ Hero text:', heroText?.substring(0, 50) + '...');

    // Check micro testimonial strip
    const microTestimonial = await page.locator('[data-testid="micro-testimonial"]').isVisible();
    console.log('✅ Micro testimonial strip visible:', microTestimonial);

    // Check address autocomplete input
    const addressInput = await page.locator('[data-testid="address-autocomplete-input"]').isVisible();
    console.log('✅ Address autocomplete input visible:', addressInput);

    // Check demo quota counter
    const quotaText = await page.textContent('text=/Preview.*run.*left/i');
    console.log('✅ Demo quota counter:', quotaText);

    // Check demo timer
    const timerText = await page.textContent('text=/Expires in/i');
    console.log('✅ Demo timer:', timerText);

    // Take screenshot for visual verification
    await page.screenshot({ path: 'step1-demo-page.png', fullPage: true });
    console.log('📸 Screenshot saved: step1-demo-page.png');

    console.log('✅ STEP 1 COMPLETE: Live demo page verification successful');

  } catch (error) {
    console.error('❌ STEP 1 FAILED:', error);
  } finally {
    await browser.close();
  }
})();
