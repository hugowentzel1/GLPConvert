"use client";

import { useState } from 'react';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useSearchParams } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Stack } from '@/components/layout/Stack';
import { Card } from '@/components/ui/Card';
import Footer from '@/components/Footer';

export default function BrandingCustomizationPage() {
  const b = useBrandTakeover();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("colors");

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
                Branding Customization
              </h1>
              <p className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto">
                Complete white-label customization for your solar intelligence platform. 
                Make it truly yours with your colors, logo, and domain.
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center mb-8 border-b border-neutral-200">
              {[
                { id: "colors", label: "Colors & Theme" },
                { id: "logo", label: "Logo & Branding" },
                { id: "domain", label: "Domain Setup" },
                { id: "advanced", label: "Advanced Options" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-[var(--brand-primary)] border-b-2 border-[var(--brand-primary)]"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === "colors" && (
                <div className="space-y-8">
                  <Card>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">Color Customization</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-4">Primary Brand Color</h3>
                        <p className="text-neutral-600 mb-4">
                          Set your primary brand color that will be used throughout the interface for buttons, links, and accents.
                        </p>
                        
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <div 
                              className="w-16 h-16 rounded-lg border-2 border-neutral-300"
                              style={{ backgroundColor: 'var(--brand-primary, #2563eb)' }}
                            ></div>
                            <div>
                              <p className="font-medium text-neutral-900">Current Color</p>
                              <p className="text-sm text-neutral-600">var(--brand-primary)</p>
                            </div>
                          </div>
                          
                          <div className="bg-neutral-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-neutral-900 mb-2">How to Set Your Color</h4>
                            <p className="text-sm text-neutral-600 mb-2">
                              Add this parameter to your URL or contact support:
                            </p>
                            <code className="text-sm bg-neutral-900 text-green-400 p-2 rounded block">
                              ?brandColor=#FF6B35
                            </code>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-4">Color Examples</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { name: "Tesla Red", color: "#CC0000" },
                            { name: "Google Blue", color: "#4285F4" },
                            { name: "Solar Orange", color: "#FF6B35" },
                            { name: "Green Energy", color: "#00A651" }
                          ].map((example) => (
                            <div key={example.name} className="text-center">
                              <div 
                                className="w-full h-16 rounded-lg mb-2 border border-neutral-300"
                                style={{ backgroundColor: example.color }}
                              ></div>
                              <p className="text-sm font-medium text-neutral-900">{example.name}</p>
                              <p className="text-xs text-neutral-600">{example.color}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-4">CSS Variables</h3>
                    <p className="text-neutral-600 mb-4">
                      We use CSS custom properties for easy theming. Here are the available variables:
                    </p>
                    
                    <div className="bg-neutral-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`:root {
  --brand-primary: #2563eb;     /* Primary brand color */
  --brand-secondary: #64748b;   /* Secondary color */
  --brand-accent: #f1f5f9;      /* Accent color */
  --brand-text: #1e293b;        /* Primary text color */
  --brand-bg: #ffffff;          /* Background color */
}`}</pre>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === "logo" && (
                <div className="space-y-8">
                  <Card>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">Logo & Branding</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-4">Logo Requirements</h3>
                        <ul className="space-y-2 text-neutral-600">
                          <li className="flex items-start">
                            <span className="text-[var(--brand-primary)] mr-2">•</span>
                            <span>Recommended size: 200x200px minimum</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[var(--brand-primary)] mr-2">•</span>
                            <span>Format: PNG, SVG, or JPG</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[var(--brand-primary)] mr-2">•</span>
                            <span>Transparent background preferred</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[var(--brand-primary)] mr-2">•</span>
                            <span>High resolution for crisp display</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-4">Current Logo</h3>
                        <div className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg">
                          {b.enabled && b.logo ? (
                            <img 
                              src={b.logo} 
                              alt={`${b.brand} logo`} 
                              className="w-16 h-16 object-contain rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-lg flex items-center justify-center">
                              <span className="text-neutral-900 font-bold text-lg">☀️</span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-neutral-900">Brand: {b.enabled ? b.brand : "Default"}</p>
                            <p className="text-sm text-neutral-600">Logo will appear in header and reports</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-4">Logo Upload Methods</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-neutral-50 p-6 rounded-lg">
                        <h4 className="font-semibold text-neutral-900 mb-3">URL Parameter</h4>
                        <p className="text-sm text-neutral-600 mb-4">
                          Add your logo URL as a parameter
                        </p>
                        <code className="text-xs bg-neutral-900 text-green-400 p-2 rounded block">
                          ?logo=https://example.com/logo.png
                        </code>
                      </div>

                      <div className="bg-neutral-50 p-6 rounded-lg">
                        <h4 className="font-semibold text-neutral-900 mb-3">Clearbit Integration</h4>
                        <p className="text-sm text-neutral-600 mb-4">
                          Automatic logo detection from company name
                        </p>
                        <code className="text-xs bg-neutral-900 text-green-400 p-2 rounded block">
                          ?company=Tesla
                        </code>
                      </div>

                      <div className="bg-neutral-50 p-6 rounded-lg">
                        <h4 className="font-semibold text-neutral-900 mb-3">Support Upload</h4>
                        <p className="text-sm text-neutral-600 mb-4">
                          Contact support for custom logo setup
                        </p>
                        <a 
                          href="mailto:support@getsunspire.com"
                          className="text-[var(--brand-primary)] hover:underline text-sm"
                        >
                          support@getsunspire.com
                        </a>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === "domain" && (
                <div className="space-y-8">
                  <Card>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">Domain Setup</h2>
                    
                    <div className="bg-gradient-to-r from-[var(--brand-primary)] to-white p-6 rounded-lg mb-8">
                      <h3 className="text-xl font-semibold text-neutral-900 mb-4">White-Label Domain</h3>
                      <p className="text-neutral-600 mb-4">
                        Your solar intelligence tool will be available on your own domain, completely white-labeled.
                      </p>
                      <div className="bg-white/80 p-4 rounded-lg">
                        <p className="font-mono text-sm">
                          https://your-domain.com/solar-quote
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-4">Setup Process</h3>
                        <div className="space-y-4">
                          {[
                            "Provide your domain name",
                            "We configure DNS settings",
                            "SSL certificate installation",
                            "Testing and validation",
                            "Go live within 24 hours"
                          ].map((step, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-full flex items-center justify-center text-neutral-900 font-bold text-sm">
                                {index + 1}
                              </div>
                              <span className="text-neutral-600">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-4">Requirements</h3>
                        <ul className="space-y-2 text-neutral-600">
                          <li className="flex items-start">
                            <span className="text-[var(--brand-primary)] mr-2">•</span>
                            <span>Valid domain name</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[var(--brand-primary)] mr-2">•</span>
                            <span>DNS access or ability to add CNAME records</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[var(--brand-primary)] mr-2">•</span>
                            <span>SSL certificate (we provide this)</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[var(--brand-primary)] mr-2">•</span>
                            <span>Subdomain or path available</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === "advanced" && (
                <div className="space-y-8">
                  <Card>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">Advanced Customization</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-4">Custom CSS</h3>
                        <p className="text-neutral-600 mb-4">
                          For advanced users, we support custom CSS injection for complete control over styling.
                        </p>
                        
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-neutral-900 mb-2">Example Custom CSS</h4>
                          <code className="text-sm bg-neutral-900 text-green-400 p-2 rounded block">
{`.custom-button {
  background: linear-gradient(45deg, #FF6B35, #F7931E);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}`}
                          </code>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-4">API Customization</h3>
                        <p className="text-neutral-600 mb-4">
                          Customize the behavior and appearance through our API endpoints.
                        </p>
                        
                        <div className="space-y-3">
                          <div className="bg-neutral-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-neutral-900">Brand Configuration</p>
                            <code className="text-xs text-neutral-600">POST /api/brand/configure</code>
                          </div>
                          <div className="bg-neutral-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-neutral-900">Theme Override</p>
                            <code className="text-xs text-neutral-600">PUT /api/theme/update</code>
                          </div>
                          <div className="bg-neutral-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-neutral-900">Logo Upload</p>
                            <code className="text-xs text-neutral-600">POST /api/brand/logo</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-4">Support & Implementation</h3>
                    <div className="bg-gradient-to-r from-[var(--brand-primary)] to-white p-6 rounded-lg">
                      <p className="text-neutral-600 mb-4">
                        Need help with advanced customization? Our team can implement any design requirements.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <a 
                          href="mailto:support@getsunspire.com"
                          className="inline-flex items-center px-6 py-3 bg-white text-[var(--brand-primary)] rounded-lg font-semibold hover:bg-neutral-50 transition-colors"
                        >
                          Contact Support
                        </a>
                        <a 
                          href="/support"
                          className="inline-flex items-center px-6 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                        >
                          Create Ticket
                        </a>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
            
            {/* Back to Support */}
            <div className="mt-12 text-center">
              <a
                href={searchParams?.toString() ? `/support?${searchParams.toString()}` : '/support'}
                className="inline-flex items-center px-6 py-3 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                ← Back to Support
              </a>
            </div>
          </Stack>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}