import { test } from '@playwright/test';

test('Verify Terms and Accessibility pages have Back to Home button in paid mode', async ({ page, context }) => {
  // Navigate to paid version with company branding
  const paidUrl = 'http://localhost:3000/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com';
  console.log(`Opening paid version: ${paidUrl}`);
  
  await page.goto(paidUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // Wait for page to fully load
  
  // Navigate to Terms page
  console.log('Navigating to Terms page...');
  await page.goto('http://localhost:3000/legal/terms?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Check if Back to Home button exists
  const termsBackButton = page.locator('text=Back to Home').first();
  await termsBackButton.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✅ Terms page: Back to Home button found');
  
  // Take screenshot of Terms page
  await page.screenshot({ path: 'terms-page-paid.png', fullPage: true });
  console.log('📸 Screenshot saved: terms-page-paid.png');
  
  // Wait a bit so user can see it
  await page.waitForTimeout(3000);
  
  // Navigate to Accessibility page
  console.log('Navigating to Accessibility page...');
  await page.goto('http://localhost:3000/legal/accessibility?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Check if Back to Home button exists
  const accessibilityBackButton = page.locator('text=Back to Home').first();
  await accessibilityBackButton.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✅ Accessibility page: Back to Home button found');
  
  // Take screenshot of Accessibility page
  await page.screenshot({ path: 'accessibility-page-paid.png', fullPage: true });
  console.log('📸 Screenshot saved: accessibility-page-paid.png');
  
  // Wait a bit so user can see it
  await page.waitForTimeout(3000);
  
  console.log('✅ Both pages verified! The browser will stay open. Press Ctrl+C to close.');
  
  // Keep the browser open - wait for user to close manually
  await page.waitForTimeout(999999999);
});
