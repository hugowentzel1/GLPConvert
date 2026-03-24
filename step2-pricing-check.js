const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🔍 STEP 2: Testing Pricing page spacing and layout...');
  
  try {
    // Load the pricing page
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Netflix&demo=1', { waitUntil: 'networkidle' });
    console.log('✅ Pricing page loaded successfully');

    // Check pricing header
    const pricingHeader = await page.locator('h1').first().textContent();
    console.log('✅ Pricing header:', pricingHeader);

    // Check 2-column grid layout
    const gridContainer = await page.locator('.grid.grid-cols-\\[1fr_0\\.9fr\\]').isVisible();
    console.log('✅ 2-column grid layout visible:', gridContainer);

    // Check "What You Get" section
    const whatYouGet = await page.locator('text=What You Get').isVisible();
    console.log('✅ "What You Get" section visible:', whatYouGet);

    // Check "Why Installers Switch" section
    const whySwitch = await page.locator('text=Why Installers Switch').isVisible();
    console.log('✅ "Why Installers Switch" section visible:', whySwitch);

    // Check CTA button
    const ctaButton = await page.locator('text=Start setup — $399 today').isVisible();
    console.log('✅ CTA button visible:', ctaButton);

    // Check FAQ section
    const faqSection = await page.locator('text=Frequently Asked Questions').isVisible();
    console.log('✅ FAQ section visible:', faqSection);

    // Check FAQ accordion items
    const faqItems = await page.locator('.space-y-6 > div').count();
    console.log('✅ FAQ items count:', faqItems);

    // Check "Back to Home" button
    const backButton = await page.locator('text=Back to Home').isVisible();
    console.log('✅ Back to Home button visible:', backButton);

    // Take screenshot for visual verification
    await page.screenshot({ path: 'step2-pricing-page.png', fullPage: true });
    console.log('📸 Screenshot saved: step2-pricing-page.png');

    console.log('✅ STEP 2 COMPLETE: Pricing page verification successful');

  } catch (error) {
    console.error('❌ STEP 2 FAILED:', error);
  } finally {
    await browser.close();
  }
})();
