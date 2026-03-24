// Stripe webhook with idempotency and email notifications
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/src/lib/stripe";
import { headers } from "next/headers";
import { ENV } from "@/src/config/env";
import Stripe from "stripe";
import {
  upsertTenantByHandle,
  createOrLinkUserOwner,
  setRequestedDomain,
  setTenantDomainStatus,
  TENANT_FIELDS,
} from "@/src/lib/storage";
import {
  getRootDomain,
  buildFixedQuoteDomain,
  extractCompanyWebsite,
} from "@/src/lib/domainRoot";
import { withIdempotency } from "@/lib/webhook-idempotency";
import { sendOnboardingEmail, generateMagicLink } from "@/lib/email-service";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let eventId: string = 'unknown';
  let eventType: string = 'unknown';
  let livemode: boolean = false;

  try {
    const stripe = getStripe();

    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("[Webhook] Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    // Parse event ID for idempotency and logging
    const parsedBody = JSON.parse(body);
    eventId = parsedBody.id || 'unknown';
    eventType = parsedBody.type || 'unknown';
    livemode = parsedBody.livemode || false;
    
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        ENV.STRIPE_WEBHOOK_SECRET!,
      );
      // Update from actual event object
      eventId = event.id;
      eventType = event.type;
      livemode = event.livemode;
    } catch (err) {
      console.error(`[Webhook] Signature verification failed for event ${eventId}:`, err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Log webhook received
    console.log(`[Webhook] Received event: ${eventType} (id: ${eventId}, livemode: ${livemode})`);

    try {
      // Use idempotency wrapper to prevent duplicate processing
      const result = await withIdempotency(eventId, async () => {
        let handlerResult: { success: boolean; storage?: boolean; email?: boolean; error?: string } = { success: false };

        switch (event.type) {
          case "checkout.session.completed":
            handlerResult = await handleCheckoutCompleted(
              event.data.object as Stripe.Checkout.Session,
            );
            break;

        case "payment_intent.succeeded":
          await handlePaymentSucceeded(
            event.data.object as Stripe.PaymentIntent,
          );
          handlerResult = { success: true };
          break;

        case "invoice.payment_succeeded":
          await handleInvoicePaymentSucceeded(
            event.data.object as Stripe.Invoice,
          );
          handlerResult = { success: true };
          break;

        case "invoice.payment_failed":
          await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          handlerResult = { success: true };
          break;

        case "customer.subscription.updated":
          await handleSubscriptionUpdated(
            event.data.object as Stripe.Subscription,
          );
          handlerResult = { success: true };
          break;

        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription,
          );
          handlerResult = { success: true };
          break;

        default:
          console.log(`[Webhook] Unhandled event type: ${event.type}`);
          handlerResult = { success: true }; // Not an error, just unhandled
        }
        
        return handlerResult;
      });

      const duration = Date.now() - startTime;
      
      if (result === null) {
        console.log(`[Webhook] Event ${eventId} already processed (idempotency), returning 200`);
        return NextResponse.json({ received: true, idempotent: true });
      }

      // Log side effects
      if (result.storage !== undefined) {
        console.log(`[Webhook] Supabase upsert: ${result.storage ? '✅ success' : '❌ failed'}`);
      }
      if (result.email !== undefined) {
        console.log(`[Webhook] Email send: ${result.email ? '✅ success' : '❌ failed'}`);
      }

      if (result.success) {
        console.log(`[Webhook] Event ${eventId} processed successfully in ${duration}ms`);
        return NextResponse.json({ received: true, eventId, eventType, livemode });
      } else {
        console.error(`[Webhook] Event ${eventId} processing failed: ${result.error || 'Unknown error'}`);
        return NextResponse.json(
          { error: result.error || "Webhook processing failed", eventId, eventType },
          { status: 500 },
        );
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`[Webhook] Handler error for ${eventId} after ${duration}ms:`, errorMsg);
      return NextResponse.json(
        { error: `Webhook processing failed: ${errorMsg}`, eventId, eventType },
        { status: 500 },
      );
    }
  } catch (err: unknown) {
    const duration = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`[Webhook] Fatal error for ${eventId} after ${duration}ms:`, errorMessage);
    return NextResponse.json({ error: errorMessage, eventId, eventType }, { status: 500 });
  }
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<{ success: boolean; storage?: boolean; email?: boolean; error?: string }> {
  console.log(`[CheckoutCompleted] Processing session: ${session.id} (livemode: ${session.livemode})`);
  console.log(`[CheckoutCompleted] Customer email: ${session.customer_email || 'none'}`);
  console.log(`[CheckoutCompleted] Metadata:`, session.metadata);

  const { token, company, plan, utm_source, utm_campaign } =
    session.metadata || {};

  // Hard fail if company missing - throw error instead of silent return
  if (!company || company.trim() === '') {
    const errorMsg = "Missing or empty company metadata in checkout session";
    console.error(`[CheckoutCompleted] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  try {
    // Generate API key for the tenant
    const apiKey = generateApiKey();
    const baseUrl = ENV.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const loginUrl = `${baseUrl}/c/${company}`;
    const captureUrl = `${baseUrl}/v1/ingest/lead`;

    console.log(`[CheckoutCompleted] Tenant data:`, {
      company,
      plan: plan || "Starter",
      hasToken: !!token,
      utm_source: utm_source || 'none',
      utm_campaign: utm_campaign || 'none',
      apiKeyPrefix: apiKey.substring(0, 8) + '...',
    });

    // Create/update tenant in Supabase - bubble errors
    let storageSuccess = false;
    let tenant: { id: string };
    try {
      console.log(`[CheckoutCompleted] Upserting tenant in Supabase: ${company}`);
      const result = await upsertTenantByHandle(company, {
        [TENANT_FIELDS.COMPANY_HANDLE]: company,
        [TENANT_FIELDS.PLAN]: plan || "Starter",
        [TENANT_FIELDS.API_KEY]: apiKey,
        [TENANT_FIELDS.DOMAIN_LOGIN_URL]: loginUrl,
        [TENANT_FIELDS.CAPTURE_URL]: captureUrl,
        [TENANT_FIELDS.PAYMENT_STATUS]: "Paid",
        [TENANT_FIELDS.STRIPE_CUSTOMER_ID]: session.customer as string,
        [TENANT_FIELDS.LAST_PAYMENT]: new Date().toISOString(),
      });
      tenant = { id: result.id as string };
      storageSuccess = true;
      console.log(`[CheckoutCompleted] ✅ Supabase upsert successful - tenant ID: ${tenant.id}`);
    } catch (storageError) {
      const errorMsg = storageError instanceof Error ? storageError.message : String(storageError);
      console.error(`[CheckoutCompleted] ❌ Supabase upsert failed: ${errorMsg}`);
      throw new Error(`Supabase upsert failed: ${errorMsg}`);
    }

    // Set up custom domain if company website is available (non-blocking)
    let requestedDomain: string | null = null;
    try {
      const companyWebsite = extractCompanyWebsite(company);
      if (companyWebsite) {
        const root = getRootDomain(companyWebsite);
        if (root) {
          requestedDomain = buildFixedQuoteDomain(root);
          if (requestedDomain) {
            await setRequestedDomain(company, requestedDomain);
            await setTenantDomainStatus(company, "proposed");
            console.log(`[CheckoutCompleted] ✅ Domain setup initiated: ${requestedDomain}`);
          }
        }
      }
    } catch (domainError) {
      console.warn(`[CheckoutCompleted] ⚠️  Domain setup failed (non-blocking):`, domainError);
    }

    // Link the payer as owner if email exists (non-blocking)
    if (session.customer_email) {
      try {
        const userId = await createOrLinkUserOwner(
          tenant.id,
          session.customer_email,
        );
        console.log(`[CheckoutCompleted] ✅ User linked as owner: ${userId}`);
      } catch (userError) {
        console.warn(`[CheckoutCompleted] ⚠️  User creation failed (non-blocking):`, userError);
      }
    }

    // Send onboarding email (non-blocking but tracked)
    let emailSuccess = false;
    if (session.customer_email) {
      try {
        const instantUrl = `${baseUrl}/${company}`;
        const customDomain = requestedDomain || `quote.${company}.com`;
        const embedCode = `<iframe 
  src="${instantUrl}" 
  width="100%" 
  height="600" 
  frameborder="0"
  title="${company} Solar Calculator">
</iframe>`;
        const dashboardUrl = `${baseUrl}/c/${company}`;
        const magicLinkUrl = generateMagicLink(session.customer_email, company);

        const emailResult = await sendOnboardingEmail({
          toEmail: session.customer_email,
          company,
          instantUrl,
          customDomain,
          embedCode,
          apiKey,
          dashboardUrl,
          magicLinkUrl,
        });

        emailSuccess = emailResult.success;
        if (emailSuccess) {
          console.log(`[CheckoutCompleted] ✅ Onboarding email sent to: ${session.customer_email}`);
        } else {
          console.error(`[CheckoutCompleted] ❌ Email send failed:`, emailResult.error);
        }
      } catch (emailError) {
        console.error(`[CheckoutCompleted] ❌ Email send exception:`, emailError);
        emailSuccess = false;
      }
    } else {
      console.warn(`[CheckoutCompleted] ⚠️  No customer email - skipping onboarding email`);
    }

    console.log(`[CheckoutCompleted] ✅ Tenant provisioned successfully: ${company}`);
    return { success: true, storage: storageSuccess, email: emailSuccess };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[CheckoutCompleted] ❌ Failed to provision tenant: ${errorMsg}`);
    // Re-throw to bubble up to webhook handler
    throw err;
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("✅ Payment intent succeeded:", paymentIntent.id);
  // Handle any additional payment success logic
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("✅ Invoice payment succeeded:", invoice.id);
  // Note: Invoice objects don't directly contain subscription information
  // Subscription status updates are handled via subscription events
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("❌ Invoice payment failed:", invoice.id);
  // Note: Invoice objects don't directly contain subscription information
  // Subscription status updates are handled via subscription events
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("✅ Subscription updated:", subscription.id);
  const status =
    subscription.status === "active"
      ? "Active"
      : subscription.status === "past_due"
        ? "PastDue"
        : subscription.status === "canceled"
          ? "Canceled"
          : "Inactive";
  await updateTenantSubscriptionStatus(subscription.id, status, Date.now());
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("❌ Subscription deleted:", subscription.id);
  await updateTenantSubscriptionStatus(subscription.id, "Canceled", Date.now());
}

async function updateTenantSubscriptionStatus(
  subscriptionId: string,
  status: string,
  periodEnd: number,
) {
  try {
    const { findTenantBySubscriptionId, upsertTenantByHandle } = await import("@/src/lib/storage");
    
    console.log(`[SubscriptionUpdate] Looking up tenant by subscription ID: ${subscriptionId}`);
    const tenant = await findTenantBySubscriptionId(subscriptionId);
    
    if (!tenant) {
      console.warn(`[SubscriptionUpdate] No tenant found for subscription ID: ${subscriptionId}`);
      return;
    }
    
    const handle = tenant[TENANT_FIELDS.COMPANY_HANDLE] as string;
    if (!handle) {
      console.error(`[SubscriptionUpdate] Tenant ${tenant.id} has no company handle`);
      return;
    }
    
    console.log(`[SubscriptionUpdate] Updating tenant "${handle}": status=${status}, periodEnd=${new Date(periodEnd * 1000).toISOString()}`);
    
    await upsertTenantByHandle(handle, {
      [TENANT_FIELDS.PAYMENT_STATUS]: status,
      [TENANT_FIELDS.SUBSCRIPTION_ID]: subscriptionId,
      [TENANT_FIELDS.CURRENT_PERIOD_END]: new Date(periodEnd * 1000).toISOString(),
    });
    
    console.log(`[SubscriptionUpdate] ✅ Tenant "${handle}" subscription status updated successfully`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[SubscriptionUpdate] ❌ Failed to update tenant subscription status: ${errorMsg}`);
    throw error; // Bubble up so webhook returns 500 and Stripe retries
  }
}

function generateApiKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 48; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
