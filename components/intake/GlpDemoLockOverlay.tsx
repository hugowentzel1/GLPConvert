"use client";

/**
 * GlpDemoLockOverlay — the locked-out state for the GLPConvert branded demo.
 *
 * The demo funnel (`GlpSimulationFunnel`) gives a cold-outreach prospect two
 * preview runs (tracked client-side via `usePreviewQuota`, key `demo_quota_v5`).
 * On the third attempt this full-screen overlay replaces the funnel and routes
 * the prospect straight to Stripe checkout.
 *
 * Self-contained on purpose: it takes brand props directly from the funnel
 * (company / brandFill / logo) instead of the legacy `useBrandTakeover` system,
 * so there is no legacy brand-system coupling.
 */

import { useEffect, type CSSProperties, type MouseEvent } from "react";

type GlpDemoLockOverlayProps = {
  company: string;
  brandFill: string;
  logo?: string | null;
  /** Fallback href if the Stripe POST fails (handled inside onActivate). */
  activateHref: string;
  onActivate: (e: MouseEvent<HTMLAnchorElement>) => void;
  activating?: boolean;
};

export default function GlpDemoLockOverlay({
  company,
  brandFill,
  logo,
  activateHref,
  onActivate,
  activating = false,
}: GlpDemoLockOverlayProps) {
  // Lock background scroll while the overlay is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const monogram =
    company
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "GC";

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.94)",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    overflowY: "auto",
  };

  const cardStyle: CSSProperties = {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "40px 32px",
    maxWidth: "560px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.45)",
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Demo preview limit reached" style={overlayStyle}>
      <div style={cardStyle}>
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt={`${company} logo`}
            width={72}
            height={72}
            style={{ height: "auto", width: "72px", margin: "0 auto 20px", display: "block" }}
          />
        ) : (
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "16px",
              background: brandFill,
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              fontSize: "26px",
              fontWeight: 800,
              margin: "0 auto 20px",
            }}
          >
            {monogram}
          </div>
        )}

        <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", lineHeight: 1.25, margin: "0 0 12px" }}>
          That was your last preview run for {company}.
        </h2>

        <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.6, margin: "0 0 8px" }}>
          This branded intake is capped at two preview runs. To keep it, activate it as the real intake page for{" "}
          {company}. Your logo, your colors, and your booking link, live within 24 hours.
        </p>

        <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.6, margin: "0 0 24px" }}>
          Every day the preview stays a preview, you keep paying for clicks that never book.
        </p>

        <div
          style={{
            background: brandFill,
            borderRadius: "20px",
            padding: "28px 24px",
            textAlign: "center",
          }}
        >
          <a
            href={activateHref}
            onClick={onActivate}
            data-testid="demo-lock-activate"
            aria-disabled={activating}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "15px 30px",
              background: "#ffffff",
              color: brandFill,
              borderRadius: "14px",
              fontWeight: 700,
              fontSize: "17px",
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.18)",
              opacity: activating ? 0.7 : 1,
              pointerEvents: activating ? "none" : "auto",
            }}
          >
            <span aria-hidden="true">⚡</span>
            <span>{activating ? "Starting checkout..." : `Activate ${company}'s Branded Version`}</span>
          </a>

          <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.92)", fontWeight: 500, margin: "16px 0 0" }}>
            $99/mo plus $399 setup. Live within 24 hours. No sales call.
          </p>
        </div>
      </div>
    </div>
  );
}
