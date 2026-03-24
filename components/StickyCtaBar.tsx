// SUNSPIRE: shared sticky CTA bar - simple button only
import React from "react";

export default function StickyCtaBar({
  label,
  testId,
  className = "",
  onClick,
}: { 
  label: string; 
  testId?: string; 
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-sm supports-[padding:max(0px)]:pb-[max(env(safe-area-inset-bottom),16px)] shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t border-gray-200 ${className}`}
      data-testid={testId}
      role="region"
      aria-label="Sticky action"
    >
      <div className="mx-auto max-w-screen-sm px-4 py-3">
        <button 
          onClick={onClick}
          data-cta="primary"
          data-cta-button
          className="w-full h-12 rounded-xl px-5 text-white font-semibold hover:opacity-90 transition-all active:scale-[0.98]"
          style={{
            background: "var(--brand-primary, #2563eb)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
          }}
        >
          {label}
        </button>
      </div>
    </div>
  );
}


