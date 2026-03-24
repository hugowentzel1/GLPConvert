const { chromium } = require('playwright');

async function finalPaidVerification() {
  console.log('🧪 Final Paid Version Verification...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const results = {
    passed: [],
    failed: []
  };

  try {
    // Test 1: Paid home page
    console.log('=== Test 1: Paid Home Page ===');
    const paidUrl = 'http://localhost:3000/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com';
    await page.goto(paidUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'final-paid-home.png', fullPage: true });
    console.log('📸 Screenshot: final-paid-home.png');
    
    // Check logo
    const heroBrand = await page.locator('[data-hero-logo] img');
    if (await heroBrand.count() > 0) {
      results.passed.push('Home: Logo displayed');
      console.log('✅ Logo displayed');
    } else {
      results.failed.push('Home: Logo missing');
      console.log('❌ Logo missing');
    }
    
    // Check brand color
    const brandColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim();
    });
    if (brandColor === '#FF0000') {
      results.passed.push('Home: Brand color correct');
      console.log('✅ Brand color correct (#FF0000)');
    } else {
      results.failed.push('Home: Brand color incorrect');
      console.log(`❌ Brand color incorrect (${brandColor})`);
    }
    
    // Check paid mode
    const isDemoPaid = await page.evaluate(() => {
      const attr = document.querySelector('[data-demo]');
      return attr ? attr.getAttribute('data-demo') !== 'true' : true;
    });
    if (isDemoPaid) {
      results.passed.push('Home: Paid mode active');
      console.log('✅ Paid mode active');
    } else {
      results.failed.push('Home: Demo mode active (should be paid)');
      console.log('❌ Demo mode active (should be paid)');
    }
    
    // Check address input
    const addressInput = await page.locator('[data-testid="paid-address-input"]');
    if (await addressInput.count() > 0) {
      results.passed.push('Home: Address input present');
      console.log('✅ Address input present');
    } else {
      results.failed.push('Home: Address input missing');
      console.log('❌ Address input missing');
    }
    
    // Test 2: Navigation to report page
    console.log('\n=== Test 2: Navigation to Report ===');
    await addressInput.fill('1600 Amphitheatre Parkway, Mountain View, CA');
    await page.waitForTimeout(1500);
    
    const generateBtn = await page.locator('[data-testid="paid-generate-btn"]');
    if (await generateBtn.isEnabled()) {
      results.passed.push('Home: Generate button enabled');
      console.log('✅ Generate button enabled');
      
      await generateBtn.click();
      await page.waitForTimeout(5000);
      
      const currentUrl = page.url();
      if (currentUrl.includes('/report')) {
        results.passed.push('Navigation: Reached report page');
        console.log('✅ Reached report page');
        
        // Test 3: Report page verification
        console.log('\n=== Test 3: Report Page ===');
        await page.screenshot({ path: 'final-paid-report.png', fullPage: true });
        console.log('📸 Screenshot: final-paid-report.png');
        
        // Check brand parameters preserved
        if (currentUrl.includes('company=Apple') && currentUrl.includes('brandColor=%23FF0000')) {
          results.passed.push('Report: Brand params preserved');
          console.log('✅ Brand parameters preserved');
        } else {
          results.failed.push('Report: Brand params not preserved');
          console.log('❌ Brand parameters not preserved');
        }
        
        // Check report title
        const reportTitle = await page.locator('h1');
        const titleText = await reportTitle.textContent();
        if (titleText && titleText.includes('Apple')) {
          results.passed.push('Report: Company name in title');
          console.log('✅ Company name in title');
        } else {
          results.failed.push('Report: Company name missing from title');
          console.log('❌ Company name missing from title');
        }
        
        // Check report logo
        const reportLogo = await page.locator('[data-testid="hdr-logo"] img');
        if (await reportLogo.count() > 0) {
          results.passed.push('Report: Logo displayed');
          console.log('✅ Logo displayed');
          
          const logoSrc = await reportLogo.getAttribute('src');
          if (logoSrc && logoSrc.includes('apple.com')) {
            results.passed.push('Report: Correct logo source');
            console.log('✅ Correct logo source');
          } else {
            results.failed.push('Report: Incorrect logo source');
            console.log('❌ Incorrect logo source');
          }
        } else {
          results.failed.push('Report: Logo missing');
          console.log('❌ Logo missing');
        }
        
        // Check brand color in report
        const reportBrandColor = await page.evaluate(() => {
          return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim();
        });
        if (reportBrandColor === '#FF0000') {
          results.passed.push('Report: Brand color correct');
          console.log('✅ Brand color correct');
        } else {
          results.failed.push('Report: Brand color incorrect');
          console.log(`❌ Brand color incorrect (${reportBrandColor})`);
        }
        
        // Check for demo elements (should not be present)
        const demoBanner = await page.locator('[data-testid="demo-banner"]');
        if (await demoBanner.count() === 0) {
          results.passed.push('Report: No demo banner');
          console.log('✅ No demo banner (correct)');
        } else {
          results.failed.push('Report: Demo banner present');
          console.log('❌ Demo banner present (should not be)');
        }
        
        // Check for errors
        const errorMsg = await page.locator('.error, [class*="error"]');
        if (await errorMsg.count() === 0) {
          results.passed.push('Report: No errors');
          console.log('✅ No errors');
        } else {
          results.failed.push('Report: Errors present');
          console.log('❌ Errors present');
        }
        
      } else {
        results.failed.push('Navigation: Failed to reach report');
        console.log('❌ Failed to reach report page');
      }
    } else {
      results.failed.push('Home: Generate button disabled');
      console.log('❌ Generate button disabled');
    }
    
    // Print final summary
    console.log('\n' + '='.repeat(50));
    console.log('🎯 FINAL VERIFICATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${results.passed.length} tests`);
    console.log(`❌ Failed: ${results.failed.length} tests`);
    console.log('');
    
    if (results.passed.length > 0) {
      console.log('Passed Tests:');
      results.passed.forEach(test => console.log(`  ✅ ${test}`));
    }
    
    if (results.failed.length > 0) {
      console.log('\nFailed Tests:');
      results.failed.forEach(test => console.log(`  ❌ ${test}`));
    }
    
    console.log('');
    if (results.failed.length === 0) {
      console.log('🎉 ALL TESTS PASSED! Paid version is fully functional.');
    } else {
      console.log('⚠️  Some tests failed. Please review the issues above.');
    }
    
  } catch (error) {
    console.error('❌ Error in final verification:', error);
  } finally {
    await browser.close();
  }
}

finalPaidVerification();
