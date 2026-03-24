const { chromium } = require("playwright");

async function showDemoVsPaid() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  console.log("🚀 Opening DEMO vs PAID versions...\n");

  // DEMO version (what prospects see - with CTAs and demo messaging)
  const demoPage = await context.newPage();
  console.log("📱 Opening DEMO version (prospects see this)...");
  await demoPage.goto(
    "http://localhost:3000/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com&demo=1",
  );
  await demoPage.waitForLoadState("networkidle");
  await demoPage.setViewportSize({ width: 1200, height: 800 });

  // PAID version (what customers get after payment - clean, no CTAs)
  const paidPage = await context.newPage();
  console.log("💼 Opening PAID version (customers get this after payment)...");
  await paidPage.goto(
    "http://localhost:3000/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com",
  );
  await paidPage.waitForLoadState("networkidle");
  await paidPage.setViewportSize({ width: 1200, height: 800 });

  console.log("\n✅ Both versions are now open!");
  console.log("📱 Left tab: DEMO version (prospects)");
  console.log("💼 Right tab: PAID version (customers)");

  console.log("\n🔍 Key differences:");
  console.log("\nDEMO VERSION (Left tab):");
  console.log('- Shows "Demo for SolarPro Energy — Powered by Sunspire"');
  console.log('- Has "Activate on Your Domain — 24 Hours" CTAs');
  console.log("- Shows demo quota counter");
  console.log("- Has blur overlays on premium features");
  console.log("- Demo-specific messaging throughout");
  console.log("- Pricing and activation buttons");

  console.log("\nPAID VERSION (Right tab):");
  console.log(
    '- Shows "Live for SolarPro Energy. Leads now save to your CRM."',
  );
  console.log("- NO CTAs or activation buttons");
  console.log("- NO demo messaging");
  console.log("- Clean, professional tool interface");
  console.log("- Full access to all features");
  console.log("- Just the solar intelligence tool");

  console.log("\n⏳ Browser will stay open for 60 seconds for inspection...");
  await new Promise((resolve) => setTimeout(resolve, 60000));

  await browser.close();
}

showDemoVsPaid().catch(console.error);
