"use client";
import React from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";

export default function StickyBuyBar() {
  const b = useBrandTakeover();
  if (!b.enabled) return null;

  function openInstall() {
    document.dispatchEvent(new CustomEvent("openInstall"));
  }

  function copy() {
    navigator.clipboard.writeText(window.location.href);
  }

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: "flex",
        gap: 10,
        justifyContent: "center",
        padding: "10px",
        background: "rgba(255,255,255,.92)",
        borderTop: "1px solid #eee",
        backdropFilter: "saturate(1.1) blur(4px)",
      }}
    >
      <button
        onClick={openInstall}
        style={{
          padding: "8px 16px",
          background: "var(--brand-primary)",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        Add to Your Site
      </button>
      <button
        onClick={copy}
        style={{
          padding: "8px 16px",
          background: "#f8fafc",
          color: "#374151",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        Copy link
      </button>
    </div>
  );
}
