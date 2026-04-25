"use client";

import { Suspense } from "react";
import MarketingLegalShell from "@/components/legal/MarketingLegalShell";
import {
  PARENT_COMPANY_LEGAL_NAME,
  PRODUCT_NAME,
  SUPPORT_EMAIL,
} from "@/lib/product-identity";

/**
 * Data Processing Agreement — GDPR (EU/UK) Article 28 + CCPA "service provider" terms tailored for
 * a healthcare-adjacent B2B SaaS that handles patient-facing intake routing on behalf of clinic
 * customers.
 *
 * Sources used to align this with current best practice:
 * - EU Regulation 2016/679 (GDPR) Art. 28 + EDPB Guidelines 07/2020 on processor obligations.
 * - UK ICO "International Data Transfer Agreement" + EU Standard Contractual Clauses 2021/914.
 * - HIPAA 45 CFR § 164.502(e) Business Associate Agreement requirements (a separate BAA is offered
 *   to clinic customers; this DPA does not replace it).
 * - California CPRA (2023) "service provider" definition + Cal. Civ. Code § 1798.140(ag).
 * - Stripe DPA (https://stripe.com/legal/dpa) and Vercel DPA (https://vercel.com/legal/dpa) used
 *   as structural references for self-serve B2B SaaS DPAs in 2024–2026.
 *
 * This is a template companion for the executed Order Form / Terms of Service; legal counsel
 * should review before signature.
 */
function DPAContent() {
  return (
    <MarketingLegalShell title="Data Processing Agreement (DPA)" lastUpdated="April 24, 2026">
      <p>
        This Data Processing Agreement (&quot;<strong>DPA</strong>&quot;) is entered into between{" "}
        the customer (&quot;<strong>Controller</strong>&quot;) and {PARENT_COMPANY_LEGAL_NAME}{" "}
        (&quot;<strong>Processor</strong>&quot;) for the {PRODUCT_NAME} service. It supplements the{" "}
        Order Form and Terms of Service. To the extent personal data of EU/EEA, UK, or Swiss data
        subjects is processed, the EU Standard Contractual Clauses (Module 2: controller →
        processor) and the UK International Data Transfer Addendum are incorporated by reference
        and prevail over conflicting terms.
      </p>

      <p>
        For HIPAA-regulated workflows (Protected Health Information held by US-based covered
        entities), execution of a separate <strong>Business Associate Agreement</strong> is
        available on request and governs in conflict with this DPA.
      </p>

      <h2>1. Definitions</h2>
      <p>
        Capitalized terms have the meanings given in GDPR Article 4, in CPRA § 1798.140, and in 45
        CFR § 164.103 (HIPAA). Without limitation:
      </p>
      <ul>
        <li>
          <strong>Personal Data</strong> — any information relating to an identified or
          identifiable natural person processed under the Order Form, including, where applicable,
          patient-supplied intake answers (height, weight, goal weight, contact details).
        </li>
        <li>
          <strong>Processing</strong> — any operation performed on Personal Data, including
          collection, storage, transmission, and deletion.
        </li>
        <li>
          <strong>Sub-processor</strong> — any third party engaged by the Processor to process
          Personal Data on behalf of the Controller.
        </li>
      </ul>

      <h2>2. Subject matter, nature, and duration</h2>
      <p>
        Processor processes Personal Data solely to provide {PRODUCT_NAME}: white-label patient
        pre-consult intake, modeled illustrative checkpoints, lead capture, scheduling-link
        handoff, and the related analytics and support necessary to operate the service.
        Processing continues for the term of the Order Form and the limited retention windows in
        Section 8.
      </p>

      <h2>3. Categories of data subjects and data</h2>
      <ul>
        <li>
          <strong>Data subjects</strong>: end users of Controller&apos;s branded intake (typically
          prospective patients), and Controller-side staff who administer the dashboard.
        </li>
        <li>
          <strong>Personal Data categories</strong>: identifiers (name, email, phone), self-reported
          health context (current weight, goal weight, urgency, prior GLP-1 experience), interaction
          metadata (timestamps, device class, page referrer, anonymized IP per Section 6), and
          UTM/source attribution.
        </li>
        <li>
          <strong>No special-category data is solicited</strong> beyond the limited self-reported
          weight-loss context above. Free-text fields are limited to a single message field with a
          length cap; Controller is responsible for not collecting other special categories there.
        </li>
      </ul>

      <h2>4. Controller and Processor obligations</h2>
      <h3>Controller</h3>
      <ul>
        <li>Has a lawful basis under GDPR Art. 6 (and Art. 9 where applicable) for the processing.</li>
        <li>Provides clear notice to data subjects (e.g. linked Privacy Policy on the intake page).</li>
        <li>
          Configures the dashboard and any CRM integrations only for purposes consistent with the
          notice given.
        </li>
      </ul>
      <h3>Processor</h3>
      <ul>
        <li>Processes Personal Data only on documented Controller instructions (this DPA, the Order Form, and reasonable in-product configuration).</li>
        <li>Ensures persons authorized to process Personal Data are bound by confidentiality.</li>
        <li>Implements the technical and organizational measures described in Section 5.</li>
        <li>Assists the Controller with data-subject requests, DPIAs (GDPR Art. 35), and breach response (Section 7).</li>
        <li>
          Does <strong>not</strong> sell or &quot;share&quot; Personal Data within the meaning of
          CPRA § 1798.140; acts as a CPRA &quot;service provider&quot; only.
        </li>
      </ul>

      <h2>5. Security measures (TOMs)</h2>
      <p>
        Processor maintains the following minimum technical and organizational measures, tracking
        ISO/IEC 27001:2022 Annex A and SOC 2 Trust Services Criteria:
      </p>
      <ul>
        <li>Encryption in transit (TLS 1.2+) and at rest (AES-256) for all stored Personal Data.</li>
        <li>Role-based access control with least-privilege defaults; production access is reviewed quarterly.</li>
        <li>Cloud workload isolation, network segmentation, and managed secrets (no plaintext credentials in source).</li>
        <li>Centralized audit logging of administrative actions with 90-day retention minimum.</li>
        <li>Continuous dependency vulnerability scanning and a documented patching SLA (critical &lt;72h).</li>
        <li>Annual third-party penetration test and remediation.</li>
        <li>Mandatory security and privacy training for all staff with production access.</li>
        <li>Secure SDLC: peer-reviewed code, automated tests, pre-deploy checks.</li>
      </ul>
      <p>
        A current summary of subprocessors and security posture is available in our{" "}
        <a href="/security">Security overview</a>.
      </p>

      <h2>6. International transfers</h2>
      <p>
        Personal Data may be processed in the United States and in other countries where Processor
        or its sub-processors operate. Where Personal Data of EU/EEA, UK, or Swiss data subjects is
        transferred to a country without an adequacy decision, the EU Standard Contractual Clauses
        (2021/914, Module 2) and the UK ICO IDTA apply, together with the supplementary measures
        documented in Section 5.
      </p>

      <h2>7. Personal-data breach notification</h2>
      <p>
        On becoming aware of a Personal Data breach, Processor will notify Controller without undue
        delay and in any event within <strong>72 hours</strong>, providing all information
        reasonably available to enable Controller&apos;s notification obligations under GDPR Art.
        33–34, applicable US state breach laws, and (where relevant) HIPAA Breach Notification Rule
        (45 CFR § 164.400 et seq.). Notification will include nature of the breach, categories and
        approximate number of data subjects affected, likely consequences, and remediation steps.
      </p>

      <h2>8. Retention and deletion</h2>
      <ul>
        <li>Lead and intake records: retained for the term of the Order Form plus 30 days, then deleted, unless Controller exports earlier.</li>
        <li>Account, billing, and audit logs: retained for the duration required by Stripe and applicable financial / SOC 2 audit obligations.</li>
        <li>Backups: rolling 30-day window with point-in-time recovery; deletions propagate within that window.</li>
      </ul>
      <p>
        On termination, Processor will, at Controller&apos;s election, return or delete Personal
        Data within 30 days, except where retention is required by law.
      </p>

      <h2>9. Sub-processors</h2>
      <p>
        Processor maintains a current list of approved sub-processors, including (illustratively):
        cloud hosting (Vercel / AWS), payments (Stripe), transactional email (Postmark or Resend),
        and error reporting (Sentry). Processor binds each sub-processor in writing to data
        protection obligations no less protective than this DPA. Controller is given at least 30
        days&apos; advance notice of new sub-processors and may object on reasonable data
        protection grounds.
      </p>

      <h2>10. Data subject rights and audits</h2>
      <p>
        Processor will assist Controller, taking into account the nature of processing, in fulfilling
        Controller&apos;s obligations to respond to data-subject requests (access, rectification,
        erasure, restriction, portability, objection). Processor will make available, on reasonable
        request and not more than once per calendar year, current SOC 2 / ISO 27001 attestations
        and information necessary to demonstrate compliance with this DPA. On-site audits are
        limited to a regulator-led audit or a documented serious incident.
      </p>

      <h2>11. Liability and order of precedence</h2>
      <p>
        Liability is governed by the limitations set out in the Order Form and Terms of Service. In
        case of conflict between this DPA, the Standard Contractual Clauses, the UK IDTA, the BAA
        (if executed), and the Order Form, the order of precedence is: SCCs / IDTA, BAA, this DPA,
        Order Form, Terms of Service.
      </p>

      <h2>12. Contact</h2>
      <p>
        Data protection inquiries and exercise of data subject rights:{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Postal: {PARENT_COMPANY_LEGAL_NAME},
        1700 Northside Drive, Suite A7 #5164, Atlanta, GA 30318, USA.
      </p>
    </MarketingLegalShell>
  );
}

export default function DPAPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-slate-50" aria-label="Loading" />}>
      <DPAContent />
    </Suspense>
  );
}
