#!/usr/bin/env node

/**
 * Stripe Webhook Test Script
 * Tests the webhook endpoint to ensure tenant creation works
 */

const https = require("https");
const crypto = require("crypto");

const WEBHOOK_URL = "https://sunspire-web-app.vercel.app/api/stripe/webhook";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  console.error("❌ STRIPE_WEBHOOK_SECRET environment variable required");
  process.exit(1);
}

// Sample checkout.session.completed event
const testEvent = {
  id: "evt_test_webhook",
  object: "event",
  type: "checkout.session.completed",
  data: {
    object: {
      id: "cs_test_123",
      object: "checkout.session",
      customer_email: "test@example.com",
      amount_total: 139800, // $99 setup + $99 monthly
      currency: "usd",
      payment_status: "paid",
      metadata: {
        company_handle: "test-company",
        setup_price_id: process.env.STRIPE_PRICE_SETUP_399,
        monthly_price_id: process.env.STRIPE_PRICE_MONTHLY_99,
      },
    },
  },
};

// Create webhook signature
const payload = JSON.stringify(testEvent);
const timestamp = Math.floor(Date.now() / 1000);
const signature = crypto
  .createHmac("sha256", WEBHOOK_SECRET)
  .update(timestamp + "." + payload)
  .digest("hex");

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Stripe-Signature": `t=${timestamp},v1=${signature}`,
  },
};

console.log("🧪 Testing Stripe webhook...");
console.log(`📡 URL: ${WEBHOOK_URL}`);
console.log(`📦 Payload: ${payload.substring(0, 100)}...`);

const req = https.request(WEBHOOK_URL, options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log(`\n📊 Response Status: ${res.statusCode}`);
    console.log(`📄 Response Body: ${data}`);

    if (res.statusCode === 200) {
      console.log("✅ Webhook test successful!");
      console.log(
        '🔍 Check Airtable Tenants table for new "test-company" entry',
      );
    } else {
      console.log("❌ Webhook test failed");
    }
  });
});

req.on("error", (error) => {
  console.error("❌ Request failed:", error.message);
});

req.write(payload);
req.end();
