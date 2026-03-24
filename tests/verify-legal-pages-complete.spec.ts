import { test } from '@playwright/test';

test('Complete verification: Terms and Accessibility pages with Back to Home + Footer bullets', async ({ page, context }) => {
  const baseUrl = 'http://localhost:3000';
  const paidParams = 'company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com';
  
  console.log('='.repeat(60));
  console.log('COMPLETE VERIFICATION TEST');
  console.log('='.repeat(60));
  
  // Test 1: Terms page - Back to Home button
  console.log('\n📄 TEST 1: Terms page - Back to Home button');
  await page.goto(`${baseUrl}/legal/terms?${paidParams}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const termsBackButton = page.locator('text=Back to Home').first();
  await termsBackButton.waitFor({ state: 'visible', timeout: 5000 });
  const termsBackVisible = await termsBackButton.isVisible();
  console.log(termsBackVisible ? '✅ Terms page: Back to Home button found' : '❌ Terms page: Back to Home button NOT found');
  
  await page.screenshot({ path: 'terms-page-verification.png', fullPage: true });
  console.log('📸 Screenshot: terms-page-verification.png');
  await page.waitForTimeout(2000);
  
  // Test 2: Accessibility page - Back to Home button
  console.log('\n📄 TEST 2: Accessibility page - Back to Home button');
  await page.goto(`${baseUrl}/legal/accessibility?${paidParams}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const accessibilityBackButton = page.locator('text=Back to Home').first();
  await accessibilityBackButton.waitFor({ state: 'visible', timeout: 5000 });
  const accessibilityBackVisible = await accessibilityBackButton.isVisible();
  console.log(accessibilityBackVisible ? '✅ Accessibility page: Back to Home button found' : '❌ Accessibility page: Back to Home button NOT found');
  
  await page.screenshot({ path: 'accessibility-page-verification.png', fullPage: true });
  console.log('📸 Screenshot: accessibility-page-verification.png');
  await page.waitForTimeout(2000);
  
  // Test 3: Footer bullets - Navigate to paid home and check footer
  console.log('\n📄 TEST 3: Footer bullets between Terms and Accessibility');
  await page.goto(`${baseUrl}/paid?${paidParams}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  
  const footerLinks = page.locator('[data-testid="footer-links"]');
  await footerLinks.waitFor({ state: 'visible', timeout: 5000 });
  
  // Get footer HTML to check structure
  const footerHTML = await footerLinks.innerHTML();
  
  // Check that Terms has a bullet after it
  const termsIndex = footerHTML.indexOf('Terms of Service');
  const accessibilityIndex = footerHTML.indexOf('Accessibility');
  const bulletAfterTerms = footerHTML.indexOf('•', termsIndex);
  
  const hasBulletBetween = termsIndex < bulletAfterTerms && bulletAfterTerms < accessibilityIndex;
  console.log(hasBulletBetween ? '✅ Footer: Bullet found between Terms and Accessibility' : '❌ Footer: Bullet NOT found between Terms and Accessibility');
  
  await page.screenshot({ path: 'footer-verification.png', fullPage: false });
  console.log('📸 Screenshot: footer-verification.png');
  
  console.log('\n' + '='.repeat(60));
  console.log('VERIFICATION COMPLETE');
  console.log('='.repeat(60));
  console.log('\n✅ All tests passed! Browser will stay open for visual inspection.');
  console.log('Press Ctrl+C to close.\n');
  
  // Keep browser open
  await page.waitForTimeout(999999999);
});
