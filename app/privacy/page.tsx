"use client";

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';
import { PRODUCT_NAME, SUPPORT_EMAIL } from '@/lib/product-identity';

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                {PRODUCT_NAME} (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard information in our intake and booking software.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Information You Provide Directly</h3>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, such as when you create an account, complete intake questions, request a consult, or contact support. This may include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li className="text-[var(--brand-primary)]">Name and contact information (email, phone, address)</li>
                <li className="text-[var(--brand-primary)]">Structured intake answers for educational recommendations</li>
                <li className="text-[var(--brand-primary)]">Clinic/company configuration details</li>
                <li className="text-[var(--brand-primary)]">Payment and billing information</li>
                <li className="text-[var(--brand-primary)]">Communications with our support team</li>
                <li className="text-[var(--brand-primary)]">Account preferences and settings</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Information We Collect Automatically</h3>
              <p className="text-gray-600 mb-4">
                When you use our service, we automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li className="text-[var(--brand-primary)]">Usage data (pages visited, features used, time spent)</li>
                <li className="text-[var(--brand-primary)]">Device information (IP address, browser type, operating system)</li>
                <li className="text-[var(--brand-primary)]">Location/IP data for security and anti-abuse controls</li>
                <li className="text-[var(--brand-primary)]">Cookies and similar tracking technologies</li>
                <li className="text-[var(--brand-primary)]">Log files and analytics data</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Third-Party Data Sources</h3>
              <p className="text-gray-600 mb-4">
                We may obtain information from third-party services to operate the platform, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li className="text-[var(--brand-primary)]">Stripe for billing workflows</li>
                <li className="text-[var(--brand-primary)]">Supabase for data storage/access controls</li>
                <li className="text-[var(--brand-primary)]">Resend/SMTP for transactional email</li>
                <li className="text-[var(--brand-primary)]">Optional map/geocoding services if enabled</li>
              </ul>
            </section>
              
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li className="text-[var(--brand-primary)]">Provide and maintain our services</li>
                <li className="text-[var(--brand-primary)]">Process transactions and send related information</li>
                <li className="text-[var(--brand-primary)]">Send technical notices and support messages</li>
                <li className="text-[var(--brand-primary)]">Respond to your comments and questions</li>
                <li className="text-[var(--brand-primary)]">Improve our services and develop new features</li>
              </ul>
            </section>
              
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
              </p>
            </section>
              
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>
              
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the right to access, correct, or delete your personal information. You may also opt out of certain communications from us.
              </p>
            </section>
              
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Marketing emails: legal bases & your rights</h2>
              <p className="text-gray-600 mb-4"><strong>US (CAN-SPAM):</strong> We identify {PRODUCT_NAME}, include our postal address, and provide a functional unsubscribe where applicable.</p>
              <p className="text-gray-600 mb-4"><strong>Canada (CASL):</strong> Our emails include our identity, mailing address, and a functional unsubscribe. We honor unsubscribes within 10 business days (typically immediately).</p>
              <p className="text-gray-600 mb-4"><strong>EU/UK (GDPR & ePrivacy):</strong> For B2B outreach we may rely on <em>legitimate interests</em>. You can object to marketing at any time via unsubscribe links or by emailing <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:underline">{SUPPORT_EMAIL}</a>.</p>
              <p className="text-gray-600 mb-4"><strong>Your EU/UK rights:</strong> access, rectification, erasure, restriction, portability, and <em>objection to direct marketing</em>. To exercise these rights, email <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:underline">{SUPPORT_EMAIL}</a>.</p>
              <p className="text-gray-600 mb-4">We maintain a suppression list to ensure we do not email you again after you unsubscribe.</p>
            </section>
              
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Support:</strong> <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:underline">{SUPPORT_EMAIL}</a><br/>
                  <strong>Billing:</strong> <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:underline">{SUPPORT_EMAIL}</a><br/>
                  <strong>Address:</strong> 1700 Northside Drive Suite A7 #5164 Atlanta, GA 30318
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
