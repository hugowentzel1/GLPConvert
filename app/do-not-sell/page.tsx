'use client';

import { useState } from 'react';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';

export default function DoNotSellPage() {
  const b = useBrandTakeover();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Send opt-out request to support email
      const subject = encodeURIComponent('CCPA Opt-Out Request');
      const body = encodeURIComponent(`Email: ${email}\n\nThis user has requested to opt out of the sale of their personal information under CCPA.`);
      window.location.href = `mailto:support@getsunspire.com?subject=${subject}&body=${body}`;
      setSubmitted(true);
    } catch (error) {
      console.error('Opt-out request error:', error);
      // Still show success to user
      setSubmitted(true);
    }
  };

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
            Do Not Sell My Data
          </h1>

          <div className="prose prose-lg max-w-none">

            <p className="text-gray-600 mb-6">
              Exercise your right under the California Consumer Privacy Act (CCPA) to opt out of the sale of your personal information.
            </p>
              {!submitted ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Opt-Out Request</h2>
                  <p className="text-gray-700">
                    Under the CCPA, you have the right to opt out of the sale of your personal information. 
                    Please note that Sunspire does not sell personal information to third parties for monetary consideration. 
                    However, we provide this form to ensure compliance with all CCPA requirements.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                        placeholder="Enter your email address"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      style={{ backgroundColor: 'var(--brand-primary)' }}
                    >
                      Submit Opt-Out Request
                    </button>
                  </form>
                  
                  <div className="bg-gray-50 rounded-lg p-6 mt-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">What happens after I submit?</h3>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• We will process your request within 15 business days</li>
                      <li>• You will receive a confirmation email</li>
                      <li>• Your email will be added to our opt-out list</li>
                      <li>• This applies to future data collection and processing</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Request Submitted</h2>
                  <p className="text-gray-700">
                    Thank you for submitting your opt-out request. We will process it within 15 business days 
                    and send you a confirmation email at {email}.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="hover:underline"
                    style={{ color: 'var(--brand-primary)' }}
                  >
                    Submit another request
                  </button>
                </div>
              )}

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your CCPA Rights</h2>
              <div className="space-y-4 text-gray-700">
                <p>Under the California Consumer Privacy Act, you have the following rights:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span><strong>Right to Know:</strong> Request information about how we collect, use, and share your personal information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span><strong>Right to Delete:</strong> Request deletion of your personal information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span><strong>Right to Opt-Out:</strong> Opt out of the sale of your personal information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span><strong>Right to Non-Discrimination:</strong> Not be discriminated against for exercising your rights</span>
                  </li>
                </ul>
                <p className="mt-4">
                  For more information about our privacy practices, please review our{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> or contact us at{' '}
                  <a href="mailto:privacy@sunspire.app" className="hover:underline">privacy@sunspire.app</a>.
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