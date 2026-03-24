/**
 * Single source of truth for public stats
 * Used by homepage KPIs and sidebar CTA
 */

export interface PublicStats {
  installersLive: number;
  quotesThisMonth: number;
  avgQuoteTimeSec: number;
  uptimePct: number;
}

// Single source of truth - update this to change stats everywhere
const STATS: PublicStats = {
  installersLive: 113,
  quotesThisMonth: 28417,
  avgQuoteTimeSec: 45,
  uptimePct: 99.8,
};

export function getPublicStats(): PublicStats {
  return { ...STATS };
}

