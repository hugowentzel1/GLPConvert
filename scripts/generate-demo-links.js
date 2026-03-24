#!/usr/bin/env node

/**
 * Demo Link Generator for Sunspire White-Label Solar Tool
 *
 * This script generates personalized demo links for different companies
 * to showcase the white-label capabilities.
 */

const companies = [
  {
    name: "SolarPro Energy",
    slug: "solarpro",
    colors: "Green (#059669)",
    logo: "https://logo.clearbit.com/solarpro.com",
    demoUrl:
      "http://localhost:3000?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com&demo=1",
    productionUrl:
      "https://sunspire-web-app.vercel.app?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com&demo=1",
  },
  {
    name: "EcoSolar Solutions",
    slug: "ecosolar",
    colors: "Eco Green (#16A34A)",
    logo: "https://logo.clearbit.com/ecosolar.com",
    demoUrl:
      "http://localhost:3000?company=EcoSolar%20Solutions&brandColor=%2316A34A&logo=https://logo.clearbit.com/ecosolar.com&demo=1",
    productionUrl:
      "https://sunspire-web-app.vercel.app?company=EcoSolar%20Solutions&brandColor=%2316A34A&logo=https://logo.clearbit.com/ecosolar.com&demo=1",
  },
  {
    name: "Premium Solar Group",
    slug: "premiumsolar",
    colors: "Purple (#7C3AED)",
    logo: "https://logo.clearbit.com/premiumsolar.com",
    demoUrl:
      "http://localhost:3000?company=Premium%20Solar%20Group&brandColor=%237C3AED&logo=https://logo.clearbit.com/premiumsolar.com&demo=1",
    productionUrl:
      "https://sunspire-web-app.vercel.app?company=Premium%20Solar%20Group&brandColor=%237C3AED&logo=https://logo.clearbit.com/premiumsolar.com&demo=1",
  },
  {
    name: "ACME Solar",
    slug: "acme",
    colors: "Blue (#2563EB)",
    logo: "https://logo.clearbit.com/acme.com",
    demoUrl:
      "http://localhost:3000?company=ACME%20Solar&brandColor=%232563EB&logo=https://logo.clearbit.com/acme.com&demo=1",
    productionUrl:
      "https://sunspire-web-app.vercel.app?company=ACME%20Solar&brandColor=%232563EB&logo=https://logo.clearbit.com/acme.com&demo=1",
  },
];

function generateDemoLinks() {
  console.log("🚀 Sunspire White-Label Demo Links\n");
  console.log("Use these links to showcase different company branding:\n");

  companies.forEach((company, index) => {
    console.log(`${index + 1}. ${company.name}`);
    console.log(`   Colors: ${company.colors}`);
    console.log(`   Local Demo: ${company.demoUrl}`);
    console.log(`   Production: ${company.productionUrl}`);
    console.log("");
  });

  console.log("📧 Email Template Examples:");
  console.log("==========================\n");

  companies.forEach((company) => {
    console.log(
      `Subject: Exclusive Preview - ${company.name} Solar Intelligence Tool`,
    );
    console.log("");
    console.log(`Hi [Company Name],`);
    console.log("");
    console.log(
      `I wanted to share an exclusive preview of how your solar company could look with our white-label solar intelligence tool.`,
    );
    console.log("");
    console.log(`Check out this demo customized for ${company.name}:`);
    console.log(`${company.demoUrl}`);
    console.log("");
    console.log(`Key Features:`);
    console.log(`• Your company branding and colors`);
    console.log(`• Professional solar estimates and reports`);
    console.log(`• White-label ready for immediate launch`);
    console.log(`• Premium, expensive-looking UI that converts`);
    console.log("");
    console.log(
      `Would you like to see how this could look with your specific branding?`,
    );
    console.log("");
    console.log(`Best regards,`);
    console.log(`[Your Name]`);
    console.log("==========================\n");
  });

  console.log("💡 Pro Tips:");
  console.log("- Customize the email content for each company");
  console.log("- Include screenshots of their branded version");
  console.log("- Follow up with a personalized demo call");
  console.log("- Highlight the premium, expensive appearance");
  console.log("- Emphasize the white-label conversion potential");
}

function generateCSV() {
  console.log("📊 CSV Format for Mass Email Campaign:");
  console.log("Company Name,Contact Email,Slug,Demo URL,Colors");

  companies.forEach((company) => {
    console.log(
      `${company.name},info@${company.slug}.com,${company.slug},${company.demoUrl},${company.colors}`,
    );
  });
}

// Run the generator
if (process.argv.includes("--csv")) {
  generateCSV();
} else {
  generateDemoLinks();
}
