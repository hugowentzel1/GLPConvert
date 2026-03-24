#!/usr/bin/env node

/**
 * Custom Domain Test Script
 * Tests the domain onboarding flow end-to-end
 */

const https = require("https");

const BASE_URL = "https://sunspire-web-app.vercel.app";
const TEST_DOMAIN = process.argv[2] || "test.example.com";

if (!process.env.VERCEL_TOKEN || !process.env.VERCEL_PROJECT_ID) {
  console.error(
    "❌ VERCEL_TOKEN and VERCEL_PROJECT_ID environment variables required",
  );
  process.exit(1);
}

async function testDomainFlow() {
  console.log("🌐 Testing Custom Domain Flow");
  console.log(`📡 Testing domain: ${TEST_DOMAIN}`);
  console.log(`🔗 Base URL: ${BASE_URL}\n`);

  // Step 1: Test domain attach
  console.log("1️⃣ Testing domain attach...");
  try {
    const attachResponse = await makeRequest(`${BASE_URL}/api/domains/attach`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain: TEST_DOMAIN }),
    });

    if (attachResponse.status === 200) {
      console.log("✅ Domain attach successful");
      console.log(`📋 Instructions: ${attachResponse.data.instructions}`);
    } else {
      console.log("❌ Domain attach failed:", attachResponse.data);
    }
  } catch (error) {
    console.log("❌ Domain attach error:", error.message);
  }

  // Step 2: Test domain verify
  console.log("\n2️⃣ Testing domain verify...");
  try {
    const verifyResponse = await makeRequest(`${BASE_URL}/api/domains/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain: TEST_DOMAIN }),
    });

    if (verifyResponse.status === 200) {
      console.log("✅ Domain verify successful");
      console.log(`📊 Status: ${verifyResponse.data.status}`);
    } else {
      console.log("❌ Domain verify failed:", verifyResponse.data);
    }
  } catch (error) {
    console.log("❌ Domain verify error:", error.message);
  }

  // Step 3: Test domain status
  console.log("\n3️⃣ Testing domain status...");
  try {
    const statusResponse = await makeRequest(
      `${BASE_URL}/api/domains/status?domain=${TEST_DOMAIN}`,
    );

    if (statusResponse.status === 200) {
      console.log("✅ Domain status check successful");
      console.log(`📊 Status: ${statusResponse.data.status}`);
      console.log(`🔗 URL: ${statusResponse.data.url}`);
    } else {
      console.log("❌ Domain status check failed:", statusResponse.data);
    }
  } catch (error) {
    console.log("❌ Domain status error:", error.message);
  }

  console.log("\n🎯 Domain test complete!");
  console.log("📝 Next steps:");
  console.log(
    "   1. Add CNAME record: test.example.com CNAME sunspire-web-app.vercel.app",
  );
  console.log("   2. Wait 5-10 minutes for DNS propagation");
  console.log("   3. Run: node test-domain.js test.example.com");
  console.log('   4. Check if domain shows as "live"');
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: {
        "User-Agent": "Sunspire-Domain-Test/1.0",
        ...options.headers,
      },
    };

    const req = https.request(requestOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on("error", reject);

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

testDomainFlow().catch(console.error);
