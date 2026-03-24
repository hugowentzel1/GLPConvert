'use client';

import { useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';

export default function RefundPolicyPage() {
  const searchParams = useSearchParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <main className="mx-auto max-w-3xl px-4 py-12">
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
          <h1 className="text-4xl font-black text-gray-900 mb-8 text-center">Refund Policy</h1>
      <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Setup-Fee Refund Guarantee</h2>
              <p className="text-gray-600 mb-4">
                We stand by our promise that your branded Sunspire site will be live on your domain within 24 hours of purchase. If your site is not live within that time, the one-time setup fee is refundable. To request a setup-fee refund, contact <a href="mailto:support@getsunspire.com" className="text-[var(--brand-primary)] hover:underline">support@getsunspire.com</a> within 7 days of purchase and include your order details.
              </p>
              <p className="text-gray-600 mb-6">
                Refunds are processed to the original payment method within 5–10 business days. Subscription fees are cancel-anytime and non-refundable, except as required by law. Refunds are not available for abuse, fraud, or violations of our Terms of Service.
              </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}