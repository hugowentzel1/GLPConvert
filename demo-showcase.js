const { chromium } = require("playwright");

async function showcaseVersions() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  console.log("🚀 Opening Demo and Paid versions...\n");

  // Demo version (live URL - will show current state)
  const demoPage = await context.newPage();
  console.log("📱 Opening DEMO version...");
  await demoPage.goto(
    "https://sunspire-web-app.vercel.app/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com&demo=1",
  );
  await demoPage.waitForLoadState("networkidle");

  // Paid version (local)
  const paidPage = await context.newPage();
  console.log("💼 Opening PAID version (local)...");
  await paidPage.goto(
    "http://localhost:3000/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com",
  );
  await paidPage.waitForLoadState("networkidle");

  console.log("\n✅ Both versions are now open!");
  console.log("📱 Left tab: DEMO version (live)");
  console.log("💼 Right tab: PAID version (local with our changes)");
  console.log("\n🔍 Key differences to observe:");
  console.log("- Tighter vertical spacing in PAID version");
  console.log("- Sticky CTA appears after scrolling in PAID version");
  console.log("- Compact navigation in PAID version");
  console.log("- No demo locks in PAID version");

  // Keep browser open for inspection
  console.log("\n⏳ Browser will stay open for 60 seconds for inspection...");
  await new Promise((resolve) => setTimeout(resolve, 60000));

  await browser.close();
}

showcaseVersions().catch(console.error);
