const { chromium } = require("playwright");

async function showPaidExperience() {
  console.log("🚀 Opening paid experience in Playwright...");

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000, // Slow down for better visibility
  });

  const page = await browser.newPage();

  // Set viewport to typical laptop size
  await page.setViewportSize({ width: 1280, height: 800 });

  const paidUrl =
    "http://localhost:3001/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com";

  console.log("📱 Loading paid experience...");
  await page.goto(paidUrl, { waitUntil: "networkidle" });

  console.log("✅ Paid experience loaded!");
  console.log("🎯 Key features to observe:");
  console.log("   - Company logo in hero (SolarPro Energy)");
  console.log('   - "Instant Solar Analysis for Your Home" headline');
  console.log("   - No CRM Integration badges");
  console.log('   - No "Powered by Sunspire" text');
  console.log("   - Clean address form with proper autocomplete");
  console.log("   - Sticky consultation bar appears after scrolling");

  // Wait a moment for user to see the page
  await page.waitForTimeout(3000);

  // Scroll down to show sticky bar
  console.log("📜 Scrolling to show sticky consultation bar...");
  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(2000);

  console.log("🎉 Paid experience demonstration complete!");
  console.log("⏳ Browser will stay open for 30 seconds for inspection...");

  // Keep browser open for inspection
  await page.waitForTimeout(30000);

  await browser.close();
  console.log("✅ Demo complete!");
}

showPaidExperience().catch(console.error);
