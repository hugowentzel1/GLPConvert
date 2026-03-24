// components/DataSources.tsx
// Premium, luxurious styling that fits cohesively with the site

'use client';

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

type Props = {
  utilityLabel?: string;
  lastUpdated?: string;
  showLidar?: boolean;
  shadingMethod?: 'remote' | 'proxy';
};

export default function DataSources({
  utilityLabel = "Current Local Utility Tariff",
  lastUpdated = "2025-10-15",
  showLidar = true,
  shadingMethod = 'proxy',
}: Props) {
  const b = useBrandTakeover();
  
  return (
    <section
      aria-label="Data sources and methodology"
      className="mx-auto w-full max-w-4xl px-6"
    >
      <div className="py-3">
        <p className="text-center text-xs text-gray-500">
          Modeled estimate — not a performance guarantee. 
          Data from NREL PVWatts® v8, OpenEI URDB / EIA, and {shadingMethod === 'remote' ? 'LiDAR shading' : 'geographic shading proxy'}.
        </p>
      </div>
    </section>
  );
}
