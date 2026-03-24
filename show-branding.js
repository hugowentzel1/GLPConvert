const { chromium } = require("playwright");

async function showBranding() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  const company = "SolarPro Energy";
  const brandColor = "%23059669";
  const logo = "https://logo.clearbit.com/solarpro.com";

  console.log(`🚀 Showing branding for ${company}...\n`);

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

  console.log("\n✅ Both versions are now open!");
  console.log("📱 Left tab: DEMO version (prospects see this)");
  console.log("💼 Right tab: PAID version (customers get this after payment)");

  console.log("\n🎨 BRANDING - Both versions have:");
  console.log(`- ${company} logo in the header`);
  console.log(`- ${company} colors throughout (green theme)`);
  console.log(`- ${company} name in the navigation`);
  console.log(`- ${company} branding on all buttons and CTAs`);
  console.log(`- ${company} contact information`);

  console.log("\n🔍 KEY DIFFERENCE - What changes:");
  console.log("\nDEMO VERSION (Left tab):");
  console.log(`- Shows "Demo for ${company} — Powered by Sunspire"`);
  console.log('- Has "Activate on Your Domain — 24 Hours" CTAs');
  console.log("- Shows demo quota counter");
  console.log("- Has blur overlays on premium features");
  console.log("- Demo-specific messaging throughout");

  console.log("\nPAID VERSION (Right tab):");
  console.log(`- Shows "Live for ${company}. Leads now save to your CRM."`);
  console.log("- NO CTAs or activation buttons");
  console.log("- NO demo messaging");
  console.log("- Clean, professional tool interface");
  console.log("- Full access to all features");

  console.log("\n💡 The paid version is STILL fully branded to the company!");
  console.log("   It just removes all the sales/demo messaging and CTAs.");
  console.log("   Their customers see a professional SolarPro Energy tool.");

  console.log("\n⏳ Browser will stay open for 60 seconds for inspection...");
  await new Promise((resolve) => setTimeout(resolve, 60000));

  await browser.close();
}

showBranding().catch(console.error);
