"use client";

import { useState } from 'react';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useSearchParams } from 'next/navigation';
import { useCompany } from '@/components/CompanyContext';
import Container from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Stack } from '@/components/layout/Stack';
import { Card } from '@/components/ui/Card';
import EarningsMini from '@/components/partners/EarningsMini';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/Button';

export default function PartnersPage() {
  const b = useBrandTakeover();
  const searchParams = useSearchParams();
  const { company } = useCompany();
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    clientRange: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('/api/partner-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: formData.company,
          name: formData.name,
          email: formData.email,
          note: `Phone: ${formData.phone}\nClient Range: ${formData.clientRange}\n\n${formData.message}`
        })
      });
      
      if (!response.ok) {
        // Fallback to mailto
        const subject = encodeURIComponent(`Partner Application - ${formData.company}`);
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nPhone: ${formData.phone}\nClient Range: ${formData.clientRange}\n\n${formData.message}`);
        window.location.href = `mailto:support@getsunspire.com?subject=${subject}&body=${body}`;
        throw new Error('Failed to submit application');
      }
      
      setSubmitStatus('success');
      setFormData({
        company: '',
        name: '',
        email: '',
        phone: '',
        clientRange: '',
        message: ''
      });
    } catch (error) {
      console.error('Partner application error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-inter"
      data-brand
    >
      <Section>
        <Container>
          <Stack>
            {/* Back Button */}
            <div className="mb-8">
              <a 
                href={searchParams?.get('demo') ? `/?${searchParams?.toString()}` : `/paid?${searchParams?.toString()}`} 
                className="inline-flex items-center text-neutral-500 hover:text-neutral-900 transition-colors font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </a>
            </div>

            {/* Hero Block */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mb-6">
                Partner Program
              </h1>
              <p className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto">
                Earn recurring revenue by referring solar installers to Sunspire
              </p>
            </div>

            {/* Eligibility/Payout Strip */}
            <Card className="mt-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Partner Eligibility & Payouts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-brand-600">$30/mo</div>
                    <div className="text-sm text-neutral-600">Per active client</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-brand-600">$120</div>
                    <div className="text-sm text-neutral-600">One-time setup bonus</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-brand-600">30 days</div>
                    <div className="text-sm text-neutral-600">Cookie window</div>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-4">
                  Program terms: Cookie window: 30 days (testing 60–90). Payouts Net-30 (paid on the 15th).
                </p>
              </div>
            </Card>

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-6 md:gap-8 mt-10 md:mt-16">
              {/* Left Column - Commission Structure + Benefits + Testimonial */}
              <div className="col-span-12 lg:col-span-5">
                <Stack>
                  {/* Commission Structure */}
                  <Card>
                    <h3 className="text-lg font-semibold mb-4">Commission Structure</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-neutral-700">Monthly recurring:</span>
                        <span className="font-semibold text-brand-600">$30/client</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-700">Setup bonus:</span>
                        <span className="font-semibold text-brand-600">$120/client</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-700">Cookie window:</span>
                        <span className="font-semibold text-brand-600">30 days</span>
                      </div>
                    </div>
                  </Card>

                  {/* Earnings Mini Calculator */}
                  <EarningsMini />

                  {/* Partner Benefits */}
                  <Card>
                    <h3 className="text-lg font-semibold mb-4">Partner Benefits</h3>
                    <div className="space-y-3">
                      {[
                        'Dedicated partner portal',
                        'Marketing materials & templates',
                        'Priority support',
                        'Monthly performance reports',
                        'Co-marketing opportunities'
                      ].map((benefit) => (
                        <div key={benefit} className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-neutral-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Optimized Testimonial */}
                  <Card>
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'rgba(255, 255, 255, 0.85)',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 2.5px color-mix(in srgb, var(--brand-primary, #e11d48) 35%, transparent)',
                          border: '1px solid rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        <span className="text-gray-800 font-semibold" style={{ fontSize: '16px', lineHeight: 1 }}>JR</span>
                      </div>
                      <div>
                        <p className="text-neutral-700 italic mb-2">
                          &ldquo;Partnered with Sunspire 6 months ago. Already earned $2,400 in recurring revenue from just 8 clients — homeowners instantly trusted our estimates.&rdquo;
                        </p>
                        <p className="text-sm text-neutral-500">— Justin Rota, Owner, 30-employee solar firm, Georgia</p>
                      </div>
                    </div>
                  </Card>
                </Stack>
              </div>

              {/* Right Column - Application Form */}
              <div className="col-span-12 lg:col-span-7">
                <Card>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">Apply to Become a Partner</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                        placeholder="Your company name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label htmlFor="clientRange" className="block text-sm font-medium text-neutral-700 mb-2">
                          Expected Monthly Clients
                        </label>
                        <select
                          id="clientRange"
                          name="clientRange"
                          value={formData.clientRange}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                        >
                          <option value="">Select range</option>
                          <option value="1-5">1-5 clients</option>
                          <option value="6-15">6-15 clients</option>
                          <option value="16-30">16-30 clients</option>
                          <option value="30+">30+ clients</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                        Additional Information
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                        placeholder="Tell us about your solar business and why you'd like to partner with us..."
                      />
                    </div>

                    <button
                      type="submit"
                      data-testid="partner-apply-btn"
                      className="w-full mt-6 inline-flex items-center justify-center rounded-lg bg-[var(--brand-600)] px-4 py-2 text-white hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-600)] disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Partner Application'}
                    </button>
                  </form>

                  {/* Success/Error Messages */}
                  {submitStatus === 'success' && (
                    <div className="bg-[var(--brand-50)] text-[var(--brand-800)] border border-[var(--brand-200)] rounded-xl p-4 mt-4">
                      ✅ Thank you! Our partner team will review your application and contact you within 48 hours.
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-4 mt-4">
                      ❌ Something went wrong. Please try again or email support@getsunspire.com directly.
                    </div>
                  )}

                  <p className="text-xs text-neutral-500 mt-2 text-center">
                    Applications are typically reviewed within 48 hours
                  </p>
                </Card>
              </div>
            </div>
          </Stack>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}