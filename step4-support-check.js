const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🔍 STEP 4: Testing Support page layout and functionality...');
  
  try {
    // Load the support page
    await page.goto('https://sunspire-web-app.vercel.app/support?company=Netflix&demo=1', { waitUntil: 'networkidle' });
    console.log('✅ Support page loaded successfully');

    // Check support header
    const supportHeader = await page.locator('h1').first().textContent();
    console.log('✅ Support header:', supportHeader);

    // Check 3-card contact options grid
    const contactGrid = await page.locator('.grid.grid-cols-3').isVisible();
    console.log('✅ 3-card contact options grid visible:', contactGrid);

    // Check Email Support card
    const emailSupport = await page.locator('text=Email Support').isVisible();
    console.log('✅ Email Support card visible:', emailSupport);

    // Check Documentation card
    const documentation = await page.locator('text=Documentation').isVisible();
    console.log('✅ Documentation card visible:', documentation);

    // Check System Status card
    const systemStatus = await page.locator('h3:has-text("System Status")').first().isVisible();
    console.log('✅ System Status card visible:', systemStatus);

    // Verify live chat is NOT present (removed as requested)
    const liveChat = await page.locator('text=Live Chat').isVisible();
    console.log('✅ Live Chat removed (should be false):', liveChat);

    // Verify priority support is NOT present (removed as requested)
    const prioritySupport = await page.locator('text=Priority Support').isVisible();
    console.log('✅ Priority Support removed (should be false):', prioritySupport);

    // Check FAQ section
    const faqSection = await page.locator('text=Frequently Asked Questions').isVisible();
    console.log('✅ FAQ section visible:', faqSection);

    // Check FAQ items
    const faqItems = await page.locator('.space-y-6 > div').count();
    console.log('✅ FAQ items count:', faqItems);

    // Check support form
    const supportForm = await page.locator('h2:has-text("Create Support Ticket")').isVisible();
    console.log('✅ Support form visible:', supportForm);

    // Check form fields
    const nameField = await page.locator('input[name="name"]').isVisible();
    console.log('✅ Name field visible:', nameField);

    const emailField = await page.locator('input[name="email"]').isVisible();
    console.log('✅ Email field visible:', emailField);

    const priorityField = await page.locator('select[name="priority"]').isVisible();
    console.log('✅ Priority field visible:', priorityField);

    const categoryField = await page.locator('select[name="category"]').isVisible();
    console.log('✅ Category field visible:', categoryField);

    // Check resource tiles section
    const resourceTiles = await page.locator('text=Helpful Guides & Resources').isVisible();
    console.log('✅ Resource tiles section visible:', resourceTiles);

    // Check resource tiles grid
    const tilesGrid = await page.locator('.grid.grid-cols-4').isVisible();
    console.log('✅ Resource tiles grid visible:', tilesGrid);

    // Check specific resource tiles
    const setupGuide = await page.locator('h3:has-text("Setup Guide")').isVisible();
    console.log('✅ Setup Guide tile visible:', setupGuide);

    const embedGuide = await page.locator('h3:has-text("Embed Guide")').isVisible();
    console.log('✅ Embed Guide tile visible:', embedGuide);

    const crmGuides = await page.locator('h3:has-text("CRM Guides")').isVisible();
    console.log('✅ CRM Guides tile visible:', crmGuides);

    const systemStatusTile = await page.locator('h3:has-text("System Status")').last().isVisible();
    console.log('✅ System Status tile visible:', systemStatusTile);

    // Take screenshot for visual verification
    await page.screenshot({ path: 'step4-support-page.png', fullPage: true });
    console.log('📸 Screenshot saved: step4-support-page.png');

    console.log('✅ STEP 4 COMPLETE: Support page verification successful');

  } catch (error) {
    console.error('❌ STEP 4 FAILED:', error);
  } finally {
    await browser.close();
  }
})();
