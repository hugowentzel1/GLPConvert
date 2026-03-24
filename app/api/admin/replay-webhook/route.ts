import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/src/lib/stripe";
import { ENV } from "@/src/config/env";
import { handleCheckoutCompleted } from "@/app/api/stripe/webhook/route";
import { timingSafeCompare } from "@/src/lib/timing-safe-compare";

/**
 * Admin-only endpoint to replay a Stripe webhook event
 * Useful for recovery when webhook fails
 */
export async function GET(req: NextRequest) {
  try {
    // Check admin token (timing-safe comparison)
    const adminToken = req.headers.get("x-admin-token");
    if (!adminToken || !ENV.ADMIN_TOKEN || !timingSafeCompare(adminToken, ENV.ADMIN_TOKEN)) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid admin token" },
        { status: 401 },
      );
    }

    const url = new URL(req.url);
    const eventId = url.searchParams.get("event_id");

    if (!eventId) {
      return NextResponse.json(
        { error: "Missing event_id query parameter" },
        { status: 400 },
      );
    }

    console.log(`[ReplayWebhook] Admin replay requested for event: ${eventId}`);

    const stripe = getStripe();

    // Fetch event from Stripe
    const event = await stripe.events.retrieve(eventId);
    console.log(`[ReplayWebhook] Retrieved event: ${event.type} (livemode: ${event.livemode})`);

    // Only handle checkout.session.completed for now
    if (event.type !== "checkout.session.completed") {
      return NextResponse.json(
        { error: `Event type ${event.type} not supported for replay. Only checkout.session.completed is supported.` },
        { status: 400 },
      );
    }

    // Process the event
    const session = event.data.object as any;
    const result = await handleCheckoutCompleted(session);

    return NextResponse.json({
      success: true,
      eventId: event.id,
      eventType: event.type,
      livemode: event.livemode,
      result,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[ReplayWebhook] Error: ${errorMsg}`);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 },
    );
  }
}
