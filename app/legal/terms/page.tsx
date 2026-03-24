'use client';

import Footer from '@/components/Footer';
import PaidFooter from '@/components/PaidFooter';
import { useIsDemo } from '@/src/lib/isDemo';
import { useSearchParams } from 'next/navigation';

export default function TermsPage() {
  const isDemo = useIsDemo();
  const searchParams = useSearchParams();
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
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
          <h1 className="text-4xl font-bold mb-6 text-center md:text-left">Terms of Service</h1>
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              These Terms of Service govern your use of our solar analysis platform and services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing or using our services, you agree to be bound by these Terms of Service and our Privacy Policy.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Service Description</h2>
            <p className="mb-4">
              We provide solar energy analysis tools that generate reports and estimates for residential and commercial properties.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">User Responsibilities</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Provide accurate property information</li>
              <li>Maintain the security of your account</li>
              <li>Use the service in compliance with applicable laws</li>
              <li>Not attempt to reverse engineer or copy our software</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Payment Terms</h2>
            <p className="mb-4">
              Subscription fees are billed monthly or annually as selected. All payments are processed securely through Stripe.
              You may cancel your subscription at any time.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Intellectual Property</h2>
            <p className="mb-4">
              The service and its original content, features, and functionality are owned by Sunspire and are protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
            <p className="mb-4">
              Our solar analysis reports are estimates based on available data and should not be considered as professional engineering advice.
              We recommend consulting with qualified professionals for final decisions.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms of Service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
            <p className="mb-4">
              Questions about these Terms of Service should be sent to{' '}
              <a href="mailto:legal@getsunspire.com" className="text-blue-600 hover:underline">
                legal@getsunspire.com
              </a>
            </p>

            <p className="text-sm text-gray-500 mt-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>
      {isDemo ? <Footer /> : <PaidFooter />}
    </div>
  );
}

