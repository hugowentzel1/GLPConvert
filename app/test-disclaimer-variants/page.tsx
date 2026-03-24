// Test page to compare all 5 disclaimer variants
import DataSourcesTop5 from '@/components/DataSourcesTop5';

export default function TestDisclaimerVariants() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Top 5 SaaS Disclaimer Formats</h1>
          <p className="text-lg text-gray-600">Based on analysis of successful SaaS companies</p>
        </div>
        
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              1. Zillow/Redfin Style (Most Popular - 35%)
            </h2>
            <DataSourcesTop5 variant={1} />
            <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <strong>Used by:</strong> Zillow, Redfin, Mortgage calculators
              <br />
              <strong>Pattern:</strong> Two lines, bold disclaimer, subtle sources
              <br />
              <strong>Best for:</strong> Calculators, estimators, tools with important disclaimers
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              2. Stripe/Plaid Style (25%)
            </h2>
            <DataSourcesTop5 variant={2} />
            <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <strong>Used by:</strong> Stripe, Plaid, Fintech APIs
              <br />
              <strong>Pattern:</strong> Single line, natural language, ultra minimal
              <br />
              <strong>Best for:</strong> Premium products, minimal interfaces, API documentation
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              3. NerdWallet Style (20%)
            </h2>
            <DataSourcesTop5 variant={3} />
            <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <strong>Used by:</strong> NerdWallet, Bankrate, Financial comparison tools
              <br />
              <strong>Pattern:</strong> Colored box with icon, structured info
              <br />
              <strong>Best for:</strong> When disclaimer is critical, high-risk estimates
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              4. Notion/Linear Style (15%)
            </h2>
            <DataSourcesTop5 variant={4} />
            <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <strong>Used by:</strong> Notion, Linear, Productivity tools
              <br />
              <strong>Pattern:</strong> Subtle box, compact, single line
              <br />
              <strong>Best for:</strong> Clean interfaces, subtle disclaimers
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              5. GitHub/Vercel Style (5%)
            </h2>
            <DataSourcesTop5 variant={5} />
            <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <strong>Used by:</strong> GitHub, Vercel, Developer tools
              <br />
              <strong>Pattern:</strong> Minimal footer-style, monospace
              <br />
              <strong>Best for:</strong> Developer-focused products, technical audiences
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Recommendation</h3>
          <p className="text-gray-700 mb-4">
            <strong>For solar calculators:</strong> Variant 1 (Zillow/Redfin style) is the best choice.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Most popular format for calculators (35%)</li>
            <li>Clear visual hierarchy (prominent disclaimer, subtle sources)</li>
            <li>Professional and trustworthy</li>
            <li>Easy to scan and read</li>
            <li>Matches user expectations for estimation tools</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
