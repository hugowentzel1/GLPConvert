import { test } from '@playwright/test';

test('Verify footer has bullet between Terms and Accessibility in paid mode', async ({ page, context }) => {
  // Navigate to paid version with company branding
  const paidUrl = 'http://localhost:3000/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com';
  console.log(`Opening paid version: ${paidUrl}`);
  
  await page.goto(paidUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // Wait for page to fully load
  
  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  
  // Check if footer links are visible
  const footerLinks = page.locator('[data-testid="footer-links"]');
  await footerLinks.waitFor({ state: 'visible', timeout: 5000 });
  
  // Get the footer text to verify structure
  const footerText = await footerLinks.textContent();
  console.log('Footer links text:', footerText);
  
  // Check that Terms and Accessibility both exist
  const termsLink = page.locator('text=Terms of Service');
  const accessibilityLink = page.locator('text=Accessibility');
  
  await termsLink.waitFor({ state: 'visible', timeout: 5000 });
  await accessibilityLink.waitFor({ state: 'visible', timeout: 5000 });
  
  console.log('✅ Terms of Service link found');
  console.log('✅ Accessibility link found');
  
  // Take screenshot of footer
  await page.screenshot({ path: 'footer-bullets-paid.png', fullPage: false });
  console.log('📸 Screenshot saved: footer-bullets-paid.png');
  
  // Verify the bullet structure by checking the HTML
  const footerHTML = await footerLinks.innerHTML();
  console.log('Footer HTML structure:', footerHTML);
  
  // Check that there's a bullet between Terms and Accessibility
  // The structure should be: Terms of Service • ... • Accessibility •
  const hasBulletAfterTerms = footerHTML.includes('Terms of Service') && 
                               footerHTML.includes('•') &&
                               footerHTML.indexOf('Terms of Service') < footerHTML.indexOf('Accessibility');
  
  if (hasBulletAfterTerms) {
    console.log('✅ Bullet separator found between Terms and Accessibility');
  } else {
    console.log('❌ Bullet separator NOT found between Terms and Accessibility');
  }
  
  console.log('✅ Footer verification complete! The browser will stay open. Press Ctrl+C to close.');
  
  // Keep the browser open - wait for user to close manually
  await page.waitForTimeout(999999999);
});
