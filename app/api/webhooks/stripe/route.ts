import { NextRequest, NextResponse } from "next/server";
import {
  upsertLead,
  logEvent,
  upsertTenantByHandle,
  findTenantByHandle,
} from "@/src/lib/storage";
import Stripe from "stripe";

// Ensure Node.js runtime for this endpoint
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = process.env.STRIPE_LIVE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_LIVE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil",
    })
  : null;

// Health check endpoint for monitoring (GET)
// NOTE: This is a legacy webhook endpoint. The main webhook is at /api/stripe/webhook
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    service: 'stripe-webhook-legacy',
    message: 'Legacy webhook endpoint is available',
    note: 'Main webhook is at /api/stripe/webhook',
    stripeConfigured: !!stripe
  });
}

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 },
    );
  }

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    // Verify Stripe webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const tenantHandle =
        session.metadata?.tenant_handle || session.metadata?.company;
      const email = session.customer_details?.email;
      const plan = session.metadata?.plan || "starter";
      const subscriptionId = session.subscription;

      if (tenantHandle) {
        // Upsert tenant with active status
        await upsertTenantByHandle(tenantHandle, {
          Plan: "Starter",
          "Payment Status": "active",
          stripeCustomerId: session.customer,
          stripeSubscriptionId: subscriptionId,
          paymentStatus: "active",
          lastPayment: new Date().toISOString(),
          currentPeriodEnd: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 30 days from now
        });

        // Log activation event
        await logEvent({
          tenantId: tenantHandle,
          type: "tenant_activated",
          metadata: {
            plan,
            sessionId: session.id,
            amount: session.amount_total,
            email,
            subscriptionId,
          },
        });

        console.log(
          `✅ Tenant ${tenantHandle} activated with subscription ${subscriptionId}`,
        );
      }
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object;
      const subscriptionId = (invoice as any).subscription;

      if (subscriptionId) {
        // Get subscription to find tenant
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        const tenantHandle = subscription.metadata?.tenant_handle;

        if (tenantHandle) {
          // Update tenant status to delinquent
          const tenant = await findTenantByHandle(tenantHandle);
          if (tenant) {
            await upsertTenantByHandle(tenantHandle, {
              "Payment Status": "delinquent",
            });

            console.log(`⚠️ Tenant ${tenantHandle} marked as delinquent`);
          }
        }
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const tenantHandle = subscription.metadata?.tenant_handle;

      if (tenantHandle) {
        // Update tenant status to disabled
        const tenant = await findTenantByHandle(tenantHandle);
        if (tenant) {
          await upsertTenantByHandle(tenantHandle, {
            "Payment Status": "cancelled",
          });

          console.log(
            `❌ Tenant ${tenantHandle} disabled due to subscription cancellation`,
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
