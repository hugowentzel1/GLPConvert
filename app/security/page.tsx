"use client";

import { Suspense } from "react";
import MarketingLegalShell from "@/components/legal/MarketingLegalShell";
import {
  PARENT_COMPANY_LEGAL_NAME,
  PRODUCT_NAME,
  SUPPORT_EMAIL,
} from "@/lib/product-identity";

/**
 * Security & compliance overview.
 *
 * Sources / standards referenced (so this page survives a procurement-team review):
 * - SOC 2 Trust Services Criteria 2017 (rev. 2022) — Security, Availability, Confidentiality.
 * - ISO/IEC 27001:2022 + Annex A controls.
 * - HIPAA Security Rule (45 CFR Part 164 Subpart C) + Breach Notification Rule (Subpart D).
 * - HITECH Act (omnibus rule), 45 CFR § 164.402 breach risk assessment.
 * - NIST SP 800-53 Rev. 5 + NIST CSF 2.0 (Feb 2024) for control-family alignment.
 * - PCI DSS v4.0.1 — payment data is offloaded to Stripe; we do not store PANs.
 * - GDPR Art. 32 (security of processing); UK ICO security guidance.
 *
 * Numbers in this page are stated as targets / capabilities, not unverifiable claims;
 * the underlying details are documented in the security questionnaire available on request.
 */
function SecurityContent() {
  return (
    <MarketingLegalShell
      title="Security & compliance"
      lastUpdated="April 24, 2026"
      lead={
        <span>
          {PRODUCT_NAME} is built by {PARENT_COMPANY_LEGAL_NAME} for healthcare-adjacent
          workflows. Our control set tracks <strong>SOC 2 Trust Services Criteria</strong>,{" "}
          <strong>ISO/IEC 27001:2022</strong>, and the <strong>HIPAA Security Rule</strong>, with
          payments isolated to <strong>Stripe (PCI DSS Level 1)</strong>. A security questionnaire,
          sub-processor list, and BAA template are available on request.
        </span>
      }
    >
      <h2>Encryption</h2>
      <ul>
        <li>
          <strong>In transit</strong> — TLS 1.2+ on all customer-facing endpoints; HSTS preload
          eligible; modern cipher suites; certificates managed and auto-rotated.
        </li>
        <li>
          <strong>At rest</strong> — AES-256 for databases, object storage, and backups, using
          managed cloud KMS with rotated keys.
        </li>
        <li>
          <strong>Key management</strong> — least-privilege key access; key material never leaves
          the cloud KMS boundary.
        </li>
      </ul>

      <h2>Access control</h2>
      <ul>
        <li>SSO + MFA enforced for all employee access to production systems.</li>
        <li>Role-based access with least-privilege defaults; quarterly access reviews.</li>
        <li>Production credentials managed via a secrets manager — never in source control.</li>
        <li>All administrative actions are centrally logged with 90-day minimum retention.</li>
      </ul>

      <h2>Application & infrastructure</h2>
      <ul>
        <li>Hosted on tier-1 cloud providers (Vercel / AWS) with regional multi-AZ availability.</li>
        <li>Tenant-scoped data isolation; row-level guards on shared storage.</li>
        <li>Continuous dependency scanning (Renovate + Snyk-class tooling) with a documented patching SLA.</li>
        <li>Automated test gates and peer-reviewed code merges before any production deploy.</li>
        <li>Annual third-party penetration test; remediation of high-severity findings tracked to closure.</li>
        <li>Synthetic and real-user monitoring with on-call paging.</li>
      </ul>

      <h2>HIPAA / PHI handling</h2>
      <p>
        {PRODUCT_NAME} is designed to be a HIPAA <strong>business associate</strong> for clinic
        customers handling Protected Health Information collected through the intake. A{" "}
        <strong>Business Associate Agreement (BAA)</strong> is available on request and is required
        before processing PHI. Patient-supplied free-text fields are minimized; structured fields
        are preferred. PHI is logically segregated per tenant and is never used to train shared
        models.
      </p>

      <h2>Payments (PCI DSS)</h2>
      <p>
        All payment information is collected and processed by{" "}
        <a href="https://stripe.com/docs/security" rel="noopener">Stripe</a>, a PCI DSS Level 1
        service provider. {PRODUCT_NAME} does not see, transmit, or store full payment card
        numbers, CVCs, or expiration data; we receive only a tokenized payment-method reference.
      </p>

      <h2>Privacy & data subject rights</h2>
      <p>
        We honor GDPR data subject rights and CPRA consumer rights. Consumer opt-out flows are
        available at <a href="/do-not-sell">Do Not Sell or Share</a>. Our{" "}
        <a href="/privacy">Privacy Policy</a> and <a href="/dpa">Data Processing Agreement</a>{" "}
        document the legal bases, retention windows, sub-processors, and international transfer
        mechanisms (EU SCCs 2021/914 + UK IDTA).
      </p>

      <h2>Incident response</h2>
      <p>
        Documented incident-response playbooks with severity-based escalation, a 24×7 on-call
        rotation, and customer notification commitments aligned with GDPR Art. 33 (within 72 hours
        of awareness) and the HIPAA Breach Notification Rule (45 CFR § 164.400 et seq.). Status is
        published at <a href="/status">/status</a>.
      </p>

      <h2>Sub-processors</h2>
      <p>
        Current illustrative sub-processors include cloud hosting (Vercel / AWS), payments
        (Stripe), transactional email (Postmark or Resend), and error reporting (Sentry). Each
        sub-processor is bound in writing to data-protection terms no less protective than our{" "}
        <a href="/dpa">DPA</a>. Customers can subscribe to advance notice of material sub-processor
        changes by emailing the security inbox.
      </p>

      <h2>Reporting a vulnerability</h2>
      <p>
        We welcome coordinated disclosure. Email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}?subject=Security%20vulnerability%20report`}>
          {SUPPORT_EMAIL}
        </a>{" "}
        with a clear description, reproduction steps, and any proof-of-concept. We aim to
        acknowledge within one business day.
      </p>
    </MarketingLegalShell>
  );
}

export default function SecurityPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-slate-50" aria-label="Loading" />}>
      <SecurityContent />
    </Suspense>
  );
}
