const { chromium } = require("playwright");

async function showSameCompany() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  const company = "SolarPro Energy";
  const brandColor = "%23059669";
  const logo = "https://logo.clearbit.com/solarpro.com";

  console.log(`🚀 Opening DEMO vs PAID for ${company}...\n`);

  // DEMO version (what prospects see)
  const demoPage = await context.newPage();
  console.log(`📱 Opening DEMO version for ${company}...`);
  await demoPage.goto(
    `http://localhost:3000/?company=${company}&brandColor=${brandColor}&logo=${logo}&demo=1`,
  );
  await demoPage.waitForLoadState("networkidle");
  await demoPage.setViewportSize({ width: 1200, height: 800 });

  // PAID version (what customers get after payment)
  const paidPage = await context.newPage();
  console.log(`💼 Opening PAID version for ${company}...`);
  await paidPage.goto(
    `http://localhost:3000/?company=${company}&brandColor=${brandColor}&logo=${logo}`,
  );
  await paidPage.waitForLoadState("networkidle");
  await paidPage.setViewportSize({ width: 1200, height: 800 });

  console.log("\n✅ Both versions are now open for the same company!");
  console.log("📱 Left tab: DEMO version (prospects see this)");
  console.log("💼 Right tab: PAID version (customers get this after payment)");

  console.log("\n🔍 Same company, different experience:");
  console.log("\nDEMO VERSION (Left tab):");
  console.log(`- Shows "Demo for ${company} — Powered by Sunspire"`);
  console.log('- Has "Activate on Your Domain — 24 Hours" CTAs');
  console.log("- Shows demo quota counter");
  console.log("- Has blur overlays on premium features");
  console.log("- Demo-specific messaging throughout");
  console.log("- Pricing and activation buttons");

  console.log("\nPAID VERSION (Right tab):");
  console.log(`- Shows "Live for ${company}. Leads now save to your CRM."`);
  console.log("- NO CTAs or activation buttons");
  console.log("- NO demo messaging");
  console.log("- Clean, professional tool interface");
  console.log("- Full access to all features");
  console.log("- Just the solar intelligence tool");

  console.log("\n⏳ Browser will stay open for 60 seconds for inspection...");
  await new Promise((resolve) => setTimeout(resolve, 60000));

  await browser.close();
}

showSameCompany().catch(console.error);
