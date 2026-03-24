import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const { plan, domain, subdomain, planType, email, utm } =
      await request.json();

    if (!plan || !domain || !subdomain) {
      return NextResponse.json(
        { error: "Missing required fields: plan, domain, subdomain" },
        { status: 400 },
      );
    }

    // For now, return a mock checkout URL
    // In production, this would create a real Stripe Checkout Session with:
    // - price_setup_399 (one-time $399)
    // - price_monthly_99 (recurring $99/mo, trial_period_days=14) OR
    // - price_annual_999 (recurring $999/yr)
    // - subscription_data.add_invoice_items = [{ price: price_setup_399 }]

    const mockCheckoutUrl = `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substr(2, 9)}#fid=${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      url: mockCheckoutUrl,
      sessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
      planType,
      setupFee: 399,
      monthlyPrice: planType === "monthly" ? 99 : 0,
      annualPrice: planType === "annual" ? 999 : 0,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
