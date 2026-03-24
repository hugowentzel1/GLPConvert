import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/src/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    const stripe = getStripe();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    // Fetch the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Return session data with subscription details
    return NextResponse.json({
      id: session.id,
      metadata: session.metadata,
      subscription: session.subscription
        ? {
            current_period_end: (session.subscription as any)
              .current_period_end,
          }
        : undefined,
    });
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch session details" },
      { status: 500 },
    );
  }
}
