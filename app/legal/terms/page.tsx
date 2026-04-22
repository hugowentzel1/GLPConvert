"use client";

import { Suspense } from "react";
import MarketingLegalShell from "@/components/legal/MarketingLegalShell";
import { PARENT_COMPANY_LEGAL_NAME, PRODUCT_NAME, SUPPORT_EMAIL } from "@/lib/product-identity";

function TermsContent() {
  const updated = new Date().toLocaleDateString("en-US", { dateStyle: "long" });
  return (
    <MarketingLegalShell
      title="Terms of Service"
      lastUpdated={updated}
      lead={
        <>
          These Terms govern access to <strong>{PRODUCT_NAME}</strong>, a software product of{" "}
          <strong>{PARENT_COMPANY_LEGAL_NAME}</strong> (&ldquo;we,&rdquo; &ldquo;us&rdquo;). By using the site or
          subscribing to the service, you agree to these Terms and to our{" "}
          <strong>Privacy Policy</strong> (as updated from time to time).
        </>
      }
    >
      <h2>1. What {PRODUCT_NAME} is (and is not)</h2>
      <p>
        {PRODUCT_NAME} is a <strong>configuration-driven intake, education, and handoff layer</strong> for clinics and
        programs that offer medical weight management and related services (including, where allowed, GLP-1 programs). The
        software can present structured questions, <strong>non-binding educational ranges and illustrations</strong>,
        and route the prospect to a <strong>booking or scheduling experience you configure</strong> (e.g. a calendar
        link, a scheduling vendor, or your call center). We may provide webhooks, exports, and dashboard views so your
        team can work leads in your CRM or operations tools.
      </p>
      <p>
        {PRODUCT_NAME} is <strong>not</strong> a medical device, electronic health record, telemedicine platform,
        prescribing system, or clinical decision support system for diagnosis or treatment. We do <strong>not</strong>{" "}
        practice medicine, determine medical necessity, or verify eligibility for medications.{" "}
        <strong>Licensed clinicians at your organization</strong> (or your designated providers) are solely responsible
        for patient care, consent, prescribing, and compliance with healthcare laws that apply to you.
      </p>

      <h2>2. Who you are (accounts)</h2>
      <p>
        If you create an account or check out, you represent that you are at least 18 and that the information you
        supply is accurate. If you are accepting on behalf of a company, you represent you have authority to bind that
        organization. We may verify email, company identity, and payment method. You are responsible for safeguarding
        credentials and for all activity on your account until you notify us of a breach.
      </p>

      <h2>3. Acceptable use</h2>
      <ul>
        <li>Do not probe, attack, or reverse engineer the service; do not use it to build a competing product.</li>
        <li>Do not upload malware, or content that is unlawful, defamatory, or infringes others&rsquo; rights.</li>
        <li>
          Do not use the service to make <strong>deceptive or unsubstantiated health claims</strong> — your marketing
          and clinical teams remain responsible for FTC, state, and professional advertising requirements.
        </li>
        <li>Respect our rate limits, API terms, and any technical documentation we publish.</li>
      </ul>

      <h2>4. Clinic and partner obligations (B2B)</h2>
      <p>
        <strong>Branding and disclosures.</strong> You are responsible for all patient-facing and prospect-facing
        copy on your white-label or embedded experiences, including pricing disclosures, availability, and program
        descriptions, except where we supply non-editable legal boilerplate and you do not change it. You will obtain
        any necessary consents for SMS, email, and recording, and comply with TCPA, CAN-SPAM, CASL, and similar rules as
        applicable to your use case.
      </p>
      <p>
        <strong>Data roles.</strong> Depending on your deployment, you may act as a <strong>business associate</strong>{" "}
        or <strong>controller</strong> under HIPAA and analogous laws, and you must execute appropriate agreements with
        us and subprocessors as required. Where we process personal data on your instructions, you will not instruct us
        to process data in violation of law.
      </p>
      <p>
        <strong>Suspension.</strong> We may suspend or limit access for non-payment, for risk to the platform or other
        customers, or to comply with law, after notice where practicable.
      </p>

      <h2>5. Fees, taxes, and payment processing</h2>
      <p>
        Subscription and setup fees are those shown at checkout, in an order form, or in your self-serve plan. We use
        third-party payment processors (e.g. Stripe). <strong>Taxes</strong> are your responsibility unless we
        collect them as required. Unless otherwise stated in writing, fees are non-refundable except as required by law
        or as expressly offered on our public site (e.g. a stated money-back or setup-fee window). Chargebacks and
        invalid disputes may result in account closure and recovery of costs where permitted.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        {PARENT_COMPANY_LEGAL_NAME} and its licensors own {PRODUCT_NAME}, the application code, and our templates and
        documentation. We grant you a <strong>non-exclusive, non-transferable</strong> right to use the service during
        your subscription, subject to these Terms. You retain your trademarks, copy, and any media you provide. We may
        use de-identified, aggregated data to improve the product and to generate benchmarks that do not identify you.
      </p>

      <h2>7. Warranties and disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED <strong>“AS IS”</strong> AND <strong>“AS AVAILABLE.”</strong> TO THE FULLEST EXTENT
        PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A
        PARTICULAR PURPOSE, AND NON-INFRINGEMENT. Any timelines, example outcomes, or charts in the product are{" "}
        <strong>illustrative</strong> only; individual clinical and business results vary. We do not warrant that
        third-party booking tools, dialers, or EMRs you integrate with will be uninterrupted.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL {PARENT_COMPANY_LEGAL_NAME} OR ITS SUPPLIERS BE LIABLE
        FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE,
        DATA, OR GOODWILL. OUR <strong>AGGREGATE</strong> LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THE
        SERVICE IN ANY TWELVE-MONTH PERIOD IS LIMITED TO THE <strong>GREATER OF (A) FEES PAID TO US</strong> FOR THE
        SERVICE IN THAT PERIOD OR <strong>(B) US $100</strong>, EXCEPT WHERE PROHIBITED. SOME JURISDICTIONS DO NOT ALLOW
        CERTAIN LIMITATIONS; IN THOSE CASES OUR LIABILITY IS LIMITED TO THE MAXIMUM EXTENT ALLOWED.
      </p>

      <h2>9. Indemnity</h2>
      <p>
        You will defend and indemnify {PARENT_COMPANY_LEGAL_NAME} and its affiliates, officers, and employees against
        third-party claims, damages, and costs (including reasonable attorneys&rsquo; fees) arising from your content,
        your violation of these Terms, or your violation of law—except to the extent caused by our gross negligence or
        willful misconduct.
      </p>

      <h2>10. Term and termination</h2>
      <p>
        You may stop using the service and cancel per your plan&rsquo;s terms. We may terminate for breach, non-payment
        after notice, or if continuing would expose us to liability. Provisions that by nature survive (fees owed,
        disclaimers, limits, governing law) survive termination. Export of your configuration may be available for a
        limited window after cancellation as described in your order or our documentation.
      </p>

      <h2>11. Governing law and venue</h2>
      <p>
        These Terms are governed by the laws of the <strong>State of Delaware, USA</strong>, without regard to
        conflict-of-law rules, except where consumer protection law in your jurisdiction cannot be waived. Subject to
        applicable mandatory rules, the state and federal courts in Delaware have exclusive jurisdiction.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update these Terms by posting a new version and updating the &ldquo;Last updated&rdquo; date. If changes
        are material, we will provide additional notice (e.g. email or in-app banner). Continued use after the effective
        date constitutes acceptance. If you do not agree, you must stop using the service before the change takes
        effect.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions:{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-slate-900 underline decoration-slate-300">
          {SUPPORT_EMAIL}
        </a>
        <br />
        {PARENT_COMPANY_LEGAL_NAME} · 1700 Northside Drive Suite A7 #5164, Atlanta, GA 30318, USA
      </p>
      <p className="text-sm text-slate-500 not-prose">
        <em>Summary for readability only. This is not legal advice; have counsel review for your use case.</em>
      </p>
    </MarketingLegalShell>
  );
}

export default function TermsPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] bg-slate-50" />}>
      <TermsContent />
    </Suspense>
  );
}
