'use client';

import Footer from '@/components/Footer';
import PaidFooter from '@/components/PaidFooter';
import { useIsDemo } from '@/src/lib/isDemo';
import { useSearchParams } from 'next/navigation';

export default function PrivacyPage() {
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
          
          <h1 className="text-4xl font-bold mb-6 text-center md:text-left">Privacy Policy</h1>
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              This Privacy Policy describes how we collect, use, and protect your personal information when you use our solar analysis services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Property address and location data</li>
              <li>Contact information (name, email, phone)</li>
              <li>Usage data and analytics</li>
              <li>Payment information (processed securely by Stripe)</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Generate solar analysis reports</li>
              <li>Process payments and subscriptions</li>
              <li>Provide customer support</li>
              <li>Improve our services</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Data Protection</h2>
            <p className="mb-4">
              We implement industry-standard security measures to protect your personal information. All data is encrypted in transit and at rest.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Services</h2>
            <p className="mb-4">
              We use Google Maps for location services and Stripe for payment processing. These services have their own privacy policies.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@getsunspire.com" className="text-blue-600 hover:underline">
                privacy@getsunspire.com
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

