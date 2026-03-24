import Link from 'next/link';
import clsx from 'clsx';
import PriceWithMicrocopy from '@/components/PriceWithMicrocopy';

type BottomCtaBandProps = {
  variant: 'home' | 'report';
  onClickPath?: string;
  /** When set (e.g. report demo), use button that triggers checkout instead of Link */
  onLaunchClick?: () => void;
  className?: string;
  'data-testid'?: string;
};

export default function BottomCtaBand({
  variant,
  onClickPath = '/api/stripe/create-checkout-session',
  onLaunchClick,
  className,
  'data-testid': dataTestId,
}: BottomCtaBandProps) {
  const isReport = variant === 'report';

  const title = isReport
    ? 'Ready to Launch Your Branded, Customer-Facing Tool?'
    : 'Launch Your Branded Version Now';

  const subtext = isReport
    ? 'Get the full paid version—customer-facing and under your brand—with complete projections, detailed assumptions, and unblurred savings charts.'
    : 'Go live in under 24 hours with branded solar quotes on your own domain.';

  const buttonLabel = isReport
    ? 'Launch Your Branded Version Now'
    : 'Launch Your Branded Version Now';

  // Show comparison for report variant
  const comparisonLine = isReport ? 'Comparable tools cost $2,500+/mo.' : null;

  return (
    <section
      role="region"
      aria-labelledby="cta-band-title"
      className={clsx(
        'rounded-3xl bg-[var(--brand-600)] text-white px-6 md:px-10 py-10 md:py-12 max-w-[1200px] mx-auto shadow-[0_10px_30px_rgba(0,0,0,0.07)]',
        className
      )}
      data-testid={dataTestId ?? 'bottom-cta-band'}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 id="cta-band-title" className="text-2xl md:text-3xl font-extrabold tracking-[-0.02em] mb-6">
          {title}
        </h2>
        <p className="text-base md:text-lg opacity-90 mb-6">{subtext}</p>

        <div className="mb-5">
          {onLaunchClick ? (
            <button
              type="button"
              onClick={onLaunchClick}
              aria-label={buttonLabel}
              className="inline-flex items-center justify-center rounded-2xl px-6 md:px-8 py-4 text-base md:text-lg font-semibold bg-white text-[var(--brand-700)] hover:bg-white/95 transition"
              data-testid="bottom-cta-button"
            >
              {buttonLabel}
            </button>
          ) : (
            <Link
              href={onClickPath}
              aria-label={buttonLabel}
              className="inline-flex items-center justify-center rounded-2xl px-6 md:px-8 py-4 text-base md:text-lg font-semibold bg-white text-[var(--brand-700)] hover:bg-white/95 transition"
              data-testid="bottom-cta-button"
            >
              {buttonLabel}
            </Link>
          )}
        </div>

        <p className="text-sm text-white/90 mb-5">
          $99/mo + $399 setup • Live in 24 hours — or your setup fee is refunded..
        </p>

        {comparisonLine && (
          <p className="text-sm md:text-base opacity-80" data-testid="bottom-cta-footer">
            {comparisonLine}
          </p>
        )}
      </div>
    </section>
  );
}
