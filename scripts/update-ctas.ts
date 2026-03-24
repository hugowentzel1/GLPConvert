import fs from "fs";
import path from "path";

async function updateCTAs() {
  console.log("🔄 Starting CTA overhaul...");
  
  // Find all relevant files manually
  const files = [
    "app/page.tsx",
    "app/pricing/page.tsx", 
    "app/support/page.tsx",
    "app/security/page.tsx",
    "components/cta/BottomCtaBand.tsx",
    "components/report/ReportCTAFooter.tsx",
    "components/StickyCtaBar.tsx",
    "components/SmartStickyCTA.tsx",
    "src/demo/DemoChrome.tsx",
    "src/demo/cta.ts"
  ];
  
  console.log(`📁 Processing ${files.length} files`);
  
  let totalReplacements = 0;
  
  for (const file of files) {
    try {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${file}`);
        continue;
      }
      
      let content = fs.readFileSync(filePath, "utf8");
      const originalContent = content;
      
      // CTA text replacements
      const replacements = [
        {
          from: /Start Activation\s*(—|-)\s*Demo Expires Soon/gi,
          to: "Launch Your Branded Version Now"
        },
        {
          from: /Activate for Your Customers/gi,
          to: "Launch Your Branded Version Now"
        },
        {
          from: /Demo Expires Soon/gi,
          to: "Launch Your Branded Version Now"
        },
        {
          from: /Launch Your Branded Version(?! Now)/gi,
          to: "Launch Your Branded Version Now"
        },
        {
          from: /Launch on Your Domain/gi,
          to: "Launch Your Branded Version Now"
        },
        {
          from: /Launch on.*Domain/gi,
          to: "Launch Your Branded Version Now"
        },
        {
          from: /Get Your White-Label Demo Today/gi,
          to: "Launch Your Branded Version Now"
        },
        {
          from: /Put this on our site/gi,
          to: "Launch Your Branded Version Now"
        },
        {
          from: /Generate Solar Intelligence Report/gi,
          to: "Launch Your Branded Version Now"
        },
        {
          from: /Launch My Branded Tool/gi,
          to: "Launch Your Branded Version Now"
        }
      ];
      
      // Subcopy replacements
      const subcopyReplacements = [
        {
          from: /Live on your site in 24 hours — setup fee refunded if not/gi,
          to: "Live in 24 hours — or your setup fee is refunded."
        },
        {
          from: /Live on your site in 24 hours — setup fee refunded/gi,
          to: "Live in 24 hours — or your setup fee is refunded."
        },
        {
          from: /setup fee refunded if not/gi,
          to: "or your setup fee is refunded."
        },
        {
          from: /setup fee refunded/gi,
          to: "or your setup fee is refunded."
        }
      ];
      
      // Apply replacements
      for (const replacement of [...replacements, ...subcopyReplacements]) {
        const matches = content.match(replacement.from);
        if (matches) {
          content = content.replace(replacement.from, replacement.to);
          totalReplacements += matches.length;
        }
      }
      
      // Write file if changed
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated: ${file}`);
      } else {
        console.log(`⏭️  No changes: ${file}`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  }
  
  console.log(`🎉 CTA overhaul complete! Made ${totalReplacements} replacements across ${files.length} files.`);
}

// Run the script
updateCTAs().catch(console.error);