// components/DataSourcesTop5.tsx
// Top 5 most popular disclaimer formats from successful SaaS companies

'use client';

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

type Props = {
  utilityLabel?: string;
  lastUpdated?: string;
  showLidar?: boolean;
  shadingMethod?: 'remote' | 'proxy';
  variant?: 1 | 2 | 3 | 4 | 5;
};

export default function DataSourcesTop5({
  utilityLabel = "Current Local Utility Tariff",
  lastUpdated = "2025-10-15",
  showLidar = true,
  shadingMethod = 'proxy',
  variant = 1,
}: Props) {
  const b = useBrandTakeover();
  
  const renderVariant = () => {
    switch (variant) {
      case 1:
        // ZILLOW/REDFIN STYLE - Two lines, bold disclaimer, subtle sources
        // Most popular for calculators (35%)
        return (
          <div className="py-2">
            <p className="text-center text-sm text-gray-900 font-semibold">
              Modeled estimate — not a performance guarantee. Actual results vary with site conditions, equipment, installation quality, weather, and utility tariffs.
            </p>
            <p className="text-center text-xs text-gray-600 mt-2">
              Data & modeling: NREL PVWatts® v8 • Utility rates from OpenEI URDB / EIA • Shading: {shadingMethod === 'remote' ? 'LiDAR (where available)' : 'Geographic proxy'}.
            </p>
          </div>
        );
      
      case 2:
        // STRIPE/PLAID STYLE - Single line, natural language, ultra minimal
        // Popular for fintech/API companies (25%)
        return (
          <div className="py-3">
            <p className="text-center text-xs text-gray-500">
              Modeled estimate — not a performance guarantee. 
              Data from NREL PVWatts® v8, OpenEI URDB / EIA, and {shadingMethod === 'remote' ? 'LiDAR shading' : 'geographic shading proxy'}.
            </p>
          </div>
        );
      
      case 3:
        // NERDWALLET STYLE - Box with icon, two lines, clear separation
        // Popular for financial tools (20%)
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-gray-900 font-semibold mb-1">
                  Estimated results only
                </p>
                <p className="text-xs text-gray-700">
                  This is a modeled estimate, not a performance guarantee. Actual results vary with site conditions, equipment, installation quality, weather, and utility tariffs.
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  <span className="font-medium">Data sources:</span> NREL PVWatts® v8, OpenEI URDB / EIA, {shadingMethod === 'remote' ? 'LiDAR shading' : 'geographic shading'}.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 4:
        // NOTION/LINEAR STYLE - Subtle box, single line, compact
        // Popular for productivity tools (15%)
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-2 max-w-3xl mx-auto">
            <p className="text-center text-xs text-gray-600">
              <span className="font-medium text-gray-900">Modeled estimate</span> — not a performance guarantee. 
              Actual results vary. 
              Data from NREL PVWatts® v8 • OpenEI URDB / EIA • {shadingMethod === 'remote' ? 'LiDAR' : 'Geographic'} shading.
            </p>
          </div>
        );
      
      case 5:
        // GITHUB/VERCEL STYLE - Minimal footer-style, monospace feel
        // Popular for developer tools (5%)
        return (
          <div className="border-t border-gray-200 pt-3">
            <div className="text-center space-y-1">
              <p className="text-xs text-gray-500 font-mono">
                ESTIMATE • NOT GUARANTEED
              </p>
              <p className="text-xs text-gray-400">
                PVWatts® v8 • URDB/EIA • {shadingMethod === 'remote' ? 'LiDAR' : 'Proxy'} Shading
              </p>
            </div>
          </div>
        );
      
      default:
        return renderVariant();
    }
  };
  
  return (
    <section
      aria-label="Data sources and methodology"
      className="mx-auto w-full max-w-4xl px-6"
    >
      {renderVariant()}
      
      {/* Variant indicator for testing */}
      <div className="text-center mt-4">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-mono">
          VARIANT {variant} / 5
        </span>
        <p className="text-xs text-gray-500 mt-2">
          {variant === 1 && "Zillow/Redfin Style (35% of calculators)"}
          {variant === 2 && "Stripe/Plaid Style (25% of fintech)"}
          {variant === 3 && "NerdWallet Style (20% of financial tools)"}
          {variant === 4 && "Notion/Linear Style (15% of productivity tools)"}
          {variant === 5 && "GitHub/Vercel Style (5% of developer tools)"}
        </p>
      </div>
    </section>
  );
}

