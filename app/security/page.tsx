'use client';

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';

export default function SecurityPage() {
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
            Security & Compliance
          </h1>

          <div className="prose prose-lg max-w-none">

            <p className="text-gray-600 mb-6">
              Your data security and privacy are our top priorities. Learn about our comprehensive security measures and compliance standards.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Encryption</h2>
            <div className="space-y-4 text-gray-700">
              <p>We employ industry-standard encryption to protect your data both in transit and at rest:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span><strong>In Transit:</strong> TLS 1.2+ encryption for all data transmission</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span><strong>At Rest:</strong> AES-256 encryption for all stored data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span><strong>Key Management:</strong> Secure key rotation and hardware security modules</span>
                </li>
              </ul>
            </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">SOC 2 Compliance</h2>
            <div className="space-y-4 text-gray-700">
              <p>Sunspire maintains SOC 2 Type II compliance, demonstrating our commitment to:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span><strong>Security:</strong> Protection against unauthorized access</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span><strong>Availability:</strong> System reliability and uptime</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span><strong>Confidentiality:</strong> Protection of sensitive information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span><strong>Privacy:</strong> Personal information protection</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">SOC 2 reports are available to customers upon request.</p>
            </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">GDPR Compliance</h2>
            <div className="space-y-4 text-gray-700">
              <p>We adhere to the General Data Protection Regulation (GDPR) requirements:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span><strong>Lawful Basis:</strong> Clear legal basis for all data processing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span><strong>Data Minimization:</strong> Only collect necessary data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span><strong>Right to Access:</strong> Users can request their data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span><strong>Right to Deletion:</strong> Users can request data deletion</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span><strong>Data Portability:</strong> Users can export their data</span>
                </li>
              </ul>
            </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">CCPA Compliance</h2>
            <div className="space-y-4 text-gray-700">
              <p>We comply with the California Consumer Privacy Act (CCPA) by providing:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span><strong>Right to Know:</strong> What personal information we collect</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span><strong>Right to Delete:</strong> Request deletion of personal information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span><strong>Right to Opt-Out:</strong> Opt out of sale of personal information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span><strong>Non-Discrimination:</strong> No penalty for exercising rights</span>
                </li>
              </ul>
              <p className="mt-4">
                To exercise your CCPA rights or opt out of data sales, visit our{' '}
                <a href="/do-not-sell" className="text-blue-600 hover:underline">Do Not Sell My Data</a> page.
              </p>
            </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Breach Procedures</h2>
            <div className="space-y-4 text-gray-700">
              <p>In the unlikely event of a data breach, we follow strict procedures:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span><strong>Immediate Containment:</strong> Isolate and contain the breach within 1 hour</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span><strong>Assessment:</strong> Evaluate impact and affected data within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span><strong>Notification:</strong> Notify authorities within 72 hours where required</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span><strong>User Communication:</strong> Inform affected users without undue delay</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span><strong>Remediation:</strong> Implement fixes and improve security measures</span>
                </li>
              </ul>
            </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Protection Officer</h2>
            <div className="space-y-4 text-gray-700">
              <p>For any security, privacy, or compliance questions, contact our Data Protection Officer:</p>
              <div className="bg-gray-50 rounded-lg p-6 mt-4">
                <p className="font-semibold text-gray-900">Data Protection Officer</p>
                <p className="text-gray-700">Email: <a href="mailto:security@sunspire.app" className="hover:underline">security@sunspire.app</a></p>
                <p className="text-gray-700">Response time: Within 48 hours</p>
              </div>
            </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}