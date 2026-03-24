import { test } from '@playwright/test';

const BASE_URL = 'https://sunspire-web-app.vercel.app';

test('Inspect ALL pages on production site', async ({ page }) => {
  console.log('\n🔍 COMPREHENSIVE SITE INSPECTION\n');
  console.log('=' .repeat(60));
  
  // 1. Homepage
  console.log('\n📄 PAGE 1: HOMEPAGE');
  await page.goto(BASE_URL);
  await page.waitForTimeout(5000);
  const homeText = await page.locator('body').textContent();
  console.log('✓ Has Terms link:', homeText?.includes('Terms') || homeText?.includes('Legal'));
  console.log('✓ Has Privacy link:', homeText?.includes('Privacy'));
  console.log('✓ Has Cookie banner:', homeText?.includes('cookie') || homeText?.includes('Cookie'));
  await page.screenshot({ path: 'inspection/01-homepage.png', fullPage: true });
  
  // 2. Terms
  console.log('\n📄 PAGE 2: TERMS OF SERVICE');
  await page.goto(`${BASE_URL}/terms`);
  await page.waitForTimeout(3000);
  const termsText = await page.locator('body').textContent();
  console.log('✓ Has "Terms of Service":', termsText?.includes('Terms of Service'));
  console.log('✓ Has "Acceptance of Terms":', termsText?.includes('Acceptance of Terms'));
  console.log('✓ Has liability section:', termsText?.includes('liability') || termsText?.includes('Liability'));
  await page.screenshot({ path: 'inspection/02-terms.png', fullPage: true });
  
  // 3. Privacy
  console.log('\n📄 PAGE 3: PRIVACY POLICY');
  await page.goto(`${BASE_URL}/privacy`);
  await page.waitForTimeout(3000);
  const privacyText = await page.locator('body').textContent();
  console.log('✓ Has "Privacy Policy":', privacyText?.includes('Privacy'));
  console.log('✓ Has data collection info:', privacyText?.includes('collect') || privacyText?.includes('data'));
  console.log('✓ Has GDPR/CCPA:', privacyText?.includes('GDPR') || privacyText?.includes('CCPA') || privacyText?.includes('rights'));
  await page.screenshot({ path: 'inspection/03-privacy.png', fullPage: true });
  
  // 4. Cookies
  console.log('\n📄 PAGE 4: COOKIE POLICY');
  await page.goto(`${BASE_URL}/legal/cookies`);
  await page.waitForTimeout(3000);
  const cookiesText = await page.locator('body').textContent();
  console.log('✓ Has "Cookie":', cookiesText?.includes('Cookie') || cookiesText?.includes('cookie'));
  console.log('✓ Explains cookie use:', cookiesText?.includes('use') && cookiesText?.includes('cookie'));
  await page.screenshot({ path: 'inspection/04-cookies.png', fullPage: true });
  
  // 5. Refund
  console.log('\n📄 PAGE 5: REFUND POLICY');
  await page.goto(`${BASE_URL}/legal/refund`);
  await page.waitForTimeout(3000);
  const refundText = await page.locator('body').textContent();
  console.log('✓ Has "Refund":', refundText?.includes('Refund') || refundText?.includes('refund'));
  console.log('✓ Has refund terms:', refundText?.includes('day') || refundText?.includes('money'));
  await page.screenshot({ path: 'inspection/05-refund.png', fullPage: true });
  
  // 6. Accessibility
  console.log('\n📄 PAGE 6: ACCESSIBILITY');
  await page.goto(`${BASE_URL}/legal/accessibility`);
  await page.waitForTimeout(3000);
  const a11yText = await page.locator('body').textContent();
  console.log('✓ Has "Accessibility":', a11yText?.includes('Accessibility') || a11yText?.includes('accessible'));
  await page.screenshot({ path: 'inspection/06-accessibility.png', fullPage: true });
  
  // 7. Pricing
  console.log('\n📄 PAGE 7: PRICING');
  await page.goto(`${BASE_URL}/pricing`);
  await page.waitForTimeout(3000);
  const pricingText = await page.locator('body').textContent();
  console.log('✓ Has "Pricing":', pricingText?.includes('Pricing') || pricingText?.includes('pricing'));
  console.log('✓ Has price info:', pricingText?.includes('$') || pricingText?.includes('price'));
  await page.screenshot({ path: 'inspection/07-pricing.png', fullPage: true });
  
  // 8. Report Page
  console.log('\n📄 PAGE 8: REPORT PAGE');
  await page.goto(`${BASE_URL}/report?brand=TestCompany&address=123+Main+St+Phoenix+AZ`);
  await page.waitForTimeout(8000);
  const reportText = await page.locator('body').textContent();
  console.log('✓ Has solar data:', reportText?.includes('kWh') || reportText?.includes('Solar'));
  console.log('✓ Has NREL attribution:', reportText?.includes('NREL') || reportText?.includes('PVWatts'));
  await page.screenshot({ path: 'inspection/08-report.png', fullPage: true });
  
  // 9. Paid Version
  console.log('\n📄 PAGE 9: PAID VERSION');
  await page.goto(`${BASE_URL}/paid?brandColor=%235438DC`);
  await page.waitForTimeout(5000);
  const paidText = await page.locator('body').textContent();
  console.log('✓ Paid page loads:', paidText?.includes('Solar') || paidText?.includes('Enter'));
  await page.screenshot({ path: 'inspection/09-paid.png', fullPage: true });
  
  // 10. Customer Dashboard
  console.log('\n📄 PAGE 10: CUSTOMER DASHBOARD');
  await page.goto(`${BASE_URL}/c/testcompany?demo=1`);
  await page.waitForTimeout(8000);
  const dashText = await page.locator('body').textContent();
  console.log('✓ Has "Dashboard":', dashText?.includes('Dashboard') || dashText?.includes('dashboard'));
  console.log('✓ Has "Instant URL":', dashText?.includes('Instant URL'));
  console.log('✓ Has "Embed Code":', dashText?.includes('Embed Code'));
  console.log('✓ Has "API Key":', dashText?.includes('API Key'));
  await page.screenshot({ path: 'inspection/10-dashboard.png', fullPage: true });
  
  // 11. Support
  console.log('\n📄 PAGE 11: SUPPORT');
  await page.goto(`${BASE_URL}/support`);
  await page.waitForTimeout(3000);
  const supportText = await page.locator('body').textContent();
  console.log('✓ Has support info:', supportText?.includes('Support') || supportText?.includes('Help'));
  await page.screenshot({ path: 'inspection/11-support.png', fullPage: true });
  
  // 12. Docs
  console.log('\n📄 PAGE 12: DOCUMENTATION');
  await page.goto(`${BASE_URL}/docs/setup`);
  await page.waitForTimeout(3000);
  const docsText = await page.locator('body').textContent();
  console.log('✓ Has documentation:', docsText?.includes('Setup') || docsText?.includes('Documentation'));
  await page.screenshot({ path: 'inspection/12-docs.png', fullPage: true });
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ INSPECTION COMPLETE - All screenshots saved to inspection/');
  console.log('\n📊 CHECKING FOR LEGAL COMPLIANCE:\n');
  
  // Legal compliance check
  await page.goto(BASE_URL);
  await page.waitForTimeout(5000);
  
  const footerLinks = await page.locator('footer a').allTextContents();
  console.log('Footer links found:', footerLinks);
  
  const hasTermsLink = footerLinks.some(link => link.toLowerCase().includes('term'));
  const hasPrivacyLink = footerLinks.some(link => link.toLowerCase().includes('privacy'));
  const hasCookieLink = footerLinks.some(link => link.toLowerCase().includes('cookie'));
  
  console.log('\n📋 LEGAL LINKS IN FOOTER:');
  console.log('✓ Terms of Service:', hasTermsLink ? '✅' : '❌');
  console.log('✓ Privacy Policy:', hasPrivacyLink ? '✅' : '❌');
  console.log('✓ Cookie Policy:', hasCookieLink ? '✅' : '❌');
  
  // Check for cookie consent banner
  const hasCookieBanner = await page.locator('[class*="cookie"], [id*="cookie"], [class*="consent"], [id*="consent"]').count();
  console.log('✓ Cookie Consent Banner:', hasCookieBanner > 0 ? '✅' : '❌ MISSING');
  
  // Check for NREL attribution
  await page.goto(`${BASE_URL}/report?brand=Test&address=123+Main`);
  await page.waitForTimeout(8000);
  const pageContent = await page.content();
  const hasNREL = pageContent.toLowerCase().includes('nrel') || pageContent.toLowerCase().includes('pvwatts');
  console.log('✓ NREL Attribution:', hasNREL ? '✅' : '❌');
  
  console.log('\n' + '='.repeat(60));
});


