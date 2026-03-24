// components/DataSourcesVariants.tsx
// Show all 10 ways to divide data sources

'use client';

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

type Props = {
  utilityLabel?: string;
  lastUpdated?: string;
  showLidar?: boolean;
  shadingMethod?: 'remote' | 'proxy';
  variant?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
};

export default function DataSourcesVariants({
  utilityLabel = "Current Local Utility Tariff",
  lastUpdated = "2025-10-15",
  showLidar = true,
  shadingMethod = 'proxy',
  variant = 1,
}: Props) {
  const b = useBrandTakeover();
  
  const sources = [
    "NREL PVWatts® v8",
    "OpenEI URDB", 
    shadingMethod === 'remote' ? 'LiDAR Shading' : 'Geographic Shading',
    "30% Federal ITC"
  ];
  
  const renderDividers = () => {
    switch (variant) {
      case 1: // Bullet Points
        return sources.map((source, i) => (
          <span key={i}>
            <span className="font-semibold text-gray-900">{source}</span>
            {i < sources.length - 1 && <span className="text-gray-400 mx-2">•</span>}
          </span>
        ));
      
      case 2: // Middle Dots (current)
        return sources.map((source, i) => (
          <span key={i}>
            <span className="font-semibold text-gray-900">{source}</span>
            {i < sources.length - 1 && <span className="text-gray-400 mx-2">·</span>}
          </span>
        ));
      
      case 3: // Vertical Lines
        return sources.map((source, i) => (
          <span key={i}>
            <span className="font-semibold text-gray-900">{source}</span>
            {i < sources.length - 1 && <span className="text-gray-300 mx-3">|</span>}
          </span>
        ));
      
      case 4: // Forward Slashes
        return sources.map((source, i) => (
          <span key={i}>
            <span className="font-semibold text-gray-900">{source}</span>
            {i < sources.length - 1 && <span className="text-gray-400 mx-2">/</span>}
          </span>
        ));
      
      case 5: // Commas
        return sources.map((source, i) => (
          <span key={i}>
            <span className="font-semibold text-gray-900">{source}</span>
            {i < sources.length - 1 && <span className="text-gray-500 mx-1">,</span>}
          </span>
        ));
      
      case 6: // Spaces Only
        return sources.map((source, i) => (
          <span key={i}>
            <span className="font-semibold text-gray-900">{source}</span>
            {i < sources.length - 1 && <span className="mx-2"></span>}
          </span>
        ));
      
      case 7: // Company Color Dots
        return sources.map((source, i) => (
          <span key={i}>
            <span className="font-semibold text-gray-900">{source}</span>
            {i < sources.length - 1 && (
              <span 
                className="mx-2 w-1 h-1 rounded-full inline-block" 
                style={{ backgroundColor: b.primary }}
              ></span>
            )}
          </span>
        ));
      
      case 8: // Small Icons
        return sources.map((source, i) => (
          <span key={i}>
            <span className="font-semibold text-gray-900">{source}</span>
            {i < sources.length - 1 && <span className="text-gray-400 mx-2">⚡</span>}
          </span>
        ));
      
      case 9: // Brackets
        return sources.map((source, i) => (
          <span key={i}>
            <span className="font-semibold text-gray-900">{source}</span>
            {i < sources.length - 1 && <span className="text-gray-400 mx-1">] [</span>}
          </span>
        ));
      
      case 10: // Parentheses
        return sources.map((source, i) => (
          <span key={i}>
            <span className="font-semibold text-gray-900">{source}</span>
            {i < sources.length - 1 && <span className="text-gray-400 mx-1">) (</span>}
          </span>
        ));
      
      default:
        return sources.map((source, i) => (
          <span key={i}>
            <span className="font-semibold text-gray-900">{source}</span>
            {i < sources.length - 1 && <span className="text-gray-400 mx-2">·</span>}
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
            {renderDividers()}
          </div>
        </div>
      </div>
    </section>
  );
}
