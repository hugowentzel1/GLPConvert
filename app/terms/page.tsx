"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BrandedDemoOrDefaultFooter from "@/components/intake/BrandedDemoOrDefaultFooter";
import {
  buildBrandedDemoReturnHref,
  buildMarketingPathHref,
} from "@/lib/glp-intake-nav-href";
import { PRODUCT_NAME, SUPPORT_EMAIL } from "@/lib/product-identity";

/**
 * Short-form Terms of Service summary. The canonical, fully-detailed Terms live at
 * `/legal/terms` (uses `MarketingLegalShell`); this `/terms` URL is preserved for inbound and
 * legacy links and links out to the long form.
 */
function TermsContent() {
  const searchParams = useSearchParams();
  const homeHref = buildBrandedDemoReturnHref(searchParams);
  const refundHref = buildMarketingPathHref(searchParams, "/legal/refund");
  const longFormHref = buildMarketingPathHref(searchParams, "/legal/terms");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href={homeHref}
            className="inline-flex items-center text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg">
          <h1 className="text-4xl font-black text-gray-900 mb-4 text-center">Terms of Service</h1>
          <p className="text-center text-sm text-slate-500 mb-8">
            Plain-language summary. The full agreement is at{" "}
            <Link href={longFormHref} className="font-medium text-slate-800 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-500">
              /legal/terms
            </Link>
            .
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-14">
              <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">1. Acceptance of Terms</h2>
              <p className="mb-5 text-[15px] leading-relaxed text-slate-600 sm:text-base">
                By accessing and using {PRODUCT_NAME}, you accept and agree to be bound by these
                Terms and the canonical{" "}
                <Link href={longFormHref} className="text-[var(--brand-primary)] hover:underline">
                  long-form Terms of Service
                </Link>
                .
              </p>
            </section>

            <section className="mb-14">
              <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">2. Description of Service</h2>
              <p className="mb-5 text-[15px] leading-relaxed text-slate-600 sm:text-base">
                {PRODUCT_NAME} provides intake, recommendation, and booking-conversion software
                for clinics. It is <strong>not</strong> an EMR, telehealth platform, or
                prescribing software. Licensed clinicians at the operating clinic make all
                treatment decisions.
              </p>
            </section>

            <section className="mb-14">
              <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">3. Accounts</h2>
              <p className="mb-5 text-[15px] leading-relaxed text-slate-600 sm:text-base">
                You are responsible for maintaining the confidentiality of your account
                credentials and for all activity under your account. Notify us immediately of any
                unauthorized use.
              </p>
            </section>

            <section className="mb-14">
              <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">4. Acceptable Use</h2>
              <p className="mb-5 text-[15px] leading-relaxed text-slate-600 sm:text-base">
                Do not use the service for unlawful purposes, to overburden infrastructure, or to
                make deceptive or unsubstantiated health claims.
              </p>
            </section>

            <section className="mb-14">
              <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">5. Payment Terms</h2>
              <p className="mb-5 text-[15px] leading-relaxed text-slate-600 sm:text-base">
                {PRODUCT_NAME} bills monthly with a one-time setup fee. Subscription fees are
                cancel-anytime and non-refundable except where required by law. Pricing changes
                are announced 30 days in advance.
              </p>
            </section>

            <section className="mb-14">
              <h2 id="refunds" className="mb-5 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">6. Refunds &amp; Guarantee</h2>
              <p className="mb-5 text-[15px] leading-relaxed text-slate-600 sm:text-base" id="guarantee">
                We guarantee your branded deployment goes live within 24 hours of purchase. If
                onboarding is not initiated as promised, you may request a{" "}
                <Link href={refundHref} className="text-[var(--brand-primary)] hover:underline">
                  refund of the one-time setup fee
                </Link>{" "}
                within 7 days by emailing <strong>{SUPPORT_EMAIL}</strong>.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-600 sm:text-base">
                For full refund details, see our{" "}
                <Link href={refundHref} className="text-[var(--brand-primary)] hover:underline">
                  Refund Policy
                </Link>
                .
              </p>
            </section>

            <section className="mb-14">
              <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">7. Data &amp; Privacy</h2>
              <p className="mb-5 text-[15px] leading-relaxed text-slate-600 sm:text-base">
                Your data is protected by our Privacy Policy and security measures. We use
                industry-standard encryption and maintain HIPAA-aware controls for clinic
                customers. You retain ownership of your data.
              </p>
            </section>

            <section className="mb-14">
              <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">8. Intellectual Property &amp; Clinical Scope</h2>
              <p className="mb-5 text-[15px] leading-relaxed text-slate-600 sm:text-base">
                The service and its original content, features, and functionality are owned by
                Wellspire LLC. {PRODUCT_NAME} does not provide medical advice, diagnosis, dosing
                decisions, or eligibility determinations.
              </p>
            </section>

            <section className="mb-14">
              <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">9. Limitation of Liability</h2>
              <p className="mb-5 text-[15px] leading-relaxed text-slate-600 sm:text-base">
                To the maximum extent permitted by law, Wellspire LLC is not liable for indirect,
                incidental, special, consequential, or punitive damages.
              </p>
            </section>

            <section className="mb-14">
              <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">10. Termination</h2>
              <p className="mb-5 text-[15px] leading-relaxed text-slate-600 sm:text-base">
                You may cancel your account at any time. We may suspend or terminate accounts for
                breach, non-payment, or risk to the platform.
              </p>
            </section>

            <section className="mb-14">
              <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">11. Changes</h2>
              <p className="mb-5 text-[15px] leading-relaxed text-slate-600 sm:text-base">
                We will provide at least 30 days&apos; notice of material changes via in-product
                banner or email.
              </p>
            </section>

            <section className="mb-14">
              <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">12. Contact</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Support:</strong>{" "}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:underline">
                    {SUPPORT_EMAIL}
                  </a>
                  <br />
                  <strong>Address:</strong> Wellspire LLC · 1700 Northside Drive, Suite A7 #5164,
                  Atlanta, GA 30318, USA
                </p>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                For the full agreement, see{" "}
                <Link href={longFormHref} className="text-[var(--brand-primary)] hover:underline">
                  /legal/terms
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <BrandedDemoOrDefaultFooter />
    </div>
  );
}

export default function TermsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" aria-label="Loading" />}>
      <TermsContent />
    </Suspense>
  );
}
