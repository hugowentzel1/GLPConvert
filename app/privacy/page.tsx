"use client";

import Link from "next/link";
import MarketingLegalShell from "@/components/legal/MarketingLegalShell";
import { buildMarketingPathHref } from "@/lib/glp-intake-nav-href";
import { PARENT_COMPANY_LEGAL_NAME, PRODUCT_NAME, SUPPORT_EMAIL } from "@/lib/product-identity";
import { useSearchParams } from "next/navigation";

export default function PrivacyPage() {
  const searchParams = useSearchParams();
  const updated = new Date().toLocaleDateString("en-US", { dateStyle: "long" });
  return (
    <MarketingLegalShell
      title="Privacy Policy"
      lastUpdated={updated}
      lead={
        <>
          {PARENT_COMPANY_LEGAL_NAME} (&ldquo;we,&rdquo; &ldquo;us&rdquo;) operates {PRODUCT_NAME}, a
          business-to-business and business-to-consumer facing conversion layer for medical weight-care programs. This
          policy describes how we collect, use, share, and retain personal information, and the choices you have. If you
          are a <strong>patient or prospect</strong>, your clinic&rsquo;s own notice may also apply when they are the
          controller of your data.
        </>
      }
    >
      <h2>1. Scope and roles</h2>
      <p>
        {PRODUCT_NAME} is used by clinics, marketing teams, and partners to run branded intake experiences. Depending on
        your contract and configuration, we may process:
      </p>
      <ul>
        <li>
          <strong>Account and billing data</strong> for our customers (B2B users who pay for the platform);
        </li>
        <li>
          <strong>Intake and lead data</strong> for prospects and patients that your team directs through our
          funnels; and
        </li>
        <li>
          <strong>Technical and analytics data</strong> to operate, secure, and improve the service.
        </li>
      </ul>
      <p>
        Where the clinic (or you, as a covered entity) determines the <strong>purposes and means</strong> of processing
        health information, that organization may be the <strong>controller</strong> and {PRODUCT_NAME} may act as a{" "}
        <strong>processor</strong> or <strong>business associate</strong> on documented instructions, including through a
        Business Associate Agreement (BAA) when required. Where we set purposes for account administration and
        product analytics, we act as a <strong>controller</strong> for that limited scope. If you are unsure which
        policy applies, contact your provider or{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-slate-900 underline decoration-slate-300">
          {SUPPORT_EMAIL}
        </a>
        .
      </p>

      <h2>2. Information we collect</h2>
      <h3>2.1 You provide</h3>
      <ul>
        <li>Contact information (name, work email, phone) when you sign up, request a demo, or buy a plan.</li>
        <li>
          <strong>Clinic configuration</strong>: brand names, color tokens, domain hints, embed keys, and scheduling URLs
          you supply to route prospects.
        </li>
        <li>
          <strong>Intake responses</strong> (e.g. goals, self-reported history) when a prospect or patient uses a flow
          you host with us. These answers may be <strong>health-adjacent</strong>; you decide what to ask and how to use
          answers clinically.
        </li>
        <li>Free-text messages to support, feedback forms, and optional calls you schedule with us.</li>
        <li>
          <strong>Payment data</strong> is generally collected by our payment processor; we may receive limited tokens
          and subscription status, not full card numbers, depending on integration.
        </li>
      </ul>

      <h3>2.2 Collected automatically</h3>
      <ul>
        <li>Identifiers such as IP address, user agent, device type, and approximate location derived for fraud prevention.</li>
        <li>
          <strong>Usage and performance</strong>: page views, funnel steps, error logs, feature flags, and response times
          to keep the app reliable and to understand aggregate conversion behavior.
        </li>
        <li>
          <strong>Cookies and similar technologies</strong> for session, preferences, and first-party analytics, as
          described in your cookie notice where required.
        </li>
      </ul>

      <h3>2.3 From third parties</h3>
      <p>We may receive:</p>
      <ul>
        <li>Logo or firmographic enrichment from your domain, when you or we configure those integrations.</li>
        <li>Payment status and billing events from our processor.</li>
        <li>Email delivery and bounce information from our mail provider.</li>
        <li>
          Inbound webhooks you configure, when your systems send us structured events for routing or lead matching.
        </li>
      </ul>

      <h2>3. How we use information</h2>
      <ul>
        <li>
          <strong>Provide the service</strong>: host funnels, apply your branding, route leads to the endpoints you
          choose, and surface dashboards to your team.
        </li>
        <li>
          <strong>Communicate with you</strong>: onboarding, support, service announcements, and (where allowed)
          information about new features. Marketing messages for B2B contacts follow CAN-SPAM, CASL, and ePrivacy
          requirements as applicable.
        </li>
        <li>
          <strong>Security and abuse prevention</strong>: detect spam, protect accounts, enforce rate limits, and meet
          legal obligations.
        </li>
        <li>
          <strong>Analytics and improvement</strong>: aggregate or de-identified statistics on funnel performance, device
          mix, and drop-off, without selling personal information as a data broker would.
        </li>
        <li>
          <strong>Legal compliance</strong>: respond to lawful requests, enforce our terms, and protect rights and
          safety.
        </li>
      </ul>

      <h2>4. How we share information</h2>
      <p>We do not sell personal information in the traditional &ldquo;data broker&rdquo; sense. We disclose:</p>
      <ul>
        <li>
          <strong>Service providers</strong> (subprocessors) who host, secure, process payments, send email, and provide
          observability, under contract and appropriate safeguards.
        </li>
        <li>
          <strong>Your clinic and tools you connect</strong>, when you use webhooks, CRM sync, or manual export—per your
          configuration.
        </li>
        <li>
          <strong>Professional advisors</strong> (lawyers, accountants) under confidentiality.
        </li>
        <li>
          <strong>Authorities</strong> when required by law or to protect the vital interests of a person, where
          applicable.
        </li>
        <li>
          <strong>Business transfers</strong> in a merger, acquisition, or sale of assets, with notice where required and
          contracts that protect your data.
        </li>
      </ul>

      <h2>5. Subprocessors and infrastructure (examples)</h2>
      <p>
        Our stack may include infrastructure, database, and payment vendors (e.g. cloud hosting, email delivery, Stripe
        for checkout). A current list is available on request to active subscribers and in our DPA. We require
        appropriate technical and organizational measures, including for international transfers (e.g. Standard
        Contractual Clauses where applicable).
      </p>

      <h2>6. Retention</h2>
      <p>
        We keep account and subscription records for as long as your relationship is active and for a period afterward
        to resolve disputes, enforce terms, and meet tax and accounting law. Intake/lead data retention follows your
        plan settings and the instructions in your data processing addendum, subject to our backup and legal hold
        practices. You may request deletion of certain data where law allows; we will respond within the timelines
        required in your region.
      </p>

      <h2>7. Security</h2>
      <p>
        We use industry-standard technical and administrative safeguards: encryption in transit, access control, logging,
        and least-privilege access for employees. No method of transmission is 100% secure; you should protect your
        account credentials and use SSO where offered.
      </p>

      <h2>8. Your rights and choices (regional)</h2>
      <p>
        Depending on your location, you may have rights to access, correct, delete, port, or restrict processing of your
        personal data, and to object to direct marketing. In the <strong>EEA/UK</strong>, you may contact your
        supervisory authority. In the <strong>US</strong>, state privacy laws (including California) may provide
        additional rights. Submit requests to{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-slate-900 underline decoration-slate-300">
          {SUPPORT_EMAIL}
        </a>
        ; we will verify your identity and respond as required. We do not discriminate against you for exercising
        privacy rights.
      </p>
      <p>
        <strong>Marketing</strong> — you may unsubscribe from promotional emails at any time. Transactional and
        service-related messages may continue. See our{" "}
        <Link
          href={buildMarketingPathHref(searchParams, "/legal/terms")}
          className="text-slate-900 underline decoration-slate-300"
        >
          Terms
        </Link>{" "}
        for B2B outreach legal bases in the EU/UK.
      </p>

      <h2>9. International transfers</h2>
      <p>
        {PARENT_COMPANY_LEGAL_NAME} is U.S.-based. If you access the service from other countries, you understand that
        data may be processed in the United States and other regions where we or subprocessors operate. We implement
        appropriate safeguards for cross-border transfers.
      </p>

      <h2>10. Children</h2>
      <p>
        The service is not directed to children under 13 (or 16 where higher age applies). We do not knowingly collect
        personal information from children. If you believe we have, contact us to delete.
      </p>

      <h2>11. Regulatory, industry, and vendor context (educational)</h2>
      <p>
        {PRODUCT_NAME} is used in regulated health-adjacent workflows. We publish this section so clinics, compliance
        teams, and patients can place our processing in context. It is <strong>not</strong> legal advice and does not
        change who is responsible for HIPAA, state privacy, or advertising law in your deployment.
      </p>
      <h3>11.1 United States — health and consumer protection</h3>
      <ul>
        <li>
          <strong>HIPAA</strong> — the U.S. Department of Health and Human Services publishes the{" "}
          <a
            href="https://www.hhs.gov/hipaa/index.html"
            className="text-slate-900 underline decoration-slate-300"
            target="_blank"
            rel="noreferrer"
          >
            HIPAA hub
          </a>{" "}
          (Security Rule, Privacy Rule, Breach Notification). Business associate relationships are documented in a BAA
          when we process PHI on behalf of a covered entity or business associate customer.
        </li>
        <li>
          <strong>FTC</strong> — the{" "}
          <a
            href="https://www.ftc.gov/business-guidance/resources/health-products-compliance"
            className="text-slate-900 underline decoration-slate-300"
            target="_blank"
            rel="noreferrer"
          >
            Health products compliance business guidance
          </a>{" "}
          summarizes truth-in-advertising expectations for health claims. Your marketing and clinical teams remain
          responsible for substantiation.
        </li>
        <li>
          <strong>FDA</strong> — drug promotion is overseen by the{" "}
          <a
            href="https://www.fda.gov/drugs"
            className="text-slate-900 underline decoration-slate-300"
            target="_blank"
            rel="noreferrer"
          >
            FDA
          </a>
          ; {PRODUCT_NAME} does not promote specific drug products in software unless you configure copy that you have
          cleared.
        </li>
      </ul>
      <h3>11.2 European Union and United Kingdom</h3>
      <p>
        Where GDPR or UK GDPR applies, we support data processing agreements, records of processing, and appropriate
        transfer mechanisms. The{" "}
        <a
          href="https://commission.europa.eu/law/law-topic/data-protection_en"
          className="text-slate-900 underline decoration-slate-300"
          target="_blank"
          rel="noreferrer"
        >
          European Commission data protection portal
        </a>{" "}
        and the{" "}
        <a href="https://ico.org.uk/" className="text-slate-900 underline decoration-slate-300" target="_blank" rel="noreferrer">
          UK ICO
        </a>{" "}
        publish guidance for controllers and processors.
      </p>
      <h3>11.3 Payments, infrastructure, and common B2B SaaS practices</h3>
      <ul>
        <li>
          <strong>Stripe</strong> — subscription checkout and card data are typically handled by Stripe; see{" "}
          <a
            href="https://stripe.com/privacy"
            className="text-slate-900 underline decoration-slate-300"
            target="_blank"
            rel="noreferrer"
          >
            Stripe&apos;s privacy policy
          </a>{" "}
          and{" "}
          <a
            href="https://stripe.com/legal/dpa"
            className="text-slate-900 underline decoration-slate-300"
            target="_blank"
            rel="noreferrer"
          >
            Data Processing Agreement
          </a>{" "}
          for how they process payment data as a processor.
        </li>
        <li>
          <strong>Security baselines</strong> — many enterprises ask vendors to map controls to{" "}
          <a
            href="https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final"
            className="text-slate-900 underline decoration-slate-300"
            target="_blank"
            rel="noreferrer"
          >
            NIST SP 800-53
          </a>{" "}
          or pursue SOC 2 attestation; we implement defense-in-depth regardless of public marketing of a specific badge.
        </li>
        <li>
          <strong>Comparable products</strong> — buyers often evaluate scheduling and form tools (e.g. Calendly, Typeform,
          HubSpot forms) alongside specialized medical conversion layers. {PRODUCT_NAME} is purpose-built for
          pre-consult education and handoff with clinic-owned branding and booking destinations you control.
        </li>
      </ul>

      <h2>12. Contact</h2>
      <p>
        {PRODUCT_NAME} privacy inquiries:{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-slate-900 underline decoration-slate-300">
          {SUPPORT_EMAIL}
        </a>
        <br />
        {PARENT_COMPANY_LEGAL_NAME}
        <br />
        1700 Northside Drive Suite A7 #5164, Atlanta, GA 30318, USA
      </p>
      <p className="text-sm text-slate-500 not-prose">
        <em>We may update this policy; the &ldquo;Last updated&rdquo; line reflects material revisions.</em>
      </p>
    </MarketingLegalShell>
  );
}
