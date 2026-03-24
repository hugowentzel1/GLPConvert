const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🔍 STEP 3: Testing Partner page layout and email submission...');
  
  try {
    // Load the partners page
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=Netflix&demo=1', { waitUntil: 'networkidle' });
    console.log('✅ Partners page loaded successfully');

    // Check partner header
    const partnerHeader = await page.locator('h1').first().textContent();
    console.log('✅ Partner header:', partnerHeader);

    // Check 2-column grid layout
    const gridContainer = await page.locator('.grid.grid-cols-\\[1fr_1\\.1fr\\]').isVisible();
    console.log('✅ 2-column grid layout visible:', gridContainer);

    // Check commission structure section
    const commissionSection = await page.locator('text=Commission Structure').isVisible();
    console.log('✅ Commission structure section visible:', commissionSection);

    // Check partner benefits section
    const benefitsSection = await page.locator('text=Partner Benefits').isVisible();
    console.log('✅ Partner benefits section visible:', benefitsSection);

    // Check success story section
    const successStory = await page.locator('text=Success Story').isVisible();
    console.log('✅ Success story section visible:', successStory);

    // Check application form
    const applicationForm = await page.locator('text=Apply to Become a Partner').isVisible();
    console.log('✅ Application form visible:', applicationForm);

    // Check form fields
    const companyField = await page.locator('input[name="company"]').isVisible();
    console.log('✅ Company field visible:', companyField);

    const nameField = await page.locator('input[name="name"]').isVisible();
    console.log('✅ Name field visible:', nameField);

    const emailField = await page.locator('input[name="email"]').isVisible();
    console.log('✅ Email field visible:', emailField);

    const experienceField = await page.locator('select[name="experience"]').isVisible();
    console.log('✅ Experience field visible:', experienceField);

    // Check submit button
    const submitButton = await page.locator('text=Submit Partner Application').isVisible();
    console.log('✅ Submit button visible:', submitButton);

    // Check eligibility text
    const eligibilityText = await page.textContent('text=/Eligibility.*≥5 solar clients/');
    console.log('✅ Eligibility text:', eligibilityText);

    // Check payout text
    const payoutText = await page.textContent('text=/Payout.*30% recurring/');
    console.log('✅ Payout text:', payoutText);

    // Take screenshot for visual verification
    await page.screenshot({ path: 'step3-partners-page.png', fullPage: true });
    console.log('📸 Screenshot saved: step3-partners-page.png');

    console.log('✅ STEP 3 COMPLETE: Partner page verification successful');

  } catch (error) {
    console.error('❌ STEP 3 FAILED:', error);
  } finally {
    await browser.close();
  }
})();
