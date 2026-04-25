"use client";

import { useState } from "react";
import { useSearchParams } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Stack } from '@/components/layout/Stack';
import { Card } from '@/components/ui/Card';
import BrandedDemoOrDefaultFooter from '@/components/intake/BrandedDemoOrDefaultFooter';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { PRODUCT_NAME, SUPPORT_EMAIL } from '@/lib/product-identity';
import { buildBrandedDemoReturnHref, buildMarketingPathHref } from '@/lib/glp-intake-nav-href';

export default function SupportPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    priority: '',
    category: '',
    subject: '',
    message: ''
  });
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/support-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: formData.subject,
          email: formData.email,
          message: formData.message,
          priority: formData.priority
        })
      });
      
      if (!response.ok) {
        // Fallback to mailto
        const subject = encodeURIComponent(formData.subject);
        const body = encodeURIComponent(`From: ${formData.email}\nPriority: ${formData.priority}\n\n${formData.message}`);
        window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
        throw new Error('Failed to submit support ticket');
      }
      
      alert('Support ticket created! We\'ll respond within 24 hours (or 4 hours for high priority tickets).');
      setFormData({
        name: '',
        email: '',
        company: '',
        priority: '',
        category: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Support submission error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const faqs = [
    {
      question: "Does the platform provide medical advice?",
      answer: "No. The platform supports educational intake and booking. A licensed provider determines final eligibility and treatment decisions."
    },
    {
      question: "How quickly can I get the tool live on my website?",
      answer: "Standard setup takes 24-48 hours. Priority setup available within 12 hours."
    },
    {
      question: "Can I customize the branding and colors?",
      answer: "Yes! All plans include full white-label customization with your colors, logo, and domain."
    },
    {
      question: "What CRM integrations are available?",
      answer: "We integrate with HubSpot, Salesforce, Pipedrive, and Zapier. Custom integrations available upon request."
    },
    {
      question: "Is there a free trial?",
      answer: "Setup fee refunded if your branded site isn't live on your domain within 24 hours of purchase. Cancel anytime. See our Terms for details."
    }
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-inter"
      data-brand
      role="main"
    >
      <Section className="py-14 sm:py-20">
        <Container className="max-w-4xl">
          <Stack>
            {/* Back Button */}
            <div className="mb-10 sm:mb-12">
              <Link
                href={buildBrandedDemoReturnHref(searchParams)}
                className="inline-flex items-center text-neutral-500 hover:text-neutral-900 transition-colors font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
            </div>
            <p className="text-xs text-neutral-500 -mt-2 mb-8 max-w-2xl leading-relaxed text-center sm:text-left">
              For compliance context, U.S. clinics often reference the{" "}
              <a
                className="text-neutral-700 underline"
                href="https://www.hhs.gov/hipaa/index.html"
                target="_blank"
                rel="noreferrer"
              >
                HHS HIPAA hub
              </a>
              , the{" "}
              <a
                className="text-neutral-700 underline"
                href="https://www.ftc.gov/business-guidance/resources/health-products-compliance"
                target="_blank"
                rel="noreferrer"
              >
                FTC health-products business guidance
              </a>
              , and the{" "}
              <a
                className="text-neutral-700 underline"
                href="https://www.nist.gov/cyberframework"
                target="_blank"
                rel="noreferrer"
              >
                NIST Cybersecurity Framework
              </a>{" "}
              (security posture). {PRODUCT_NAME} product policies:{" "}
              <Link href={buildMarketingPathHref(searchParams, "/privacy")} className="text-neutral-700 underline">
                Privacy
              </Link>{" "}
              ·{" "}
              <Link href={buildMarketingPathHref(searchParams, "/legal/terms")} className="text-neutral-700 underline">
                Terms
              </Link>
              .
            </p>

            {/* Hero Block */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mb-6">
                Support Center
              </h1>
              <p className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto">
                Get help with setup, integrations, and optimization
              </p>
            </div>

            {/* SLO Badge Row */}
            <div className="text-center py-4 border-y border-neutral-200/60">
              <p className="text-sm text-neutral-600">
                Avg reply &lt;24h • High priority 4h • Urgent 1h • Priority 2h SLA
              </p>
            </div>

            {/* Support Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-10 md:mt-16">
              {/* Email Support */}
              <Card>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">Email Support</h3>
                  <p className="text-sm text-gray-600">Primary support channel</p>
                  <p className="text-xs text-gray-500">&lt;24h response time</p>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="inline-block text-sm text-gray-500 hover:text-gray-600 font-medium"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </div>
              </Card>

              {/* Documentation */}
              <Card>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">Documentation</h3>
                  <p className="text-sm text-gray-600">Setup guides & tutorials</p>
                  <p className="text-xs text-gray-500">Self-service resources</p>
                  <Link
                    href={buildMarketingPathHref(searchParams, "/docs/setup")}
                    className="inline-block text-sm text-brand-600 hover:text-brand-700 font-medium"
                  >
                    View Documentation
                  </Link>
                </div>
              </Card>

              {/* System Status */}
              <Card>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">System Status</h3>
                  <p className="text-sm text-gray-600">Service uptime</p>
                  <p className="text-xs text-gray-500 font-medium">All systems operational</p>
                  <Link
                    href={buildMarketingPathHref(searchParams, "/status")}
                    className="inline-block text-sm text-brand-600 hover:text-brand-700 font-medium"
                  >
                    Check Status
                  </Link>
                </div>
              </Card>
            </div>

            {/* Main Grid - FAQ + Support Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-6 mt-10 md:mt-16">
              {/* Left Column - FAQ */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-8">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-neutral-200/60 shadow-sm overflow-hidden">
                      <button
                        onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                        className="w-full px-6 py-5 md:px-7 md:py-6 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                      >
                        <span className="font-semibold text-neutral-900 pr-4">{faq.question}</span>
                        <svg
                          className={`w-5 h-5 text-neutral-500 flex-shrink-0 transition-transform duration-200 ${openFAQ === idx ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openFAQ === idx && (
                        <div className="px-6 py-5 md:px-7 md:py-6">
                          <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Helpful Resources */}
                <div className="mt-12">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-6">Helpful Resources</h3>
                  <div className="space-y-3">
                    <Link href={searchParams?.toString() ? `/docs/setup?${searchParams.toString()}` : '/docs/setup'} className="block font-medium text-brand-600 hover:underline">Setup Guide</Link>
                    <Link href={searchParams?.toString() ? `/docs/crm?${searchParams.toString()}` : '/docs/crm'} className="block font-medium text-brand-600 hover:underline">CRM Integration Tutorial</Link>
                    <Link href={searchParams?.toString() ? `/docs/branding?${searchParams.toString()}` : '/docs/branding'} className="block font-medium text-brand-600 hover:underline">Branding Customization</Link>
                    <Link href={searchParams?.toString() ? `/docs/api?${searchParams.toString()}` : '/docs/api'} className="block font-medium text-brand-600 hover:underline">API Documentation</Link>
                  </div>
                </div>
              </div>

              {/* Right Column - Support Form */}
              <div>
                <Card>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">Create Support Ticket</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                        placeholder="Your company name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-neutral-700 mb-2">
                          Priority Level
                        </label>
                        <select
                          id="priority"
                          name="priority"
                          value={formData.priority}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                        >
                          <option value="">Select priority</option>
                          <option value="low">Low - General question</option>
                          <option value="medium">Medium - Setup help</option>
                          <option value="high">High - Urgent issue</option>
                          <option value="critical">Critical - System down</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
                          Category
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                        >
                          <option value="">Select category</option>
                          <option value="setup">Setup & Onboarding</option>
                          <option value="integration">CRM Integration</option>
                          <option value="technical">Technical Issue</option>
                          <option value="billing">Billing Question</option>
                          <option value="feature">Feature Request</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                        placeholder="Brief description of your issue"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                        placeholder="Please provide detailed information about your issue..."
                      />
                    </div>

                    <button
                      type="submit"
                      data-testid="support-submit-btn"
                      className="w-full mt-6 inline-flex items-center justify-center rounded-lg bg-[var(--brand-600)] px-4 py-2 text-white hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-600)] disabled:opacity-50"
                    >
                      Create Support Ticket
                    </button>
                  </form>

                  {/* SLA / Reply Times */}
                  <p className="mt-4 text-center text-sm text-neutral-600">
                    Typical reply times: &lt;24h • High priority &lt;4h • Critical &lt;1h
                  </p>
                </Card>

                {/* Response Times */}
                <Card className="mt-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Response Times</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">General inquiries:</span>
                      <span className="font-medium">&lt;24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">High priority:</span>
                      <span className="font-medium">&lt;4 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Critical issues:</span>
                      <span className="font-medium">&lt;1 hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Priority SLA:</span>
                      <span className="font-medium">&lt;2 hours</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Stack>
        </Container>
      </Section>

      <BrandedDemoOrDefaultFooter />
    </div>
  );
}