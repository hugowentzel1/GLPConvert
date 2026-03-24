const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('🔍 Verifying localhost changes...\n');

  // 1. Home page - Hero trust strip
  console.log('1️⃣ Checking Home page - Hero trust strip (outlined icons, no emojis)...');
  await page.goto('http://localhost:3000/?company=tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  const trustStrip = page.getByTestId('hero-trust-strip');
  const stripVisible = await trustStrip.isVisible();
  console.log(`   ✓ Hero trust strip visible: ${stripVisible}`);
  
  const svgCount = await trustStrip.locator('svg').count();
  console.log(`   ✓ SVG icons found: ${svgCount} (should be 5)`);
  
  const linkCount = await trustStrip.locator('a').count();
  console.log(`   ✓ Links found: ${linkCount} (should be 0)`);
  
  const stripText = await trustStrip.textContent();
  const hasEmoji = /[\u{1F300}-\u{1FAFF}]/u.test(stripText);
  console.log(`   ✓ Contains emojis: ${hasEmoji} (should be false)`);
  
  await page.screenshot({ path: 'localhost-hero-trust-strip.png', fullPage: false });
  console.log('   📸 Screenshot saved: localhost-hero-trust-strip.png\n');

  // 2. Home page - Texas quote
  console.log('2️⃣ Checking Home page - Texas quote attribution...');
  const texasQuote = await page.getByText('Ops Manager').isVisible();
  console.log(`   ✓ "Ops Manager" visible: ${texasQuote}`);
  await page.screenshot({ path: 'localhost-quotes.png', fullPage: false });
  console.log('   📸 Screenshot saved: localhost-quotes.png\n');

  // 3. Partners page
  console.log('3️⃣ Checking Partners page - Brand button...');
  await page.goto('http://localhost:3000/partners');
  await page.waitForLoadState('networkidle');
  
  const partnerBtn = page.getByTestId('partner-apply-btn');
  const partnerBtnVisible = await partnerBtn.isVisible();
  console.log(`   ✓ Partner apply button visible: ${partnerBtnVisible}`);
  
  const partnerBg = await partnerBtn.evaluate(el => getComputedStyle(el).backgroundColor);
  console.log(`   ✓ Button background color: ${partnerBg}`);
  
  await page.screenshot({ path: 'localhost-partners-button.png', fullPage: false });
  console.log('   📸 Screenshot saved: localhost-partners-button.png\n');

  // 4. Support page
  console.log('4️⃣ Checking Support page - Brand button & SLA text...');
  await page.goto('http://localhost:3000/support');
  await page.waitForLoadState('networkidle');
  
  const supportBtn = page.getByTestId('support-submit-btn');
  const supportBtnVisible = await supportBtn.isVisible();
  console.log(`   ✓ Support submit button visible: ${supportBtnVisible}`);
  
  const slaVisible = await page.getByText('Typical reply times', { exact: false }).isVisible();
  console.log(`   ✓ SLA text visible: ${slaVisible}`);
  
  await page.screenshot({ path: 'localhost-support-button.png', fullPage: false });
  console.log('   📸 Screenshot saved: localhost-support-button.png\n');

  // 5. Report page
  console.log('5️⃣ Checking Report page - No sticky CTAs, chart header, end-cap...');
  await page.goto('http://localhost:3000/report/sample?company=tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  const stickyCount = await page.locator('[data-testid="sticky-cta"]').count();
  console.log(`   ✓ Sticky CTA count: ${stickyCount} (should be 0)`);
  
  const chartHeader = page.getByTestId('report-chart-header');
  const chartHeaderVisible = await chartHeader.isVisible();
  console.log(`   ✓ Chart header visible: ${chartHeaderVisible}`);
  
  const savingsProjection = await page.getByText('Savings Projection', { exact: true }).isVisible();
  console.log(`   ✓ "Savings Projection" text visible: ${savingsProjection}`);
  
  const totalSavings = await page.getByText('Total savings over 25 years', { exact: true }).isVisible();
  console.log(`   ✓ "Total savings over 25 years" text visible: ${totalSavings}`);
  
  await page.screenshot({ path: 'localhost-report-chart-header.png', fullPage: false });
  console.log('   📸 Screenshot saved: localhost-report-chart-header.png');
  
  // Scroll to bottom to check end-cap CTA
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 250));
  await page.waitForTimeout(500);
  
  const endCapCta = page.getByTestId('report-endcap-cta');
  const endCapVisible = await endCapCta.isVisible();
  console.log(`   ✓ End-cap CTA visible: ${endCapVisible}`);
  
  await page.screenshot({ path: 'localhost-report-endcap.png', fullPage: false });
  console.log('   📸 Screenshot saved: localhost-report-endcap.png\n');

  console.log('✅ All localhost verifications complete!');
  console.log('\n📸 Screenshots saved:');
  console.log('   - localhost-hero-trust-strip.png');
  console.log('   - localhost-quotes.png');
  console.log('   - localhost-partners-button.png');
  console.log('   - localhost-support-button.png');
  console.log('   - localhost-report-chart-header.png');
  console.log('   - localhost-report-endcap.png');

  await browser.close();
})();

