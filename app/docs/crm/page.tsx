"use client";

import { Suspense, useState } from 'react';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useSearchParams } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Stack } from '@/components/layout/Stack';
import { Card } from '@/components/ui/Card';
import BrandedDemoOrDefaultFooter from '@/components/intake/BrandedDemoOrDefaultFooter';
import { buildBrandedDemoReturnHref, buildMarketingPathHref } from '@/lib/glp-intake-nav-href';
import { PRODUCT_NAME, SUPPORT_EMAIL } from '@/lib/product-identity';
import Link from 'next/link';

function CRMGuidesContent() {
  const b = useBrandTakeover();
  const searchParams = useSearchParams();
  const [showAllIntegrations, setShowAllIntegrations] = useState(false);
  const homeHref = buildBrandedDemoReturnHref(searchParams);
  const supportHref = buildMarketingPathHref(searchParams, "/support");

  const primaryIntegrations = [
    {
      id: "hubspot",
      name: "HubSpot",
      description: `Send ${PRODUCT_NAME} intake leads to HubSpot CRM in real time for follow-up sequences and pipeline tracking.`,
      icon: "H",
      brandColor: "#FF7A59",
      href: "/docs/crm/hubspot",
      features: ["Contact creation", "Deal tracking", "Email sequences", "Lead scoring"]
    },
    {
      id: "salesforce",
      name: "Salesforce",
      description: `Push ${PRODUCT_NAME} intake responses to Salesforce as Leads or Cases for your existing patient acquisition workflows.`,
      icon: "S",
      brandColor: "#00A1E0",
      href: "/docs/crm/salesforce",
      features: ["Lead management", "Opportunity tracking", "Custom objects", "Workflow automation"]
    },
    {
      id: "airtable",
      name: "Airtable (external only)",
      description:
        "No in-app Airtable sync. Leads live in our database; use a CRM webhook or your own tools if you want Airtable.",
      icon: "A",
      brandColor: "#18BFFF",
      href: "/docs/crm/airtable",
      features: ["Database is source of truth", "Webhook to your stack", "Optional manual export"],
    },
  ];

  const additionalIntegrations = [
    {
      id: "pipedrive",
      name: "Pipedrive",
      description: "Visual sales pipeline management with automated follow-ups and deal tracking.",
      icon: "P",
      brandColor: "#FF7A59",
      features: ["Sales pipeline", "Activity tracking", "Email integration", "Reporting"]
    },
    {
      id: "zapier",
      name: "Zapier (optional)",
      description:
        `Optional third-party automation. ${PRODUCT_NAME} does not require Zapier; prefer the native CRM webhook on your dashboard.`,
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
                href={homeHref}
                className="inline-flex items-center text-neutral-500 hover:text-neutral-900 transition-colors font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to home
              </Link>
            </div>

            {/* Hero Block */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mb-6">
                CRM integration guides
              </h1>
              <p className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto">
                Connect {PRODUCT_NAME} with your CRM so every intake lead flows into the same
                pipeline your team already runs.
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
                            href={`mailto:${SUPPORT_EMAIL}?subject=Custom%20CRM%20Integration%20Request`}
                            className="inline-block w-full py-2 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium hover:bg-neutral-200 transition-colors text-center text-sm"
                          >
                            Contact support
                          </a>
                        ) : (
                          <Link
                            href={supportHref}
                            className="inline-block w-full py-2 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium hover:bg-neutral-200 transition-colors text-center text-sm"
                          >
                            Request integration
                          </Link>
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
                    href={`mailto:${SUPPORT_EMAIL}?subject=Custom%20CRM%20Integration%20Request`}
                    className="inline-flex items-center justify-center px-8 py-4 bg-[var(--brand-primary)] text-white rounded-lg font-semibold hover:opacity-90 transition-colors text-lg w-full max-w-lg"
                  >
                    Request custom integration
                  </a>
                </div>
              </div>
            </Card>

            {/* Back to Support */}
            <div className="mt-12 text-center">
              <Link
                href={supportHref}
                className="inline-flex items-center px-6 py-3 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                ← Back to support
              </Link>
            </div>
          </Stack>
        </Container>
      </Section>

      <BrandedDemoOrDefaultFooter />
    </div>
  );
}

export default function CRMGuidesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" aria-label="Loading" />}>
      <CRMGuidesContent />
    </Suspense>
  );
}
