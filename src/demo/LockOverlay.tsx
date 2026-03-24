"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { getCTA } from "./cta";
import { useABVariant } from "./useABVariant";
import { useCountdown } from "./useCountdown";

export default function LockOverlay() {
  const b = useBrandTakeover();
  const variant = useABVariant();
  const countdown = useCountdown(b.expireDays || 7);

  // Block scrolling and tab focus
  useEffect(() => {
    if (typeof document === "undefined") return;

    document.body.style.overflow = "hidden";
    const focusableElements = document.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select',
    );

    focusableElements.forEach((el) => {
      (el as HTMLElement).setAttribute("tabindex", "-1");
    });

    return () => {
      document.body.style.overflow = "";
      focusableElements.forEach((el) => {
        (el as HTMLElement).removeAttribute("tabindex");
      });
    };
  }, []);

  if (!b.enabled) return null;

  async function openStripeCheckout() {
    try {
      // Collect tracking parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const company = urlParams.get("company");
      const utm_source = urlParams.get("utm_source");
      const utm_campaign = urlParams.get("utm_campaign");

      // Capture current page URL for cancel redirect
      const cancel_url = window.location.href;

      // Start checkout
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "starter",
          token,
          company,
          utm_source,
          utm_campaign,
          cancel_url,
        }),
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Unable to start checkout. Please try again.");
    }
  }

  function openInstallSheet() {
    document.dispatchEvent(
      new CustomEvent("openInstall", {
        detail: { sampleReport: true },
      }),
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.95)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "48px",
          maxWidth: "900px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Brand Logo/Name - Using 4-8px increment spacing */}
        <div style={{ marginBottom: "32px" }}>
          {b.logo ? (
            <Image
              src={b.logo}
              alt={`${b.brand} logo`}
              width={100}
              height={100}
              unoptimized
              className="mx-auto"
              sizes="100vw"
              style={{ height: "auto", width: "auto", marginBottom: "24px" }}
            />
          ) : (
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "20px",
                background: "var(--brand-primary)",
                color: "#ffffff",
                display: "grid",
                placeItems: "center",
                fontSize: "32px",
                fontWeight: "800",
                margin: "0 auto 24px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
              }}
            >
              {b.brand
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join("")}
            </div>
          )}
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#111827",
              marginBottom: "8px",
              lineHeight: "1.2",
            }}
          >
            🚫 Demo limit reached
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "#6B7280",
              margin: "0 0 12px 0",
            }}
          >
            Upgrade to continue
          </p>

          {/* Countdown Timer */}
          <div
            style={{
              background: "var(--brand-primary)",
              color: "#fff",
              padding: "8px 20px",
              borderRadius: "12px",
              display: "inline-block",
              fontSize: "14px",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            {countdown.isExpired
              ? "Demo Expired"
              : `Expires in ${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`}
          </div>
        </div>

        {/* Side-by-side comparison - Using 4-8px increment spacing */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "32px",
            alignItems: "start",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--brand-primary)",
                  marginRight: "8px",
                }}
              ></div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  margin: "0",
                  color: "#DC2626",
                }}
              >
                What You See Now
              </h3>
            </div>
            <div
              style={{
                height: "180px",
                background: "#FEF2F2",
                border: "3px dashed #FCA5A5",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#DC2626",
                fontWeight: "600",
                fontSize: "18px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "64px",
                  opacity: "0.3",
                }}
              >
                🔒
              </div>
              <div style={{ zIndex: 1 }}>Blurred Data</div>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#10B981",
                  marginRight: "8px",
                }}
              ></div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  margin: "0",
                  color: "#10B981",
                }}
              >
                What You Get Live
              </h3>
            </div>
            <div
              style={{
                height: "180px",
                background: "#ECFDF5",
                border: "3px solid #10B981",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#059669",
                fontWeight: "700",
                fontSize: "18px",
                position: "relative",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "64px",
                  opacity: "0.3",
                }}
              >
                ✨
              </div>
              <div style={{ zIndex: 1 }}>Full Reports</div>
            </div>
          </div>
        </div>

        {/* CTA Section - Matches Report Page exactly with brand color box */}
        <div
          style={{
            background: "var(--brand-primary)",
            borderRadius: "24px",
            padding: "40px 32px",
            marginTop: "40px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.07)",
            textAlign: "center",
          }}
        >
          {/* Title */}
          <h2
            style={{
              fontSize: "26px",
              fontWeight: "800",
              color: "#ffffff",
              marginBottom: "20px",
              lineHeight: "1.3",
              letterSpacing: "-0.02em",
            }}
          >
            Ready to Launch Your Branded, Customer-Facing Tool?
          </h2>

          {/* Subtext */}
          <p
            style={{
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.95)",
              marginBottom: "24px",
              lineHeight: "1.6",
              maxWidth: "600px",
              margin: "0 auto 24px",
            }}
          >
            Get the full paid version—customer-facing and under your brand—with
            complete projections, detailed assumptions, and unblurred savings
            charts.
          </p>

          {/* CTA Button */}
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={openStripeCheckout}
              data-cta="primary"
              data-testid="primary-cta-lock"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 32px",
                background: "#ffffff",
                color: "var(--brand-primary)",
                border: "none",
                borderRadius: "16px",
                fontWeight: "700",
                fontSize: "18px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.15)";
              }}
            >
              <span style={{ marginRight: "8px" }}>⚡</span>
              <span>Launch Your Branded Version Now</span>
            </button>
          </div>

          {/* Pricing Line */}
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: "20px",
              fontWeight: "500",
            }}
          >
            $99/mo + $399 setup • Live in 24 hours — or your setup fee is
            refunded..
          </p>

          {/* Comparison Line */}
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.85)",
              fontWeight: "500",
            }}
          >
            Comparable tools cost $2,500+/mo.
          </p>
        </div>
      </div>
    </div>
  );
}
