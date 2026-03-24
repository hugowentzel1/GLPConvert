const { chromium } = require('playwright');

const LIVE_URL = 'https://sunspire-web-app.vercel.app';
const paidParams = 'company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com';

async function verifyDeployment() {
  console.log('='.repeat(70));
  console.log('DEPLOYMENT VERIFICATION');
  console.log('='.repeat(70));
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let allPassed = true;
  
  try {
    // Test 1: Terms page
    console.log('\n📄 Testing Terms page...');
    await page.goto(`${LIVE_URL}/legal/terms?${paidParams}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const termsBackButton = page.locator('text=Back to Home').first();
    const termsVisible = await termsBackButton.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (termsVisible) {
      console.log('✅ Terms page: Back to Home button found');
    } else {
      console.log('❌ Terms page: Back to Home button NOT found');
      allPassed = false;
    }
    
    // Test 2: Accessibility page
    console.log('\n📄 Testing Accessibility page...');
    await page.goto(`${LIVE_URL}/legal/accessibility?${paidParams}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const accessibilityBackButton = page.locator('text=Back to Home').first();
    const accessibilityVisible = await accessibilityBackButton.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (accessibilityVisible) {
      console.log('✅ Accessibility page: Back to Home button found');
    } else {
      console.log('❌ Accessibility page: Back to Home button NOT found');
      allPassed = false;
    }
    
    // Test 3: Footer bullets
    console.log('\n📄 Testing Footer bullets...');
    await page.goto(`${LIVE_URL}/paid?${paidParams}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    const footerLinks = page.locator('[data-testid="footer-links"]');
    await footerLinks.waitFor({ state: 'visible', timeout: 10000 });
    
    const footerHTML = await footerLinks.innerHTML();
    const termsIndex = footerHTML.indexOf('Terms of Service');
    const accessibilityIndex = footerHTML.indexOf('Accessibility');
    const bulletAfterTerms = footerHTML.indexOf('•', termsIndex);
    
    const hasBullet = termsIndex < bulletAfterTerms && bulletAfterTerms < accessibilityIndex;
    
    if (hasBullet) {
      console.log('✅ Footer: Bullet found between Terms and Accessibility');
    } else {
      console.log('❌ Footer: Bullet NOT found between Terms and Accessibility');
      allPassed = false;
    }
    
    console.log('\n' + '='.repeat(70));
    if (allPassed) {
      console.log('✅ ALL TESTS PASSED - DEPLOYMENT VERIFIED!');
    } else {
      console.log('❌ SOME TESTS FAILED - CHECK ABOVE');
    }
    console.log('='.repeat(70));
    console.log('\nBrowser will stay open for 60 seconds for visual inspection...');
    await page.waitForTimeout(60000);
    
  } catch (error) {
    console.error('❌ Error during verification:', error.message);
    allPassed = false;
  } finally {
    await browser.close();
  }
  
  process.exit(allPassed ? 0 : 1);
}

verifyDeployment();
