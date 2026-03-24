type Props = {
  headline: string;            // concise metric/outcome
  support?: string;            // single sentence
  name: string;                // e.g., "Operations Manager"
  roleAndLocation: string;     // e.g., "Texas solar installer"
  verified?: boolean;          // default true
  logoSrc?: string;            // optional mono logo on right
  logoAlt?: string;
};

export default function QuoteCard({
  headline, support, name, roleAndLocation, verified = true, logoSrc, logoAlt,
}: Props) {
  return (
    <figure
      data-testid="quote-card"
      className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 md:p-7 shadow-sm hover:shadow-md transition-shadow"
      style={{ minHeight: '200px' }}
    >
      {/* Quote with proper quotation marks - italic for authenticity */}
      <blockquote className="sun-quote flex-1">
        <p className="text-[16px] md:text-[17px] leading-[1.65] text-neutral-800 italic">
          &ldquo;{headline} {support}&rdquo;
        </p>
      </blockquote>

      {/* Attribution pinned to bottom with separator line */}
      <figcaption className="mt-auto pt-4 border-t border-neutral-100">
        <div className="flex items-center justify-center gap-3">
          <div
            data-testid="quote-attribution-row"
            className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] text-neutral-600"
          >
            <span className="font-medium text-neutral-900">{name}</span>
            <span className="text-neutral-300">•</span>
            <span>{roleAndLocation}</span>

            {verified && (
              <>
                <span className="text-neutral-300">•</span>
                <span
                  data-testid="verified-chip"
                  title="Verified installer quote"
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
                >
                  <span className="text-emerald-600" aria-hidden>✓</span>
                  Verified
                </span>
              </>
            )}
          </div>
          {logoSrc ? (
            <img src={logoSrc} alt={logoAlt || ""} className="h-5 opacity-60" />
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}
