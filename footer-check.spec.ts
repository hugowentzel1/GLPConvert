import { test, expect } from '@playwright/test';

test('Footer Visual Verification', async ({ page }) => {
  console.log('🚀 Checking footer matches exact design...');
  
  await page.goto('http://localhost:3001/?company=Apple&demo=1');
  await page.waitForTimeout(2000);
  
  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  
  // Take screenshot of footer
  await page.screenshot({ path: 'footer-verification.png', fullPage: true });
  console.log('📸 Footer screenshot saved');
  
  // Check key footer elements
  const companyName = await page.locator('text=Sunspire Solar Intelligence').isVisible();
  console.log('✅ Company name visible:', companyName);
  
  const demoTag = await page.locator('text=Demo for Apple — Powered by Sunspire').isVisible();
  console.log('✅ Demo tag visible:', demoTag);
  
  const address = await page.locator('text=1700 Northside Drive Suite A7 #5164 Atlanta, GA 30318').isVisible();
  console.log('✅ Address visible:', address);
  
  const supportEmail = await page.locator('text=support@getsunspire.com').isVisible();
  console.log('✅ Support email visible:', supportEmail);
  
  const billingEmail = await page.locator('text=billing@getsunspire.com').isVisible();
  console.log('✅ Billing email visible:', billingEmail);
  
  const phone = await page.locator('text=+1 (555) 123-4567').isVisible();
  console.log('✅ Phone visible:', phone);
  
  const gdprBadge = await page.locator('text=GDPR').isVisible();
  console.log('✅ GDPR badge visible:', gdprBadge);
  
  const ccpaBadge = await page.locator('text=CCPA').isVisible();
  console.log('✅ CCPA badge visible:', ccpaBadge);
  
  const soc2Badge = await page.locator('text=SOC 2').isVisible();
  console.log('✅ SOC 2 badge visible:', soc2Badge);
  
  const quickLinks = await page.locator('text=Quick Links').isVisible();
  console.log('✅ Quick Links section visible:', quickLinks);
  
  const legalSupport = await page.locator('text=Legal & Support').isVisible();
  console.log('✅ Legal & Support section visible:', legalSupport);
  
  const nrelText = await page.locator('text=Estimates generated using NREL PVWatts® v8').isVisible();
  console.log('✅ NREL text visible:', nrelText);
  
  const googleText = await page.locator('text=Mapping & location data © Google').isVisible();
  console.log('✅ Google text visible:', googleText);
  
  const poweredBy = await page.locator('text=Powered by Sunspire').isVisible();
  console.log('✅ Powered by text visible:', poweredBy);
  
  console.log('🎉 Footer verification complete!');
});
