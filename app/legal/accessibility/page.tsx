'use client';

import Footer from '@/components/Footer';
import PaidFooter from '@/components/PaidFooter';
import { useIsDemo } from '@/src/lib/isDemo';
import { useSearchParams } from 'next/navigation';

export default function AccessibilityPage() {
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
          <h1 className="text-4xl font-bold mb-6 text-center md:text-left">Accessibility</h1>
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              We are committed to ensuring our website and services are accessible to everyone, including people with disabilities.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Accessibility Standards</h2>
            <p className="mb-4">
              We strive to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Accessibility Features</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Keyboard navigation support</li>
              <li>Screen reader compatibility</li>
              <li>High contrast mode support</li>
              <li>Alternative text for images</li>
              <li>Semantic HTML structure</li>
              <li>Focus indicators for interactive elements</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Assistive Technologies</h2>
            <p className="mb-4">
              Our website is designed to work with common assistive technologies including:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
              <li>Voice control software</li>
              <li>Keyboard-only navigation</li>
              <li>Magnification software</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Reporting Accessibility Issues</h2>
            <p className="mb-4">
              If you encounter any accessibility barriers or have suggestions for improvement, please contact us:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Email: <a href="mailto:accessibility@getsunspire.com" className="text-blue-600 hover:underline">accessibility@getsunspire.com</a></li>
              <li>Phone: <a href="tel:+14041234567" className="text-blue-600 hover:underline">+1 (404) 123-4567</a></li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Ongoing Commitment</h2>
            <p className="mb-4">
              We regularly review and update our accessibility practices to ensure we continue to meet the needs of all users.
              This page will be updated as we make improvements.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Alternative Formats</h2>
            <p className="mb-4">
              If you need information from our website in an alternative format, please contact us and we will work to provide it in a format that meets your needs.
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

