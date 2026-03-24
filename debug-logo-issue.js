/**
 * Debug script to check why logo isn't showing
 */

const { chromium } = require('playwright');

async function debugLogo() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const url = 'https://sunspire-web-app.vercel.app/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com';
  
  console.log('Navigating to:', url);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  // Check console logs
  page.on('console', msg => {
    console.log('BROWSER LOG:', msg.text());
  });
  
  // Check if HeroBrand component exists
  const heroBrand = await page.locator('[data-hero-logo]').count();
  console.log('\nHeroBrand element count:', heroBrand);
  
  // Check if logo image exists
  const logoImage = await page.locator('[data-hero-logo] img').count();
  console.log('Logo image count:', logoImage);
  
  // Check if fallback initials exist
  const initials = await page.locator('[data-hero-logo] div').count();
  console.log('Initials div count:', initials);
  
  // Get all elements with data-hero-logo
  const elements = await page.locator('[data-hero-logo]').all();
  console.log('\nFound', elements.length, 'elements with data-hero-logo');
  
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const isVisible = await el.isVisible();
    const innerHTML = await el.innerHTML().catch(() => 'N/A');
    console.log(`Element ${i}: visible=${isVisible}, innerHTML length=${innerHTML.length}`);
  }
  
  // Check brand state from localStorage
  const brandState = await page.evaluate(() => {
    return localStorage.getItem('sunspire-brand-takeover');
  });
  console.log('\nLocalStorage brand state:', brandState);
  
  // Take screenshot
  await page.screenshot({ path: 'debug-logo-issue.png', fullPage: true });
  console.log('\nScreenshot saved: debug-logo-issue.png');
  
  // Wait for inspection
  console.log('\nKeeping browser open for 30 seconds for inspection...');
  await page.waitForTimeout(30000);
  
  await browser.close();
}

debugLogo().catch(console.error);

