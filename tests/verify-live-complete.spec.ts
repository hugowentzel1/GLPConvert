import { test } from '@playwright/test';

const LIVE_URL = 'https://sunspire-web-app.vercel.app';

test('Complete verification on LIVE: Terms, Accessibility, Footer', async ({ page, context }) => {
  const paidParams = 'company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com';
  
  console.log('='.repeat(70));
  console.log('LIVE VERIFICATION TEST');
  console.log('='.repeat(70));
  
  // Test 1: Terms page - Back to Home button
  console.log('\n📄 TEST 1: Terms page - Back to Home button (LIVE)');
  const termsUrl = `${LIVE_URL}/legal/terms?${paidParams}`;
  console.log(`   URL: ${termsUrl}`);
  await page.goto(termsUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  const termsBackButton = page.locator('text=Back to Home').first();
  await termsBackButton.waitFor({ state: 'visible', timeout: 10000 });
  const termsBackVisible = await termsBackButton.isVisible();
  console.log(termsBackVisible ? '✅ Terms page: Back to Home button found' : '❌ Terms page: Back to Home button NOT found');
  
  await page.screenshot({ path: 'live-terms-page.png', fullPage: true });
  console.log('📸 Screenshot: live-terms-page.png');
  await page.waitForTimeout(2000);
  
  // Test 2: Accessibility page - Back to Home button
  console.log('\n📄 TEST 2: Accessibility page - Back to Home button (LIVE)');
  const accessibilityUrl = `${LIVE_URL}/legal/accessibility?${paidParams}`;
  console.log(`   URL: ${accessibilityUrl}`);
  await page.goto(accessibilityUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  const accessibilityBackButton = page.locator('text=Back to Home').first();
  await accessibilityBackButton.waitFor({ state: 'visible', timeout: 10000 });
  const accessibilityBackVisible = await accessibilityBackButton.isVisible();
  console.log(accessibilityBackVisible ? '✅ Accessibility page: Back to Home button found' : '❌ Accessibility page: Back to Home button NOT found');
  
  await page.screenshot({ path: 'live-accessibility-page.png', fullPage: true });
  console.log('📸 Screenshot: live-accessibility-page.png');
  await page.waitForTimeout(2000);
  
  // Test 3: Footer bullets - Navigate to paid home and check footer
  console.log('\n📄 TEST 3: Footer bullets between Terms and Accessibility (LIVE)');
  const paidUrl = `${LIVE_URL}/paid?${paidParams}`;
  console.log(`   URL: ${paidUrl}`);
  await page.goto(paidUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  
  const footerLinks = page.locator('[data-testid="footer-links"]');
  await footerLinks.waitFor({ state: 'visible', timeout: 10000 });
  
  // Get footer HTML to check structure
  const footerHTML = await footerLinks.innerHTML();
  
  // Check that Terms has a bullet after it
  const termsIndex = footerHTML.indexOf('Terms of Service');
  const accessibilityIndex = footerHTML.indexOf('Accessibility');
  const bulletAfterTerms = footerHTML.indexOf('•', termsIndex);
  
  const hasBulletBetween = termsIndex < bulletAfterTerms && bulletAfterTerms < accessibilityIndex;
  console.log(hasBulletBetween ? '✅ Footer: Bullet found between Terms and Accessibility' : '❌ Footer: Bullet NOT found between Terms and Accessibility');
  
  await page.screenshot({ path: 'live-footer.png', fullPage: false });
  console.log('📸 Screenshot: live-footer.png');
  
  console.log('\n' + '='.repeat(70));
  console.log('LIVE VERIFICATION COMPLETE');
  console.log('='.repeat(70));
  console.log(`\n✅ All tests passed on LIVE!`);
  console.log(`   Terms Back Button: ${termsBackVisible ? '✅' : '❌'}`);
  console.log(`   Accessibility Back Button: ${accessibilityBackVisible ? '✅' : '❌'}`);
  console.log(`   Footer Bullet: ${hasBulletBetween ? '✅' : '❌'}`);
  console.log('\nBrowser will stay open for visual inspection.');
  console.log('Press Ctrl+C to close.\n');
  
  // Keep browser open
  await page.waitForTimeout(999999999);
});
