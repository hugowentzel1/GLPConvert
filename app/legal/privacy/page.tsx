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

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="mb-10 text-sm text-slate-500">
            Last updated: {new Date().toLocaleDateString("en-US", { dateStyle: "long" })}
          </p>

          <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-slate-600 prose-li:text-slate-600">
            <p className="lead text-lg text-slate-700">
              This policy describes how <strong>{PARENT_COMPANY_LEGAL_NAME}</strong> (“we,” “us”) collects and uses
              information when you use <strong>{PRODUCT_NAME}</strong>—a white-label, pre-consult education and intake
              layer for weight-management and GLP-1 program providers. It is not a substitute for your clinic’s own
              privacy notice where they act as an independent controller for patient data.
            </p>

            <h2>Who we are</h2>
            <p>
              {PRODUCT_NAME} is operated by {PARENT_COMPANY_LEGAL_NAME}. Contact:{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-slate-900 underline decoration-slate-300">
                {SUPPORT_EMAIL}
              </a>
              .
            </p>

            <h2>Information we may collect</h2>
            <ul>
              <li>
                <strong>Intake and simulation inputs</strong> you choose to provide (e.g. weight goals, timeframe
                preferences, non-clinical struggle selections). These may be considered health-related in some
                jurisdictions.
              </li>
              <li>
                <strong>Contact details</strong> when you submit a lead or request follow-up (name, email, optional
                phone).
              </li>
              <li>
                <strong>Technical and usage data</strong> (IP address, device/browser type, pages viewed) for security
                and product improvement.
              </li>
              <li>
                <strong>Attribution data</strong> such as UTM parameters when present, to help clinics measure
                campaigns.
              </li>
              <li>
                <strong>Payment data</strong> for subscribers is processed by our payment provider (e.g. Stripe); we do
                not store full card numbers on our servers.
              </li>
            </ul>

            <h2>How we use information</h2>
            <ul>
              <li>To operate the intake experience, generate educational outputs, and route leads to the clinic you selected.</li>
              <li>To provide support, billing, and service communications to clinic customers.</li>
              <li>To improve reliability, security, and product quality.</li>
              <li>To comply with law and enforce our terms.</li>
            </ul>

            <h2>Legal bases (where applicable)</h2>
            <p>
              Depending on region, we rely on contract performance, legitimate interests (secure operation and analytics
              that do not override your rights), and consent where required (e.g. marketing cookies or contact opt-in).
            </p>

            <h2>Sharing</h2>
            <p>
              We share data with subprocessors that help us run the service (e.g. hosting, database, email, payments).
              Clinics that license {PRODUCT_NAME} receive lead and intake data you submit to them. We do not sell your
              personal information.
            </p>

            <h2>Retention</h2>
            <p>
              We retain information as long as needed to provide the service, meet legal obligations, and resolve
              disputes. Clinic customers may have their own retention policies for leads they receive.
            </p>

            <h2>Security</h2>
            <p>
              We use encryption in transit (HTTPS), access controls, and vendor infrastructure designed for SaaS
              workloads. No method of transmission is 100% secure; we work to follow industry-accepted practices. A
              HIPAA-ready posture (including BAA coverage where required) is described in our compliance documentation
              for customers—not a substitute for your clinic’s own compliance program.
            </p>

            <h2>Your rights</h2>
            <p>
              Depending on where you live, you may have rights to access, correct, delete, or export personal data, or
              to object to certain processing. Contact us at the email above. You may also contact the clinic whose
              branded experience you used.
            </p>

            <h2>Children</h2>
            <p>
              {PRODUCT_NAME} is not directed at children under 13 (or the minimum age in your jurisdiction). Do not
              submit information if you are not old enough to consent.
            </p>

            <h2>International transfers</h2>
            <p>
              If you access the service from outside the United States, your information may be processed in the U.S. or
              other countries where we or our vendors operate.
            </p>

            <h2>Changes</h2>
            <p>
              We may update this policy from time to time. Material changes will be posted on this page with an updated
              date.
            </p>

            <p className="text-sm text-slate-500">
              <em>
                This policy is for general business communication and product transparency—not legal advice. Final
                notices for regulated health programs should be reviewed with qualified counsel.
              </em>
            </p>
          </div>
        </div>
      </main>
      {isDemo ? <Footer /> : <PaidFooter />}
    </div>
  );
}
