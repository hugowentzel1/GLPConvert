"use client";

import { useState } from 'react';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useSearchParams } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Stack } from '@/components/layout/Stack';
import { Card } from '@/components/ui/Card';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function CRMGuidesPage() {
  const b = useBrandTakeover();
  const searchParams = useSearchParams();
  const [showAllIntegrations, setShowAllIntegrations] = useState(false);

  const primaryIntegrations = [
    {
      id: "hubspot",
      name: "HubSpot",
      description: "Connect your solar tool with HubSpot CRM for seamless lead management and automation.",
      icon: "H",
      brandColor: "#FF7A59",
      href: "/docs/crm/hubspot",
      features: ["Contact Management", "Deal Tracking", "Email Automation", "Lead Scoring"]
    },
    {
      id: "salesforce",
      name: "Salesforce",
      description: "Integrate with Salesforce CRM to track leads, opportunities, and customer data.",
      icon: "S",
      brandColor: "#00A1E0",
      href: "/docs/crm/salesforce",
      features: ["Lead Management", "Opportunity Tracking", "Custom Objects", "Workflow Automation"]
    },
    {
      id: "airtable",
      name: "Airtable (external only)",
      description:
        "No in-app Airtable sync. Leads live in Supabase; use CRM webhooks or your own tools if you want Airtable.",
      icon: "A",
      brandColor: "#18BFFF",
      href: "/docs/crm/airtable",
      features: ["Supabase is source of truth", "Webhook to your stack", "Optional manual export"],
    },
  ];

  const additionalIntegrations = [
    {
      id: "pipedrive",
      name: "Pipedrive",
      description: "Visual sales pipeline management with automated follow-ups and deal tracking.",
      icon: "P",
      brandColor: "#FF7A59",
      features: ["Sales Pipeline", "Activity Tracking", "Email Integration", "Reporting"]
    },
    {
      id: "zapier",
      name: "Zapier (optional)",
      description:
        "Optional third-party automation. Sunspire does not require Zapier; prefer the native CRM webhook on your dashboard.",
      icon: "Z",
      brandColor: "#FF4A00",
      features: ["Optional", "Not required", "Use webhooks first", "5000+ apps if needed"],
    },
    {
      id: "monday",
      name: "Monday.com",
      description: "Project management and CRM in one platform with customizable workflows.",
      icon: "M",
      brandColor: "#FF3D71",
      features: ["Project Management", "CRM Boards", "Automation", "Team Collaboration"]
    },
    {
      id: "notion",
      name: "Notion",
      description: "All-in-one workspace with CRM capabilities and database management.",
      icon: "N",
      brandColor: "#000000",
      features: ["Database Management", "Team Workspace", "Templates", "API Access"]
    },
    {
      id: "custom",
      name: "Custom Integration",
      description: "Need a specific CRM or custom solution? We can build it for you.",
      icon: "C",
      brandColor: "#6B7280",
      features: ["Custom Development", "API Integration", "Data Migration", "Ongoing Support"]
    }
  ];

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
              <Link 
                href={searchParams?.get('demo') ? `/?${searchParams?.toString()}` : `/paid?${searchParams?.toString()}`} 
                className="inline-flex items-center text-neutral-500 hover:text-neutral-900 transition-colors font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
            </div>

            {/* Hero Block */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mb-6">
                CRM Integration Guides
              </h1>
              <p className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto">
                Connect your solar intelligence tool with your favorite CRM platform. 
                We support all major CRMs and can build custom integrations.
              </p>
            </div>

            {/* Primary Integrations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 md:mt-16">
              {primaryIntegrations.map((integration) => (
                <Card key={integration.id} className="hover:shadow-xl transition-all duration-300 flex flex-col">
                  <div className="text-center space-y-4 flex-1 flex flex-col">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-2xl flex items-center justify-center mx-auto">
                      <span className="text-neutral-900 font-bold text-2xl">{integration.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900">
                      {integration.name}
                    </h3>
                    <p className="text-neutral-600 text-sm flex-1">
                      {integration.description}
                    </p>
                    <div className="space-y-2">
                      {integration.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-xs text-neutral-500">
                          <span className="text-neutral-400 mr-2">•</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Link
                        href={integration.href}
                        className="inline-block w-full py-3 px-6 bg-[var(--brand-primary)] text-white rounded-lg font-semibold hover:opacity-90 transition-colors text-center"
                      >
                        View {integration.name} Guide
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Show More/Less Button */}
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAllIntegrations(!showAllIntegrations)}
                className="inline-flex items-center px-6 py-3 text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
              >
                {showAllIntegrations ? 'Show Less' : 'Show More Integrations'}
                <svg 
                  className={`w-4 h-4 ml-2 transition-transform ${showAllIntegrations ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Additional Integrations */}
            {showAllIntegrations && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
                  Additional Integrations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {additionalIntegrations.map((integration) => (
                    <Card key={integration.id} className="hover:shadow-lg transition-all duration-300">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-xl flex items-center justify-center">
                            <span className="text-neutral-900 font-bold text-xl">{integration.icon}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-neutral-900">
                              {integration.name}
                            </h3>
                            <p className="text-sm text-neutral-600">
                              {integration.description}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {integration.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-xs text-neutral-500">
                              <span className="text-neutral-400 mr-2">•</span>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        {integration.id === 'custom' ? (
                          <a
                            href="mailto:support@getsunspire.com?subject=Custom CRM Integration Request"
                            className="inline-block w-full py-2 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium hover:bg-neutral-200 transition-colors text-center text-sm"
                          >
                            Contact Support
                          </a>
                        ) : (
                          <a
                            href="/support"
                            className="inline-block w-full py-2 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium hover:bg-neutral-200 transition-colors text-center text-sm"
                          >
                            Request Integration
                          </a>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Integration Section */}
            <Card className="mt-12">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-4xl">🔧</span>
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Custom Integration
                  </h2>
                  <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
                    Need a specific CRM or custom solution? We can build it for you.
                  </p>
                </div>
                
                <div className="space-y-3 max-w-lg mx-auto text-left">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4 text-center">What We Offer</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-neutral-600">
                      <span className="text-neutral-400 mr-3 w-4">•</span>
                      <span>Custom Development</span>
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <span className="text-neutral-400 mr-3 w-4">•</span>
                      <span>API Integration</span>
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <span className="text-neutral-400 mr-3 w-4">•</span>
                      <span>Data Migration</span>
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <span className="text-neutral-400 mr-3 w-4">•</span>
                      <span>Ongoing Support</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <a
                    href="mailto:support@getsunspire.com?subject=Custom CRM Integration Request"
                    className="inline-flex items-center justify-center px-8 py-4 bg-[var(--brand-primary)] text-white rounded-lg font-semibold hover:opacity-90 transition-colors text-lg w-full max-w-lg"
                  >
                    Request Custom Integration
                  </a>
                </div>
              </div>
            </Card>

            {/* Back to Support */}
            <div className="mt-12 text-center">
              <Link
                href={searchParams?.toString() ? `/support?${searchParams.toString()}` : '/support'}
                className="inline-flex items-center px-6 py-3 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                ← Back to Support
              </Link>
            </div>
          </Stack>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
