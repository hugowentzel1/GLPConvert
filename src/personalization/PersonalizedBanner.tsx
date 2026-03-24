"use client";

import React, { useState } from "react";
import { usePersonalizationCtx } from "./PersonalizationContext";

export default function PersonalizedBanner() {
  const { brand, isPersonalized } = usePersonalizationCtx();
  const [hidden, setHidden] = useState(false);
  if (!isPersonalized || hidden) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Capture the copy action
      fetch("/api/demo-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Demo User",
          email: "demo@example.com",
          domain: window.location.hostname,
          brand,
          primary: "demo_banner_copy",
          logo: null,
          demoLink: window.location.href,
          source: "demo_banner",
        }),
      }).catch(console.error);
    } catch {}
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        background: "white",
        borderRadius: 12,
        padding: "10px 14px",
        boxShadow: "0 8px 30px rgba(0,0,0,.12)",
        display: "flex",
        gap: 12,
        alignItems: "center",
        fontSize: 14,
      }}
      role="status"
      aria-live="polite"
    >
      <span style={{ fontWeight: 600 }}>
        {brand ?? "Your Company"} — Demo Mode
      </span>
      <span style={{ opacity: 0.7 }}>
        Pre-branded preview. Not a contract quote.
      </span>
      <button
        onClick={() => (window.location.href = "/?demo=1")}
        style={{
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid #eee",
          cursor: "pointer",
        }}
      >
        Put this on our site
      </button>
      <button
        onClick={copy}
        style={{
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid #eee",
          cursor: "pointer",
        }}
      >
        Copy demo link
      </button>
      <button
        onClick={() => setHidden(true)}
        aria-label="Dismiss banner"
        style={{
          padding: 6,
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </div>
  );
}
