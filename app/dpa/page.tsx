"use client";

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';

export default function DPAPage() {
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
            Data Processing Agreement (DPA)
          </h1>

          <div className="prose prose-lg max-w-none">

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                This Data Processing Agreement (&quot;DPA&quot;) forms part of the Terms of Service between Sunspire (&quot;Data Processor&quot;) and the customer (&quot;Data Controller&quot;) for the processing of personal data in connection with our solar intelligence platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Definitions</h2>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <strong>Personal Data:</strong> Any information relating to an identified or identifiable natural person.
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <strong>Processing:</strong> Any operation performed on personal data, including collection, storage, and analysis.
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <strong>Data Subject:</strong> The individual whose personal data is being processed.
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Scope and Nature of Processing</h2>
              <p className="text-gray-600 mb-4">
                Sunspire processes personal data for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li className="text-[var(--brand-primary)]">Providing solar analysis and quote generation services</li>
                <li className="text-[var(--brand-primary)]">Lead management and CRM integration</li>
                <li className="text-[var(--brand-primary)]">Customer support and communication</li>
                <li className="text-[var(--brand-primary)]">Service improvement and analytics</li>
                <li className="text-[var(--brand-primary)]">Compliance with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security Measures</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate technical and organizational measures to ensure data security:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Technical Measures</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• End-to-end encryption</li>
                    <li>• Secure API endpoints</li>
                    <li>• Regular security audits</li>
                    <li>• Access controls and authentication</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Organizational Measures</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Employee training</li>
                    <li>• Incident response procedures</li>
                    <li>• Data protection policies</li>
                    <li>• Regular compliance reviews</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Subject Rights</h2>
              <p className="text-gray-600 mb-4">
                Data subjects have the following rights regarding their personal data:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <strong>Right of Access:</strong> Request information about personal data processing
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <strong>Right to Rectification:</strong> Correct inaccurate personal data
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <strong>Right to Erasure:</strong> Request deletion of personal data
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <strong>Right to Portability:</strong> Receive personal data in a structured format
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Breach Notification</h2>
              <p className="text-gray-600 mb-4">
                In the event of a personal data breach, Sunspire will:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li className="text-[var(--brand-primary)]">Notify the Data Controller within 72 hours of becoming aware</li>
                <li className="text-[var(--brand-primary)]">Provide detailed information about the breach</li>
                <li className="text-[var(--brand-primary)]">Take immediate steps to contain and remediate the breach</li>
                <li className="text-[var(--brand-primary)]">Cooperate with relevant authorities and Data Controller</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Subprocessors</h2>
              <p className="text-gray-600 mb-4">
                Sunspire may engage subprocessors to assist in providing services. All subprocessors are bound by data protection obligations no less protective than those in this DPA.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
              <p className="text-gray-600 mb-4">
                Personal data is retained only for as long as necessary to fulfill the purposes outlined in this agreement, unless a longer retention period is required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                For questions about this DPA or to exercise data subject rights, contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Phone:</strong> <a href="tel:+14047702672" className="hover:underline">+1 (404) 770-2672</a><br />
                  <strong>Data Protection Officer:</strong> <a href="mailto:support@getsunspire.com" className="hover:underline">support@getsunspire.com</a><br />
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
