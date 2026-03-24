"use client";
import React from "react";
import Image from "next/image";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";

export default function SocialProof() {
  const b = useBrandTakeover();

  // Parse optional logos from URL param
  const logos =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
          .get("logos")
          ?.split(",")
          .slice(0, 6) || []
      : [];

  return (
    <div
      style={{
        textAlign: "center",
        padding: "24px 16px",
        background: "#F9FAFB",
        borderRadius: "16px",
        border: "1px solid #E5E7EB",
        margin: "24px 0",
      }}
    >
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{ fontSize: "14px", color: "#6B7280", marginBottom: "8px" }}
        >
          Trusted by 50+ Solar Brands
        </div>
        <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
          Bank-Level Security • SOC 2 Compliant • 98% Accuracy
        </div>
      </div>

      {logos.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {logos.map((logo, i) => (
            <div
              key={i}
              style={{
                width: "32px",
                height: "32px",
                background: "#E5E7EB",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                color: "#6B7280",
              }}
            >
              {logo.includes("http") ? (
                <Image
                  src={logo}
                  alt="Client logo"
                  width={24}
                  height={24}
                  style={{ objectFit: "contain" }}
                />
              ) : (
                logo.slice(0, 2).toUpperCase()
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
