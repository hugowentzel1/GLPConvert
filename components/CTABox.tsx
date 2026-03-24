import React from 'react';

type CTABoxProps = {
  priceLine?: string;
  idSuffix: string;
  showNoCardLine?: boolean;
  compact?: boolean;
  onClick?: () => void;
};

export default function CTABox({
  priceLine,
  idSuffix,
  showNoCardLine = false,
  compact = false,
  onClick,
}: CTABoxProps) {
  return (
    <div data-testid={`cta-box-${idSuffix}`} className="space-y-4">
      {/* Optional Price Line */}
      {priceLine && (
        <p 
          data-testid={`price-line-${idSuffix}`}
          className={`${compact ? 'text-sm' : 'text-base'} font-semibold text-gray-900`}
        >
          {priceLine}
        </p>
      )}

      {/* Primary CTA Button */}
      <button
        onClick={onClick}
        data-cta="primary"
        data-cta-button
        aria-label="Start activation — demo expires soon"
        data-testid={`primary-cta-${idSuffix}`}
        className={`inline-flex items-center justify-center ${
          compact ? 'px-4 py-3 text-sm' : 'px-6 py-4 text-base'
        } rounded-full font-medium text-white border border-transparent shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer button-press`}
        style={{ backgroundColor: 'var(--brand-primary)' }}
      >
        <span className="mr-3">⚡</span>
        <span>Launch Your Branded Version Now</span>
      </button>

      {/* Microcopy */}
      <p 
        data-testid={`microcopy-${idSuffix}`}
        className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600`}
      >
        Live in 24 hours — or your setup fee is refunded.
      </p>

      {/* Optional No Card Line */}
      {showNoCardLine && (
        <p 
          data-testid={`nocard-${idSuffix}`}
          className="text-xs text-gray-500"
        >
          No credit card required.
        </p>
      )}
    </div>
  );
}

