"use client";

import { useState } from 'react';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useSearchParams } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Stack } from '@/components/layout/Stack';
import { Card } from '@/components/ui/Card';
import Footer from '@/components/Footer';

export default function APIDocumentationPage() {
  const b = useBrandTakeover();
  const searchParams = useSearchParams();
  const [activeEndpoint, setActiveEndpoint] = useState("estimate");

  const endpoints = [
    {
      id: "estimate",
      name: "Solar Estimate",
      method: "GET",
      path: "/api/estimate",
      description: "Generate solar energy estimates for a property"
    },
    {
      id: "brand",
      name: "Brand Configuration",
      method: "POST",
      path: "/api/brand/configure",
      description: "Configure branding and theme settings"
    },
    {
      id: "leads",
      name: "Lead Management",
      method: "POST",
      path: "/api/leads",
      description: "Create and manage solar leads"
    },
    {
      id: "webhook",
      name: "Webhooks",
      method: "POST",
      path: "/api/webhooks",
      description: "Configure webhook endpoints for real-time updates"
    }
  ];

  const getEndpointDetails = (endpointId: string) => {
    switch (endpointId) {
      case "estimate":
        return {
          description: "Generate comprehensive solar energy estimates using NREL PVWatts v8 data and EIA electricity rates.",
          parameters: [
            { name: "address", type: "string", required: true, description: "Property address" },
            { name: "lat", type: "number", required: true, description: "Latitude coordinate" },
            { name: "lng", type: "number", required: true, description: "Longitude coordinate" },
            { name: "systemKw", type: "number", required: false, description: "System size in kW (default: 7.2)" },
            { name: "state", type: "string", required: false, description: "State for utility rate lookup" },
            { name: "placeId", type: "string", required: false, description: "Google Places ID" }
          ],
          response: {
            estimate: {
              annualProductionKWh: "number",
              monthlySavings: "number",
              paybackPeriod: "number",
              systemSize: "number",
              shadingAnalysis: "object",
              utilityRates: "object"
            }
          },
          example: {
            request: `GET /api/estimate?address=123 Main St&lat=40.7128&lng=-74.0060&systemKw=7.2`,
            response: `{
  "estimate": {
    "annualProductionKWh": 12500,
    "monthlySavings": 180,
    "paybackPeriod": 8.5,
    "systemSize": 7.2,
    "shadingAnalysis": {
      "method": "remote",
      "confidence": 0.85
    },
    "utilityRates": {
      "state": "NY",
      "ratePerKwh": 0.22
    }
  }
}`
          }
        };
      case "brand":
        return {
          description: "Configure branding settings including colors, logo, and theme customization.",
          parameters: [
            { name: "brandColor", type: "string", required: true, description: "Primary brand color (hex)" },
            { name: "logo", type: "string", required: false, description: "Logo URL" },
            { name: "company", type: "string", required: true, description: "Company name" },
            { name: "theme", type: "object", required: false, description: "Custom theme object" }
          ],
          response: {
            success: "boolean",
            brandId: "string",
            message: "string"
          },
          example: {
            request: `POST /api/brand/configure
{
  "brandColor": "#FF6B35",
  "logo": "https://example.com/logo.png",
  "company": "SolarCorp"
}`,
            response: `{
  "success": true,
  "brandId": "brand_123456",
  "message": "Brand configuration updated successfully"
}`
          }
        };
      case "leads":
        return {
          description: "Create and manage solar leads with automatic CRM integration.",
          parameters: [
            { name: "name", type: "string", required: true, description: "Lead name" },
            { name: "email", type: "string", required: true, description: "Lead email" },
            { name: "phone", type: "string", required: false, description: "Lead phone number" },
            { name: "address", type: "string", required: true, description: "Property address" },
            { name: "estimate", type: "object", required: true, description: "Solar estimate data" },
            { name: "crmId", type: "string", required: false, description: "CRM system ID" }
          ],
          response: {
            leadId: "string",
            crmId: "string",
            status: "string",
            message: "string"
          },
          example: {
            request: `POST /api/leads
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, State",
  "estimate": {
    "annualProductionKWh": 12500,
    "monthlySavings": 180
  }
}`,
            response: `{
  "leadId": "lead_789012",
  "crmId": "crm_345678",
  "status": "created",
  "message": "Lead created successfully"
}`
          }
        };
      case "webhook":
        return {
          description: "Configure webhook endpoints for real-time notifications and data synchronization.",
          parameters: [
            { name: "url", type: "string", required: true, description: "Webhook endpoint URL" },
            { name: "events", type: "array", required: true, description: "Events to subscribe to" },
            { name: "secret", type: "string", required: false, description: "Webhook secret for verification" }
          ],
          response: {
            webhookId: "string",
            status: "string",
            events: "array"
          },
          example: {
            request: `POST /api/webhooks
{
  "url": "https://your-site.com/webhook",
  "events": ["lead.created", "estimate.generated"],
  "secret": "your-secret-key"
}`,
            response: `{
  "webhookId": "webhook_456789",
  "status": "active",
  "events": ["lead.created", "estimate.generated"]
}`
          }
        };
      default:
        return null;
    }
  };

  const endpointDetails = getEndpointDetails(activeEndpoint);

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
                API Documentation
              </h1>
              <p className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto">
                Complete API reference for integrating Sunspire&apos;s solar intelligence platform 
                into your applications and workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar - Endpoints */}
              <div className="lg:col-span-1">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Endpoints</h2>
                <div className="space-y-2">
                  {endpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => setActiveEndpoint(endpoint.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeEndpoint === endpoint.id
                          ? "bg-[var(--brand-primary)] text-white"
                          : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{endpoint.name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          activeEndpoint === endpoint.id
                            ? "bg-white/20 text-white"
                            : "bg-neutral-200 text-neutral-600"
                        }`}>
                          {endpoint.method}
                        </span>
                      </div>
                      <p className="text-sm opacity-80">{endpoint.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {endpointDetails && (
                  <div className="space-y-6">
                    <Card>
                      <div className="flex items-center space-x-4 mb-4">
                        <span className={`px-3 py-1 rounded text-sm font-medium ${
                          endpoints.find(e => e.id === activeEndpoint)?.method === 'GET'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {endpoints.find(e => e.id === activeEndpoint)?.method}
                        </span>
                        <code className="text-lg font-mono bg-neutral-100 px-3 py-1 rounded">
                          {endpoints.find(e => e.id === activeEndpoint)?.path}
                        </code>
                      </div>
                      <p className="text-neutral-600">{endpointDetails.description}</p>
                    </Card>

                    {/* Parameters */}
                    <Card>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Parameters</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-neutral-200">
                          <thead>
                            <tr className="bg-neutral-50">
                              <th className="border border-neutral-200 px-4 py-2 text-left">Name</th>
                              <th className="border border-neutral-200 px-4 py-2 text-left">Type</th>
                              <th className="border border-neutral-200 px-4 py-2 text-left">Required</th>
                              <th className="border border-neutral-200 px-4 py-2 text-left">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {endpointDetails.parameters.map((param, index) => (
                              <tr key={index}>
                                <td className="border border-neutral-200 px-4 py-2 font-mono text-sm">
                                  {param.name}
                                </td>
                                <td className="border border-neutral-200 px-4 py-2 text-sm">
                                  {param.type}
                                </td>
                                <td className="border border-neutral-200 px-4 py-2 text-sm">
                                  {param.required ? (
                                    <span className="text-red-600 font-medium">Yes</span>
                                  ) : (
                                    <span className="text-neutral-500">No</span>
                                  )}
                                </td>
                                <td className="border border-neutral-200 px-4 py-2 text-sm">
                                  {param.description}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>

                    {/* Example */}
                    <Card>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Example</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-neutral-900 mb-2">Request</h4>
                          <pre className="bg-neutral-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{endpointDetails.example.request}</code>
                          </pre>
                        </div>
                        <div>
                          <h4 className="font-medium text-neutral-900 mb-2">Response</h4>
                          <pre className="bg-neutral-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{endpointDetails.example.response}</code>
                          </pre>
                        </div>
                      </div>
                    </Card>

                    {/* Authentication */}
                    <Card>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Authentication</h3>
                      <p className="text-neutral-600 mb-4">
                        All API requests require authentication using your API key. Include it in the Authorization header:
                      </p>
                      <code className="text-sm bg-neutral-900 text-green-400 p-2 rounded block">
                        Authorization: Bearer your-api-key-here
                      </code>
                      <p className="text-sm text-neutral-600 mt-4">
                        Get your API key from the <a href="/dashboard" className="text-[var(--brand-primary)] hover:underline">dashboard</a> or contact support.
                      </p>
                    </Card>
                  </div>
                )}
              </div>
            </div>

            {/* Rate Limits & Support */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Rate Limits</h3>
                <ul className="space-y-2 text-neutral-600">
                  <li className="flex items-start">
                    <span className="text-[var(--brand-primary)] mr-2">•</span>
                    <span>Free tier: 100 requests/hour</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--brand-primary)] mr-2">•</span>
                    <span>Pro tier: 1,000 requests/hour</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--brand-primary)] mr-2">•</span>
                    <span>Enterprise: Custom limits</span>
                  </li>
                </ul>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Need Help?</h3>
                <p className="text-neutral-600 mb-4">
                  Our API support team is here to help with integration questions.
                </p>
                <div className="space-y-2">
                  <a 
                    href="mailto:api@getsunspire.com"
                    className="block text-[var(--brand-primary)] hover:underline"
                  >
                    api@getsunspire.com
                  </a>
                  <a 
                    href="/support"
                    className="block text-[var(--brand-primary)] hover:underline"
                  >
                    Create Support Ticket
                  </a>
                </div>
              </Card>
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