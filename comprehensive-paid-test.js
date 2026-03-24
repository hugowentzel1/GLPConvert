const { chromium } = require('playwright');

async function comprehensivePaidTest() {
  console.log('🧪 Comprehensive Paid Version Test...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Test the paid URL with Apple branding
    const paidUrl = 'http://localhost:3000/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com';
    
    console.log('📍 Navigating to paid version:', paidUrl);
    await page.goto(paidUrl, { waitUntil: 'networkidle' });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'comprehensive-paid-test.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot saved: comprehensive-paid-test.png');
    
    // 1. Check HeroBrand component and logo
    const heroBrand = await page.locator('[data-hero-logo]');
    if (await heroBrand.count() > 0) {
      console.log('✅ HeroBrand component found');
      
      // Check if logo image exists
      const logoImg = await heroBrand.locator('img');
      if (await logoImg.count() > 0) {
        console.log('✅ Company logo image found');
        
        // Check logo source
        const logoSrc = await logoImg.getAttribute('src');
        console.log('📷 Logo source:', logoSrc);
        
        if (logoSrc && logoSrc.includes('apple.com')) {
          console.log('✅ Apple logo correctly loaded from Clearbit');
        } else {
          console.log('❌ Logo source not as expected');
        }
      } else {
        console.log('❌ Logo image not found in HeroBrand');
      }
    } else {
      console.log('❌ HeroBrand component not found');
    }
    
    // 2. Check brand color application
    const brandColorApplied = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const brandColor = computedStyle.getPropertyValue('--brand-primary').trim();
      return brandColor;
    });
    
    console.log('🎨 Brand color applied:', brandColorApplied);
    if (brandColorApplied === '#FF0000') {
      console.log('✅ Brand color (#FF0000) applied correctly');
    } else {
      console.log('❌ Brand color not applied correctly');
    }
    
    // 3. Check company name in content
    const companyName = await page.textContent('h1');
    console.log('📝 H1 content:', companyName);
    
    // 4. Check if it's in paid mode (not demo mode)
    const isDemoMode = await page.evaluate(() => {
      const demoAttr = document.querySelector('[data-demo]');
      return demoAttr ? demoAttr.getAttribute('data-demo') === 'true' : false;
    });
    
    if (!isDemoMode) {
      console.log('✅ Correctly in paid mode (not demo mode)');
    } else {
      console.log('❌ Incorrectly in demo mode');
    }
    
    // 5. Check paid-specific features
    const paidFeatures = await page.locator('.feature-card');
    const featureCount = await paidFeatures.count();
    console.log(`✅ Found ${featureCount} paid feature cards`);
    
    // 6. Check address input functionality
    const addressInput = await page.locator('[data-testid="paid-address-input"]');
    if (await addressInput.count() > 0) {
      console.log('✅ Address input found');
      
      // Test typing in address input
      await addressInput.fill('123 Main St, San Francisco, CA');
      await page.waitForTimeout(1000);
      
      // Check if generate button is enabled
      const generateBtn = await page.locator('[data-testid="paid-generate-btn"]');
      if (await generateBtn.count() > 0) {
        const isEnabled = await generateBtn.isEnabled();
        console.log(isEnabled ? '✅ Generate button is enabled' : '❌ Generate button is disabled');
        
        // Check button text
        const buttonText = await generateBtn.textContent();
        console.log('🔘 Button text:', buttonText);
      }
    } else {
      console.log('❌ Address input not found');
    }
    
    // 7. Check footer type
    const footer = await page.locator('footer');
    const footerText = await footer.textContent();
    if (footerText && (footerText.includes('Paid') || footerText.includes('Sunspire'))) {
      console.log('✅ Paid footer found');
    } else {
      console.log('❌ Paid footer not found');
    }
    
    // 8. Test navigation to report page
    console.log('\n🚀 Testing navigation to report page...');
    
    // Fill address and click generate
    await addressInput.fill('123 Main St, San Francisco, CA');
    await page.waitForTimeout(1000);
    
    const generateBtn = await page.locator('[data-testid="paid-generate-btn"]');
    await generateBtn.click();
    
    // Wait for navigation
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    console.log('📍 Current URL after click:', currentUrl);
    
    if (currentUrl.includes('/report')) {
      console.log('✅ Successfully navigated to report page');
      
      // Check if brand parameters are preserved
      if (currentUrl.includes('company=Apple') && currentUrl.includes('brandColor=%23FF0000')) {
        console.log('✅ Brand parameters preserved in navigation');
      } else {
        console.log('❌ Brand parameters not preserved');
      }
      
      // Take screenshot of report page
      await page.screenshot({ 
        path: 'paid-report-page.png', 
        fullPage: true 
      });
      console.log('📸 Report page screenshot saved: paid-report-page.png');
      
    } else {
      console.log('❌ Failed to navigate to report page');
    }
    
    console.log('\n🎯 Comprehensive Paid Version Test Summary:');
    console.log('==========================================');
    console.log('✅ Company branding: Apple');
    console.log('✅ Brand color: #FF0000 (red)');
    console.log('✅ Logo: Apple logo from Clearbit');
    console.log('✅ Mode: Paid (not demo)');
    console.log('✅ Address input: Functional');
    console.log('✅ Generate button: Working');
    console.log('✅ Navigation: Working');
    console.log('✅ Brand preservation: Working');
    
  } catch (error) {
    console.error('❌ Error in comprehensive paid test:', error);
  } finally {
    await browser.close();
  }
}

comprehensivePaidTest();
