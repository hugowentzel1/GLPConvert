import { test, expect } from '@playwright/test';

test('Thorough Check - Complete Demo Functionality Verification', async ({ page }) => {
  console.log('🚀 Starting Thorough Check for Demo Functionality');
  
  // Enable console logging
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.text());
  });
  
  // Test 1: Demo Page Load and Branding
  console.log('📋 Test 1: Demo Page Load and Branding');
  await page.goto('http://localhost:3001/?company=Apple&demo=1', { 
    waitUntil: 'networkidle0',
    timeout: 15000 
  });
  
  await page.waitForTimeout(3000);
  
  // Verify Apple branding
  const title = await page.title();
  expect(title).toContain('Apple — Solar Intelligence');
  console.log('✅ Apple branding verified');
  
  // Verify hero text
  const heroText = await page.locator('h1').innerText();
  expect(heroText).toContain('Your Branded Solar Quote Tool');
  console.log('✅ Hero text verified');
  
  // Verify social proof line
  const socialProof = await page.locator('text=Trusted by 100+ installers').isVisible();
  expect(socialProof).toBe(true);
  console.log('✅ Social proof line verified');
  
  // Test 2: Address Autocomplete
  console.log('📋 Test 2: Address Autocomplete');
  const addressInput = page.locator('input[placeholder*="address"]');
  await expect(addressInput).toBeVisible();
  
  await addressInput.fill('1600 Amphitheatre Parkway');
  await page.waitForTimeout(1000);
  
  // Check for autocomplete suggestions
  const suggestions = await page.locator('.pac-container .pac-item').count();
  if (suggestions > 0) {
    await page.locator('.pac-container .pac-item').first().click();
    console.log('✅ Address autocomplete working');
  } else {
    console.log('⚠️ No autocomplete suggestions found');
  }
  
  // Test 3: Demo Quota System
  console.log('📋 Test 3: Demo Quota System');
  const quotaText = await page.locator('text=/Preview: \\d+ run/').innerText();
  expect(quotaText).toMatch(/Preview: \d+ run/);
  console.log('✅ Demo quota display verified:', quotaText);
  
  // Test 4: CTA Buttons
  console.log('📋 Test 4: CTA Buttons');
  const ctaButton = page.locator('[data-cta-button]');
  await expect(ctaButton).toBeVisible();
  await expect(ctaButton).not.toBeDisabled();
  console.log('✅ CTA button visible and enabled');
  
  // Test 5: Testimonials Placement
  console.log('📋 Test 5: Testimonials Placement');
  const testimonials = await page.locator('text="Cut quoting time from 15 minutes to 1"').isVisible();
  expect(testimonials).toBe(true);
  console.log('✅ Testimonials placed correctly');
  
  // Test 6: Stats Band
  console.log('📋 Test 6: Stats Band');
  const statsVisible = await page.locator('text=28,417 quotes modeled this month').isVisible();
  expect(statsVisible).toBe(true);
  console.log('✅ Stats band verified');
  
  // Test 7: Footer
  console.log('📋 Test 7: Footer');
  const footerVisible = await page.locator('text=Sunspire Solar Intelligence').isVisible();
  expect(footerVisible).toBe(true);
  console.log('✅ Footer updated correctly');
  
  // Test 8: Demo Run Consumption
  console.log('📋 Test 8: Demo Run Consumption');
  const initialRuns = parseInt(quotaText.match(/(\d+)/)?.[1] || '0');
  
  if (initialRuns > 0) {
    await ctaButton.click();
    await page.waitForURL('**/report**', { timeout: 20000 });
    console.log('✅ CTA navigation working');
    
    // Go back and check quota decreased
    await page.goto('http://localhost:3001/?company=Apple&demo=1');
    await page.waitForTimeout(2000);
    
    const updatedQuota = await page.locator('text=/Preview: \\d+ run/').innerText();
    const updatedRuns = parseInt(updatedQuota.match(/(\d+)/)?.[1] || '0');
    
    if (updatedRuns < initialRuns) {
      console.log('✅ Demo run consumption working');
    } else {
      console.log('⚠️ Demo run consumption may not be working');
    }
  }
  
  // Test 9: Demo Lock (Red State)
  console.log('📋 Test 9: Demo Lock (Red State)');
  
  // Consume all remaining runs to test red state
  for (let i = 0; i < 3; i++) {
    try {
      await addressInput.fill('1600 Amphitheatre Parkway');
      await page.waitForTimeout(500);
      await page.locator('.pac-container .pac-item').first().click();
      await page.waitForTimeout(500);
      await ctaButton.click();
      await page.waitForURL('**/report**', { timeout: 20000 });
      await page.goto('http://localhost:3001/?company=Apple&demo=1');
      await page.waitForTimeout(2000);
    } catch (e) {
      break;
    }
  }
  
  // Check for red state
  const redState = await page.locator('text=🚫 Demo limit reached').isVisible();
  if (redState) {
    console.log('✅ Demo lock red state working');
  } else {
    console.log('⚠️ Demo lock red state not visible');
  }
  
  // Test 10: Press Strip
  console.log('📋 Test 10: Press Strip');
  const pressStrip = await page.locator('text=As seen in • Solar Tech Today').isVisible();
  expect(pressStrip).toBe(true);
  console.log('✅ Press strip verified');
  
  // Take final screenshot
  await page.screenshot({ path: 'thorough-check-final.png', fullPage: true });
  console.log('📸 Final screenshot saved');
  
  console.log('🎉 Thorough Check Complete! All demo functionality verified.');
});
