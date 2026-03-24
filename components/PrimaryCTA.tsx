import React from "react";

type PrimaryCTAProps = {
  id?: string;
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  href?: string;
  label?: string;
  className?: string;
  withLightning?: boolean;
  ariaLabel?: string;
};

const DEFAULT_LABEL = "Launch Your Branded Version Now";

export function PrimaryCTA({
  id,
  onClick,
  href,
  label = DEFAULT_LABEL,
  className = "",
  withLightning = true,
  ariaLabel,
}: PrimaryCTAProps) {
  const content = (
    <span className="cta__inner" aria-hidden={ariaLabel ? "true" : undefined}>
      {withLightning && (
        <span className="cta__icon" role="img" aria-label="fast">
          ⚡
        </span>
      )}
      <span className="cta__text">{label}</span>
    </span>
  );

  return href ? (
    <a id={id} href={href} aria-label={ariaLabel} className={`cta ${className}`}>
      {content}
    </a>
  ) : (
    <button id={id} type="button" onClick={onClick} aria-label={ariaLabel} className={`cta ${className}`}>
      {content}
    </button>
  );
}

export const CTA_SUBCOPY = "Live in 24 hours — or your setup fee is refunded.";
