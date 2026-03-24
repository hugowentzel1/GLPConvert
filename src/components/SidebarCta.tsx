'use client';

import { usePublicStats } from '@/src/hooks/usePublicStats';
import { Counter } from '@/src/components/Counter';
import './sidebar-cta.css';

interface SidebarCtaProps {
  brandName: string;
  onCtaClick: () => void;
}

/**
 * Optimized sticky sidebar CTA for demo reports
 * Industry-leading conversion UX
 */
export function SidebarCta({ brandName, onCtaClick }: SidebarCtaProps) {
  const stats = usePublicStats();

  if (!stats) return null;

  return (
    <div className="sidebar-cta" data-sidebar-cta>
      <div className="sidebar-cta-content">
        <h3 className="sidebar-cta-title">
          This demo is already branded for {brandName}.
        </h3>

        <button
          onClick={onCtaClick}
          data-cta="primary"
          className="sidebar-cta-button"
        >
          <span className="sidebar-cta-button-text">
            ⚡ Launch Your Branded Version Now
          </span>
        </button>

        <div className="sidebar-cta-metric" data-sidebar-metric="installersLive">
          <Counter value={stats.installersLive} suffix="+" className="sidebar-cta-metric-value" />
          <span className="sidebar-cta-metric-label"> installers live today</span>
        </div>

        <div className="sidebar-cta-trust" data-sidebar-trust>
          SOC2 • GDPR • NREL PVWatts®
        </div>
      </div>
    </div>
  );
}

