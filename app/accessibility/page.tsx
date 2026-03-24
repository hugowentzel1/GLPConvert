"use client";

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';

export default function AccessibilityPage() {
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
            Accessibility Statement
          </h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
              <p className="text-gray-600 mb-4">
                We are committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Conformance Status</h2>
              <p className="text-gray-600 mb-4">
                We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible for people with disabilities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Accessibility Features</h2>
              <p className="text-gray-600 mb-4">Our platform includes:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Keyboard navigation support</li>
                <li>Screen reader compatibility</li>
                <li>Clear visual contrast</li>
                <li>Descriptive alt text for images</li>
                <li>Accessible form labels and error messages</li>
                <li>Responsive design for different devices</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedback</h2>
              <p className="text-gray-600 mb-4">
                We welcome your feedback on the accessibility of our solar intelligence platform. If you encounter accessibility barriers, please let us know:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> <a href="mailto:support@getsunspire.com" className="hover:underline text-[var(--brand-primary)]">support@getsunspire.com</a><br/>
                  <strong>Subject:</strong> Accessibility Feedback
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ongoing Efforts</h2>
              <p className="text-gray-600 mb-4">
                We regularly review our platform and work to remediate any identified accessibility issues. We also train our development team on accessibility best practices.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

