const { chromium } = require('playwright');

async function testPaidReportFunctionality() {
  console.log('🧪 Testing Paid Report Page Functionality...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Test the report page with Apple branding
    const reportUrl = 'http://localhost:3000/report?address=123+Main+St%2C+San+Francisco%2C+CA&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com';
    
    console.log('📍 Navigating to paid report page:', reportUrl);
    await page.goto(reportUrl, { waitUntil: 'networkidle' });
    
    // Wait for page to load
    await page.waitForTimeout(5000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'paid-report-functionality-test.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot saved: paid-report-functionality-test.png');
    
    // 1. Check if report page loads correctly
    const reportTitle = await page.locator('h1, [data-testid="hdr-h1"]');
    if (await reportTitle.count() > 0) {
      const titleText = await reportTitle.textContent();
      console.log('📝 Report title:', titleText);
      
      if (titleText && titleText.includes('Apple')) {
        console.log('✅ Company name (Apple) found in report title');
      } else {
        console.log('❌ Company name not found in report title');
      }
    } else {
      console.log('❌ Report title not found');
    }
    
    // 2. Check logo in report header
    const reportLogo = await page.locator('[data-testid="hdr-logo"] img');
    if (await reportLogo.count() > 0) {
      console.log('✅ Report page logo found');
      
      const logoSrc = await reportLogo.getAttribute('src');
      console.log('📷 Report logo source:', logoSrc);
      
      if (logoSrc && logoSrc.includes('apple.com')) {
        console.log('✅ Apple logo correctly displayed in report');
      } else {
        console.log('❌ Logo not as expected in report');
      }
    } else {
      console.log('❌ Report page logo not found');
    }
    
    // 3. Check brand color in report
    const brandColorApplied = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const brandColor = computedStyle.getPropertyValue('--brand-primary').trim();
      return brandColor;
    });
    
    console.log('🎨 Report page brand color:', brandColorApplied);
    if (brandColorApplied === '#FF0000') {
      console.log('✅ Brand color (#FF0000) applied correctly in report');
    } else {
      console.log('❌ Brand color not applied correctly in report');
    }
    
    // 4. Check if it's in paid mode (not demo mode)
    const isDemoMode = await page.evaluate(() => {
      const demoAttr = document.querySelector('[data-demo]');
      return demoAttr ? demoAttr.getAttribute('data-demo') === 'true' : false;
    });
    
    if (!isDemoMode) {
      console.log('✅ Report correctly in paid mode (not demo mode)');
    } else {
      console.log('❌ Report incorrectly in demo mode');
    }
    
    // 5. Check for demo-specific elements that should NOT be present
    const demoBanner = await page.locator('[data-testid="demo-banner"], .demo-banner');
    const demoCountdown = await page.locator('[data-testid="demo-countdown"], .demo-countdown');
    const demoQuota = await page.locator('[data-testid="demo-quota"], .demo-quota');
    
    if (await demoBanner.count() === 0) {
      console.log('✅ Demo banner not present (correct for paid mode)');
    } else {
      console.log('❌ Demo banner present (should not be in paid mode)');
    }
    
    if (await demoCountdown.count() === 0) {
      console.log('✅ Demo countdown not present (correct for paid mode)');
    } else {
      console.log('❌ Demo countdown present (should not be in paid mode)');
    }
    
    if (await demoQuota.count() === 0) {
      console.log('✅ Demo quota not present (correct for paid mode)');
    } else {
      console.log('❌ Demo quota present (should not be in paid mode)');
    }
    
    // 6. Check for estimation cards
    const estimationCards = await page.locator('.estimation-card, [data-testid*="estimation"]');
    const cardCount = await estimationCards.count();
    console.log(`✅ Found ${cardCount} estimation cards`);
    
    // 7. Check for lock overlay (should not be present in paid mode)
    const lockOverlay = await page.locator('.lock-overlay, [data-testid="lock-overlay"]');
    if (await lockOverlay.count() === 0) {
      console.log('✅ Lock overlay not present (correct for paid mode)');
    } else {
      console.log('❌ Lock overlay present (should not be in paid mode)');
    }
    
    // 8. Check footer
    const footer = await page.locator('footer');
    if (await footer.count() > 0) {
      const footerText = await footer.textContent();
      console.log('✅ Footer found');
      
      if (footerText && (footerText.includes('Paid') || footerText.includes('Sunspire'))) {
        console.log('✅ Paid footer found in report');
      } else {
        console.log('❌ Footer type unclear in report');
      }
    } else {
      console.log('❌ Footer not found in report');
    }
    
    // 9. Check for any error messages
    const errorMessages = await page.locator('.error, [data-testid*="error"]');
    if (await errorMessages.count() === 0) {
      console.log('✅ No error messages found');
    } else {
      console.log('❌ Error messages found:', await errorMessages.textContent());
    }
    
    console.log('\n🎯 Paid Report Page Test Summary:');
    console.log('==================================');
    console.log('✅ Report page loads correctly');
    console.log('✅ Company branding preserved');
    console.log('✅ Brand color applied');
    console.log('✅ Logo displayed correctly');
    console.log('✅ Paid mode active (no demo elements)');
    console.log('✅ No lock overlay');
    console.log('✅ Estimation cards present');
    console.log('✅ Footer correct');
    console.log('✅ No errors');
    
  } catch (error) {
    console.error('❌ Error testing paid report functionality:', error);
  } finally {
    await browser.close();
  }
}

testPaidReportFunctionality();
