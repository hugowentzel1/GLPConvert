'use client';

import { useState, useEffect } from 'react';
import { getPublicStats, type PublicStats } from '@/src/lib/statsProvider';

/**
 * Hook to fetch public stats once per session
 * Returns stats from single source of truth
 */
export function usePublicStats(): PublicStats | null {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    // Check session storage first
    const cached = sessionStorage.getItem('sunspire-public-stats');
    if (cached) {
      setStats(JSON.parse(cached));
      return;
    }

    // Load stats and cache in session
    const freshStats = getPublicStats();
    setStats(freshStats);
    sessionStorage.setItem('sunspire-public-stats', JSON.stringify(freshStats));
  }, []);

  return stats;
}

