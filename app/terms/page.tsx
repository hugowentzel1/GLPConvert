"use client";

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';

export default function TermsPage() {
  const b = useBrandTakeover();
  const searchParams = useSearchParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Home Button */}
        <div className="mb-8">
          <a
            href={searchParams?.get('demo') ? `/?${searchParams?.toString()}` : `/paid?${searchParams?.toString()}`}
            className="inline-flex items-center text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg">
          <h1 className="text-4xl font-black text-gray-900 mb-8 text-center">
            Terms of Service
          </h1>

          <div className="prose prose-lg max-w-none">

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using Sunspire&apos;s solar intelligence platform, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                Sunspire provides a solar analysis platform that offers instant solar quotes, lead capture, and CRM integration services. Our platform uses industry-standard data sources including NREL PVWatts v8 and EIA utility rates.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-600 mb-4">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
              <p className="text-gray-600 mb-4">
                You agree not to use the service for any unlawful purpose or in any way that could damage, disable, overburden, or impair the service. You must not attempt to gain unauthorized access to any part of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment Terms</h2>
              <p className="text-gray-600 mb-4">
                Our service is billed on a monthly basis with a one-time setup fee. All fees are non-refundable except as provided in our refund policy. We reserve the right to change our pricing with 30 days notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 id="refunds" className="text-2xl font-bold text-gray-900 mb-4">6. Refunds & Guarantee</h2>
        <p className="text-gray-600 mb-4" id="guarantee">
          We guarantee your branded Sunspire site will be live on your domain within 24 hours of purchase. If it isn&apos;t, you may request a <a href="/legal/refund" className="text-[var(--brand-primary)] hover:underline">refund of the one-time setup fee</a> within 7 days by emailing <strong>support@getsunspire.com</strong>. Subscription fees are cancel-anytime and non-refundable, except where required by law. Chargebacks or violations of these Terms void eligibility.
        </p>
        <p className="text-gray-600">
          For complete details, see our <a href="/legal/refund" className="text-[var(--brand-primary)] hover:underline">Refund Policy</a>.
        </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data and Privacy</h2>
              <p className="text-gray-600 mb-4">
                Your data is protected by our Privacy Policy and security measures. We use industry-standard encryption and SOC 2-aligned controls to protect your information. You retain ownership of your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                The service and its original content, features, and functionality are owned by Sunspire and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Third-Party Trademarks</h3>
              <p className="text-gray-600 mb-4">
                PVWatts® is a registered trademark of the Alliance for Sustainable Energy, LLC, the operator of the National Renewable Energy Laboratory (NREL). We use PVWatts® data and modeling under NREL&apos;s terms of use. NREL and the U.S. Department of Energy do not endorse Sunspire or any of its products or services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                In no event shall Sunspire be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-600 mb-4">
                You may terminate your account at any time by contacting our support team. We may terminate or suspend your account immediately, without prior notice, for any reason whatsoever.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify or replace these terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Phone:</strong> <a href="tel:+14047702672" className="hover:underline">+1 (404) 770-2672</a><br />
                  <strong>Support:</strong> <a href="mailto:support@getsunspire.com" className="hover:underline">support@getsunspire.com</a><br />
                  <strong>Billing:</strong> <a href="mailto:billing@getsunspire.com" className="hover:underline">billing@getsunspire.com</a><br />
                  <strong>Address:</strong> 1700 Northside Drive Suite A7 #5164 Atlanta, GA 30318<br />
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
