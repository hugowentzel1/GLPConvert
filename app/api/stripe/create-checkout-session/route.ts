import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/src/lib/stripe";
import { checkRateLimit } from "@/src/lib/ratelimit";

// Helper function to extract client IP
function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  // Rate limiting check
  const clientIP = getClientIP(req);
  if (checkRateLimit(clientIP, "stripe-checkout")) {
    console.warn(`Rate limited: ${clientIP} for stripe-checkout`);
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const stripeClient = getStripe();
    console.log("🔍 Stripe checkout request received");

    // Get price IDs from environment - hard fail on missing
    const monthlyPrice =
      process.env.STRIPE_PRICE_STARTER || 
      process.env.STRIPE_PRICE_MONTHLY ||
      process.env.STRIPE_PRICE_MONTHLY_99;
    
    const setupPrice = process.env.STRIPE_PRICE_SETUP_399;
    
    // Hard fail with clear error
    if (!monthlyPrice || monthlyPrice.trim() === '') {
      const errorMsg = "Stripe monthly price ID is missing or empty. Set STRIPE_PRICE_STARTER, STRIPE_PRICE_MONTHLY, or STRIPE_PRICE_MONTHLY_99";
      console.error(`❌ ${errorMsg}`);
      return NextResponse.json({ 
        error: errorMsg,
        required: ["STRIPE_PRICE_STARTER | STRIPE_PRICE_MONTHLY | STRIPE_PRICE_MONTHLY_99"]
      }, { status: 500 });
    }
    
    if (!setupPrice || setupPrice.trim() === '') {
      const errorMsg = "Stripe setup price ID is missing or empty. Set STRIPE_PRICE_SETUP_399";
      console.error(`❌ ${errorMsg}`);
      return NextResponse.json({ 
        error: errorMsg,
        required: ["STRIPE_PRICE_SETUP_399"]
      }, { status: 500 });
    }

    // Log which price IDs are being used (safe to log)
    console.log(`[Checkout] Using price IDs - Monthly: ${monthlyPrice.substring(0, 8)}..., Setup: ${setupPrice.substring(0, 8)}...`);

    // Read params from POST JSON
    const body = await req.json();
    const {
      plan = "starter",
      token,
      company,
      email,
      utm_source,
      utm_campaign,
      utm_medium,
      utm_term,
      utm_content,
      tenant_handle,
      cancel_url,
      client_reference_id,
    } = body;

    console.log("🔍 Creating Stripe checkout session...");
    console.log("🔍 Request data:", {
      plan,
      token,
      company,
      email,
      utm_source,
      utm_campaign,
      utm_medium,
      utm_term,
      utm_content,
      tenant_handle,
      cancel_url,
      client_reference_id,
    });

    // Build URLs
    const base = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
      /\/$/,
      "",
    );

    const metaUtm = {
      utm_source: utm_source || "",
      utm_campaign: utm_campaign || "",
      utm_medium: utm_medium || "",
      utm_term: utm_term || "",
      utm_content: utm_content || "",
    };

    const ref =
      typeof client_reference_id === "string" && client_reference_id.trim().length > 0
        ? client_reference_id.trim().slice(0, 200)
        : undefined;

    // Create Stripe checkout session with both setup fee and monthly subscription
    const checkoutSession = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      ...(ref ? { client_reference_id: ref } : {}),
      line_items: [
        {
          price: monthlyPrice,
          quantity: 1,
        },
        {
          price: setupPrice,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          tenant_handle: tenant_handle || company || "",
          plan,
          ...metaUtm,
        },
      },
      metadata: {
        token: token || "",
        company: company || "",
        tenant_handle: tenant_handle || company || "",
        plan,
        ...metaUtm,
      },
      success_url: `${base}/c/${encodeURIComponent((company || '').toLowerCase().replace(/[^a-z0-9]/g, '-'))}?session_id={CHECKOUT_SESSION_ID}&demo=1`,
      cancel_url: cancel_url || `${base}/?canceled=1&company=${encodeURIComponent(company || '')}`,
      customer_email: email || undefined,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
    });

    console.log(`✅ Stripe checkout session created: ${checkoutSession.id} (mode: ${checkoutSession.livemode ? 'live' : 'test'})`);
    console.log(`✅ Checkout URL: ${checkoutSession.url}`);
    
    return NextResponse.json({ 
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
      livemode: checkoutSession.livemode
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Rate limiting check
  const clientIP = getClientIP(req);
  if (checkRateLimit(clientIP, "stripe-checkout")) {
    console.warn(`Rate limited: ${clientIP} for stripe-checkout`);
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const stripeClient = getStripe();
    console.log("🔍 Stripe checkout GET request received");

    // Get price IDs from environment - hard fail on missing
    const monthlyPrice =
      process.env.STRIPE_PRICE_STARTER || 
      process.env.STRIPE_PRICE_MONTHLY ||
      process.env.STRIPE_PRICE_MONTHLY_99;
    
    const setupPrice = process.env.STRIPE_PRICE_SETUP_399;
    
    // Hard fail with clear error
    if (!monthlyPrice || monthlyPrice.trim() === '') {
      const errorMsg = "Stripe monthly price ID is missing or empty. Set STRIPE_PRICE_STARTER, STRIPE_PRICE_MONTHLY, or STRIPE_PRICE_MONTHLY_99";
      console.error(`❌ ${errorMsg}`);
      return NextResponse.json({ 
        error: errorMsg,
        required: ["STRIPE_PRICE_STARTER | STRIPE_PRICE_MONTHLY | STRIPE_PRICE_MONTHLY_99"]
      }, { status: 500 });
    }
    
    if (!setupPrice || setupPrice.trim() === '') {
      const errorMsg = "Stripe setup price ID is missing or empty. Set STRIPE_PRICE_SETUP_399";
      console.error(`❌ ${errorMsg}`);
      return NextResponse.json({ 
        error: errorMsg,
        required: ["STRIPE_PRICE_SETUP_399"]
      }, { status: 500 });
    }

    // Log which price IDs are being used (safe to log)
    console.log(`[Checkout] Using price IDs - Monthly: ${monthlyPrice.substring(0, 8)}..., Setup: ${setupPrice.substring(0, 8)}...`);

    // Read params from URL query string
    const url = new URL(req.url);
    const plan = url.searchParams.get("plan") || "starter";
    const token = url.searchParams.get("token");
    const company = url.searchParams.get("company");
    const email = url.searchParams.get("email");
    const utm_source = url.searchParams.get("utm_source");
    const utm_campaign = url.searchParams.get("utm_campaign");
    const utm_medium = url.searchParams.get("utm_medium");
    const utm_term = url.searchParams.get("utm_term");
    const utm_content = url.searchParams.get("utm_content");
    const tenant_handle = url.searchParams.get("tenant_handle");
    const cancel_url = url.searchParams.get("cancel_url");
    const client_reference_id = url.searchParams.get("client_reference_id");

    console.log("🔍 Creating Stripe checkout session from GET...");
    console.log("🔍 Request data:", {
      plan,
      token,
      company,
      email,
      utm_source,
      utm_campaign,
      utm_medium,
      utm_term,
      utm_content,
      tenant_handle,
      cancel_url,
      client_reference_id,
    });

    // Build URLs
    const base = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
      /\/$/,
      "",
    );

    const metaUtmGet = {
      utm_source: utm_source || "",
      utm_campaign: utm_campaign || "",
      utm_medium: utm_medium || "",
      utm_term: utm_term || "",
      utm_content: utm_content || "",
    };

    const refGet =
      client_reference_id && client_reference_id.trim().length > 0
        ? client_reference_id.trim().slice(0, 200)
        : undefined;

    // Create Stripe checkout session with both setup fee and monthly subscription
    const checkoutSession = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      ...(refGet ? { client_reference_id: refGet } : {}),
      line_items: [
        {
          price: monthlyPrice,
          quantity: 1,
        },
        {
          price: setupPrice,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          tenant_handle: tenant_handle || company || "",
          plan,
          ...metaUtmGet,
        },
      },
      metadata: {
        token: token || "",
        company: company || "",
        tenant_handle: tenant_handle || company || "",
        plan,
        ...metaUtmGet,
      },
      success_url: `${base}/c/${encodeURIComponent((company || '').toLowerCase().replace(/[^a-z0-9]/g, '-'))}?session_id={CHECKOUT_SESSION_ID}&demo=1`,
      cancel_url: cancel_url || `${base}/?canceled=1&company=${encodeURIComponent(company || '')}`,
      customer_email: email || undefined,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
    });

    console.log(`✅ Stripe checkout session created: ${checkoutSession.id} (mode: ${checkoutSession.livemode ? 'live' : 'test'})`);
    console.log(`✅ Checkout URL: ${checkoutSession.url}`);
    
    return NextResponse.json({ 
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
      livemode: checkoutSession.livemode
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Stripe checkout GET error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
