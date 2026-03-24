const { chromium } = require("playwright");

async function showBothVersions() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  console.log("🚀 Opening both DEMO and PAID versions...\n");

  // DEMO version (what prospects see)
  const demoPage = await context.newPage();
  console.log("📱 Opening DEMO version (what you send to prospects)...");
  await demoPage.goto(
    "http://localhost:3000/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com&demo=1",
  );
  await demoPage.waitForLoadState("networkidle");
  await demoPage.setViewportSize({ width: 1200, height: 800 });

  // PAID version (what customers get after payment)
  const paidPage = await context.newPage();
  console.log("💼 Opening PAID version (what customers get after payment)...");
  await paidPage.goto(
    "http://localhost:3000/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com",
  );
  await paidPage.waitForLoadState("networkidle");
  await paidPage.setViewportSize({ width: 1200, height: 800 });

  console.log("\n✅ Both versions are now open!");
  console.log("📱 Left tab: DEMO version (prospects see this)");
  console.log("💼 Right tab: PAID version (customers see this after payment)");

  console.log("\n🔍 Key differences to observe:");
  console.log("DEMO VERSION (Left tab):");
  console.log('- Shows "Demo for SolarPro Energy — Powered by Sunspire"');
  console.log("- Has demo locks and blur overlays on premium features");
  console.log('- Shows "Preview: X runs left" counter');
  console.log('- CTAs say "Activate on Your Domain"');
  console.log("- Has demo-specific messaging and limitations");

  console.log("\nPAID VERSION (Right tab):");
  console.log(
    '- Shows "Live for SolarPro Energy. Leads now save to your CRM."',
  );
  console.log("- No demo locks or blur overlays");
  console.log("- Full access to all features");
  console.log("- Clean, professional experience");
  console.log("- CTAs are contextual to their business");

  console.log("\n⏳ Browser will stay open for 60 seconds for inspection...");
  await new Promise((resolve) => setTimeout(resolve, 60000));

  await browser.close();
}

showBothVersions().catch(console.error);
