"use client";

import Footer from "@/components/Footer";
import PaidFooter from "@/components/PaidFooter";
import { useIsDemo } from "@/src/lib/isDemo";
import { useSearchParams } from "next/navigation";
import {
  PARENT_COMPANY_LEGAL_NAME,
  PRODUCT_NAME,
  SUPPORT_EMAIL,
} from "@/lib/product-identity";

export default function TermsPage() {
  const isDemo = useIsDemo();
  const searchParams = useSearchParams();
  const demo = searchParams?.get("demo");
  const backHref =
    demo === "1" || demo === "true"
      ? `/?${searchParams?.toString() ?? ""}`
      : `/paid?${searchParams?.toString() ?? ""}`;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/80">
      <main className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10">
            <a
              href={backHref}
              className="inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </a>
          </div>

          <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Terms of Service
          </h1>
          <p className="mb-10 text-sm text-slate-500">
            Last updated: {new Date().toLocaleDateString("en-US", { dateStyle: "long" })}
          </p>

          <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-slate-600 prose-li:text-slate-600">
            <p className="lead text-lg text-slate-700">
              These Terms govern access to <strong>{PRODUCT_NAME}</strong>, operated by{" "}
              <strong>{PARENT_COMPANY_LEGAL_NAME}</strong>. By using the service, you agree to these Terms and our
              Privacy Policy.
            </p>

            <h2>What the service is</h2>
            <p>
              {PRODUCT_NAME} provides a <strong>white-label, pre-consult education and conversion layer</strong> for
              licensed weight-management and GLP-1 program providers. Outputs are <strong>general information only</strong>{" "}
              and <strong>not medical advice</strong>. The service is{" "}
              <strong>not</strong> an EMR, telehealth platform, prescribing system, or clinical decision tool. Treatment
              decisions belong solely to the patient’s licensed provider.
            </p>

            <h2>Accounts and acceptable use</h2>
            <ul>
              <li>Provide accurate information where requested.</li>
              <li>Do not misuse the service, probe for vulnerabilities, or interfere with other users.</li>
              <li>Do not use the service in violation of applicable law or third-party rights.</li>
            </ul>

            <h2>Clinic customers (B2B)</h2>
            <p>
              If you subscribe on behalf of a practice, you represent that you have authority to bind that organization.
              You are responsible for configuring branding, pricing disclosures, booking links, and compliance with
              your own regulatory obligations. We may suspend service for non-payment or material breach.
            </p>

            <h2>Fees and billing</h2>
            <p>
              Subscription and setup fees are described at checkout or in your order. Payments are processed by our
              payment processor. Unless otherwise stated, fees are non-refundable except as required by law or as
              expressly offered in writing (e.g. setup-fee refund policies marketed on our site).
            </p>

            <h2>Intellectual property</h2>
            <p>
              {PARENT_COMPANY_LEGAL_NAME} retains rights in {PRODUCT_NAME}, its software, and branding (excluding your
              trademarks and content you supply). We grant you a limited license to use the service according to your
              subscription.
            </p>

            <h2>Disclaimers</h2>
            <p>
              THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM
              WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. EDUCATIONAL
              ESTIMATES AND TIMELINES ARE ILLUSTRATIVE; <strong>INDIVIDUAL RESULTS VARY</strong>.{" "}
              <strong>ACTUAL PRICING MAY VARY</strong> BASED ON PROVIDER EVALUATION AND PROGRAM SELECTION.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER {PARENT_COMPANY_LEGAL_NAME} NOR ITS SUPPLIERS WILL BE LIABLE
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, OR FOR LOST PROFITS OR
              REVENUE. OUR AGGREGATE LIABILITY FOR CLAIMS ARISING OUT OF THE SERVICE IN ANY TWELVE-MONTH PERIOD IS
              LIMITED TO THE GREATER OF (A) AMOUNTS YOU PAID US FOR THE SERVICE IN THAT PERIOD OR (B) ONE HUNDRED U.S.
              DOLLARS, EXCEPT WHERE PROHIBITED BY LAW.
            </p>

            <h2>Indemnity</h2>
            <p>
              You will defend and indemnify us against claims arising from your misuse of the service, your content, or
              your violation of these Terms, except to the extent caused by our gross negligence or willful misconduct.
            </p>

            <h2>Termination</h2>
            <p>
              You may stop using the service at any time. We may suspend or terminate access for breach, risk, or legal
              requirements. Provisions that by their nature should survive will survive termination.
            </p>

            <h2>Governing law</h2>
            <p>
              These Terms are governed by the laws of the State of Delaware, USA, excluding conflict-of-law rules, unless
              mandatory consumer protections in your jurisdiction require otherwise.
            </p>

            <h2>Contact</h2>
            <p>
              Questions:{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-slate-900 underline decoration-slate-300">
                {SUPPORT_EMAIL}
              </a>
              .
            </p>

            <p className="text-sm text-slate-500">
              <em>Summary for readability only; not legal advice. Have counsel review before relying in regulated
                contexts.</em>
            </p>
          </div>
        </div>
      </main>
      {isDemo ? <Footer /> : <PaidFooter />}
    </div>
  );
}
