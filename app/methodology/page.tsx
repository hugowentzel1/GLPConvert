'use client';

import { useSearchParams } from 'next/navigation';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import SharedNavigation from '@/components/SharedNavigation';
import Footer from '@/components/Footer';

export default function MethodologyPage() {
  const searchParams = useSearchParams();
  const b = useBrandTakeover();

  // Function to create URLs with preserved parameters
  const createUrlWithParams = (path: string) => {
    const params = new URLSearchParams();
    if (searchParams?.get("company")) params.set("company", searchParams?.get("company") || "");
    if (searchParams?.get("brandColor")) params.set("brandColor", searchParams?.get("brandColor") || "");
    if (searchParams?.get("logo")) params.set("logo", searchParams?.get("logo") || "");
    if (searchParams?.get("primary")) params.set("primary", searchParams?.get("primary") || "");
    if (searchParams?.get("demo")) params.set("demo", searchParams?.get("demo") || "");
    
    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-gray-100 font-inter">
      {/* Set CSS variable for consistent brand colors */}
      <style>{`:root{--brand-primary:${b.primary};}`}</style>
      
      <SharedNavigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Methodology
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            How we calculate solar production, savings, and payback periods using industry-standard data sources.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Data Sources</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Solar Production (NREL PVWatts v8)</h3>
                <p className="text-gray-600 mb-4">
                  We use the National Renewable Energy Laboratory&apos;s PVWatts v8 calculator, the industry standard for solar production estimates. This tool accounts for:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Local weather patterns and historical irradiance data</li>
                  <li>System orientation (tilt and azimuth angles)</li>
                  <li>System capacity and efficiency losses</li>
                  <li>Temperature coefficients and shading factors</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Electricity Rates (EIA Data)</h3>
                <p className="text-gray-600 mb-4">
                  We source current electricity rates from the U.S. Energy Information Administration (EIA), updated monthly:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>State-level average residential electricity rates</li>
                  <li>Time-of-use and tiered rate structures where applicable</li>
                  <li>Historical rate trends and inflation adjustments</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Geographic Data (Google Maps)</h3>
                <p className="text-gray-600 mb-4">
                  Property location and orientation data comes from Google Maps and Google Earth:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Precise latitude and longitude coordinates</li>
                  <li>Roof orientation and tilt angle estimation</li>
                  <li>Local weather station proximity</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Calculation Methods</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Annual Production</h3>
                <p className="text-gray-600">
                  Monthly production is calculated using PVWatts v8, then summed for annual totals. We apply conservative efficiency factors and account for real-world performance degradation.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Financial Calculations</h3>
                <p className="text-gray-600 mb-4">
                  All financial projections use current rates and conservative assumptions:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>25-year system lifetime with 0.5% annual degradation</li>
                  <li>2.5% annual electricity rate inflation</li>
                  <li>Federal tax credit (30% for 2023-2032, then 26%)</li>
                  <li>State and local incentives where applicable</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Payback Period</h3>
                <p className="text-gray-600">
                  Calculated as the point where cumulative savings equal initial investment, accounting for all incentives and financing options.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Accuracy & Limitations</h2>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Our estimates are based on industry-standard models and publicly available data. Actual results may vary due to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Weather variations and climate change impacts</li>
                <li>System installation quality and maintenance</li>
                <li>Changes in electricity rates and policies</li>
                <li>Roof condition and shading changes over time</li>
              </ul>
              <p className="text-gray-600 font-medium">
                These estimates are for informational purposes only and do not constitute a binding quote or guarantee of performance.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href={createUrlWithParams("/")}
            className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-white transition-colors"
            style={{ backgroundColor: b.primary }}
          >
            ← Back to Home
          </a>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
