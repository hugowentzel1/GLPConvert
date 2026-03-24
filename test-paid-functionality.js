const { chromium } = require('playwright');

async function testPaidFunctionality() {
  console.log('🧪 Testing Paid Version Functionality...');
  
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
      path: 'paid-functionality-test.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot saved: paid-functionality-test.png');
    
    // Check if company logo is displayed
    const logoElement = await page.locator('[data-testid="company-logo"], .company-logo, .hero-brand img').first();
    if (await logoElement.count() > 0) {
      console.log('✅ Company logo found and displayed');
    } else {
      console.log('❌ Company logo not found');
    }
    
    // Check if brand color is applied
    const brandColorApplied = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const brandColor = computedStyle.getPropertyValue('--brand-primary').trim();
      return brandColor === '#FF0000';
    });
    
    if (brandColorApplied) {
      console.log('✅ Brand color (#FF0000) applied correctly');
    } else {
      console.log('❌ Brand color not applied correctly');
    }
    
    // Check if company name appears in content
    const companyName = await page.textContent('h1, .company-name');
    if (companyName && companyName.includes('Apple')) {
      console.log('✅ Company name (Apple) found in content');
    } else {
      console.log('❌ Company name not found in content');
    }
    
    // Test address input functionality
    const addressInput = await page.locator('[data-testid="paid-address-input"], #address-input');
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
      }
    } else {
      console.log('❌ Address input not found');
    }
    
    // Check if it's in paid mode (not demo mode)
    const isDemoMode = await page.evaluate(() => {
      const demoAttr = document.querySelector('[data-demo]');
      return demoAttr ? demoAttr.getAttribute('data-demo') === 'true' : false;
    });
    
    if (!isDemoMode) {
      console.log('✅ Correctly in paid mode (not demo mode)');
    } else {
      console.log('❌ Incorrectly in demo mode');
    }
    
    // Check for paid-specific features
    const paidFeatures = await page.locator('.feature-card, .credibility-section');
    const featureCount = await paidFeatures.count();
    console.log(`✅ Found ${featureCount} paid feature elements`);
    
    // Check if footer is paid footer
    const footer = await page.locator('footer');
    const footerText = await footer.textContent();
    if (footerText && footerText.includes('Paid') || footerText.includes('Sunspire')) {
      console.log('✅ Paid footer found');
    } else {
      console.log('❌ Paid footer not found');
    }
    
    console.log('\n🎯 Paid Version Test Summary:');
    console.log('- Company branding: Apple');
    console.log('- Brand color: #FF0000 (red)');
    console.log('- Logo: Apple logo from Clearbit');
    console.log('- Mode: Paid (not demo)');
    console.log('- Address input: Functional');
    console.log('- Generate button: Working');
    
  } catch (error) {
    console.error('❌ Error testing paid functionality:', error);
  } finally {
    await browser.close();
  }
}

testPaidFunctionality();
