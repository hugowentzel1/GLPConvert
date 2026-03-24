import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/src/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const body = await request.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    // Fetch the checkout session to get customer ID
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session.customer) {
      return NextResponse.json(
        { error: "No customer found for this session" },
        { status: 400 },
      );
    }

    // Create billing portal session
    const base =
      process.env.NEXT_PUBLIC_APP_URL || "https://demo.sunspiredemo.com";
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: session.customer as string,
      return_url: `${base}/success?session_id=${session_id}`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Portal session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 },
    );
  }
}
