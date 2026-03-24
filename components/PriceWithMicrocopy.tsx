import React from "react";

type Props = {
  priceText: string;
  idSuffix?: string;
  className?: string;
};

export default function PriceWithMicrocopy({
  priceText,
  idSuffix = "default",
  className = "",
}: Props) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-800 ${className}`}
      data-testid={`price-microcopy-${idSuffix}`}
      aria-label="Pricing and launch assurance"
    >
      <span className="font-medium" data-testid={`price-${idSuffix}`}>{priceText}</span>
      <span aria-hidden>•</span>
      <span className="text-neutral-700" data-testid={`microcopy-${idSuffix}`}>
        Launch now — live on your domain in 24 hours.
      </span>
    </div>
  );
}
