// components/DataSourcesPro.tsx
// Based on research of top SaaS companies (Stripe, Figma, Linear, GitHub, Notion, Vercel)

'use client';

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

type Props = {
  utilityLabel?: string;
  lastUpdated?: string;
  showLidar?: boolean;
  shadingMethod?: 'remote' | 'proxy';
  style?: 'commas' | 'pipes' | 'minimal';
};

export default function DataSourcesPro({
  utilityLabel = "Current Local Utility Tariff",
  lastUpdated = "2025-10-15",
  showLidar = true,
  shadingMethod = 'proxy',
  style = 'pipes', // Default to pipes like Figma/Linear/GitHub
}: Props) {
  const b = useBrandTakeover();
  
  const sources = [
    "NREL PVWatts® v8",
    "OpenEI URDB", 
    shadingMethod === 'remote' ? 'LiDAR Shading' : 'Geographic Shading',
    "30% Federal ITC"
  ];
  
  const renderSources = () => {
    switch (style) {
      case 'commas':
        // Like Stripe, Vercel, Notion - natural language
        return (
          <span className="text-xs text-gray-700">
            Data from <span className="font-semibold text-gray-900">{sources[0]}</span>, <span className="font-semibold text-gray-900">{sources[1]}</span>, <span className="font-semibold text-gray-900">{sources[2]}</span>, and <span className="font-semibold text-gray-900">{sources[3]}</span>
          </span>
        );
      
      case 'pipes':
        // Like Figma, Linear, GitHub - clean separators
        return sources.map((source, i) => (
          <span key={i}>
            <span className="font-semibold text-gray-900">{source}</span>
            {i < sources.length - 1 && <span className="text-gray-300 mx-3">|</span>}
          </span>
        ));
      
      case 'minimal':
        // Like Stripe payment pages - ultra minimal, spaces only
        return sources.map((source, i) => (
          <span key={i}>
            <span className="font-semibold text-gray-900">{source}</span>
            {i < sources.length - 1 && <span className="mx-4"></span>}
          </span>
        ));
      
      default:
        return sources.map((source, i) => (
          <span key={i}>
            <span className="font-semibold text-gray-900">{source}</span>
            {i < sources.length - 1 && <span className="text-gray-300 mx-3">|</span>}
          </span>
        ));
    }
  };
  
  return (
    <section
      aria-label="Data sources and methodology"
      className="mx-auto mt-16 mb-12 w-full max-w-4xl px-6"
    >
      <div className="py-2">
        <p className="text-center text-sm text-gray-700 mb-3">
          <span className="font-bold text-gray-900">Modeled estimate</span> — not a performance guarantee. 
          Actual results depend on site conditions, equipment, installation quality, weather, and utility tariffs.
        </p>
        <div className="pt-3 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
            {renderSources()}
          </div>
        </div>
      </div>
    </section>
  );
}

