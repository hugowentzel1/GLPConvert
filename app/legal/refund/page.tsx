"use client";

import { Suspense } from "react";
import MarketingLegalShell from "@/components/legal/MarketingLegalShell";
import { PRODUCT_NAME, SUPPORT_EMAIL } from "@/lib/product-identity";

/**
 * Refund + cancellation policy. Aligned with current B2B SaaS norms (Baymard 2024,
 * SaaSCheckout 2024, Stripe Best Practices 2024) and consumer-protection law.
 *
 * Sources:
 * - FTC Telemarketing Sales Rule + state UDAP statutes (e.g. CA Cal. Civ. Code § 17200) for
 *   substantiation of advertised refund promises.
 * - California Auto-Renewal Law (CA Bus. & Prof. Code § 17602) — clear terms + opt-out
 *   for recurring charges.
 * - Stripe documentation: handling refunds vs disputes (recommend resolving in <30 days
 *   to avoid chargeback escalation).
 * - EU Directive 2011/83/EU (Consumer Rights) — 14-day withdrawal generally inapplicable to
 *   B2B SaaS but referenced for EU-customer transparency.
 */
function RefundContent() {
  return (
    <MarketingLegalShell title="Refund & cancellation policy" lastUpdated="April 24, 2026">
      <h2>Setup-fee refund guarantee</h2>
      <p>
        We promise that your branded {PRODUCT_NAME} site will be live on your domain within{" "}
        <strong>24 hours of purchase</strong>. If your site is not live within that window — for any
        reason on our side — the one-time setup fee is fully refundable. To request a setup-fee
        refund, email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}?subject=Setup-fee%20refund%20request`}>{SUPPORT_EMAIL}</a>{" "}
        within 7 days of purchase and include your order details.
      </p>

      <h2>Subscription fees</h2>
      <p>
        Monthly and annual subscriptions are <strong>cancel-anytime</strong>. When you cancel from
        your dashboard or by emailing support, your subscription will not renew at the next billing
        date. Subscription fees are otherwise <strong>non-refundable</strong>, including for
        partial billing periods, except as required by applicable law.
      </p>

      <h2>Annual plans</h2>
      <p>
        For annual plans, prepaid amounts are not refunded if you cancel mid-term, but the service
        continues through the paid period. We will not auto-renew an annual plan without sending
        a clear renewal notice 30 days in advance, in line with common auto-renewal-law standards
        (e.g. California Bus. &amp; Prof. Code § 17602).
      </p>

      <h2>How to request a refund</h2>
      <ol>
        <li>
          Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> from the email address on
          your account.
        </li>
        <li>Include your order ID, the date of purchase, and the reason for the request.</li>
        <li>
          We respond within <strong>1 business day</strong> and process eligible refunds within{" "}
          <strong>5–10 business days</strong> to the original payment method via Stripe.
        </li>
      </ol>

      <h2>Chargebacks</h2>
      <p>
        If you have a billing concern, please contact us first. We can almost always resolve it
        faster than your bank can. Filing a chargeback before contacting us may delay a refund and
        can result in account suspension while the dispute is investigated.
      </p>

      <h2>Exclusions</h2>
      <p>
        Refunds are not available for: violations of our{" "}
        <a href="/legal/terms">Terms of Service</a>, fraudulent or abusive use, or charges arising
        from add-on services (e.g. custom-domain configuration with third parties) that have
        already been delivered or paid through to a third party.
      </p>

      <h2>Questions</h2>
      <p>
        For anything else, email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. We&apos;d rather make it right than
        keep your money.
      </p>
    </MarketingLegalShell>
  );
}

export default function RefundPolicyPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-slate-50" aria-label="Loading" />}>
      <RefundContent />
    </Suspense>
  );
}
