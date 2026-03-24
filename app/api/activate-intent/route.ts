import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, companyHandle, plan = "standard", crm } = body;

    // Validate required fields
    if (!companyHandle) {
      return NextResponse.json(
        { error: "companyHandle is required" },
        { status: 400 },
      );
    }

    // TODO: Implement Stripe Checkout session creation
    // For now, return a placeholder URL
    const checkoutUrl = `https://checkout.stripe.com/pay/placeholder?company=${encodeURIComponent(companyHandle)}&plan=${plan}`;

    return NextResponse.json({
      url: checkoutUrl,
      sessionId: `cs_placeholder_${Date.now()}`,
    });
  } catch (error) {
    console.error("Activation intent error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
