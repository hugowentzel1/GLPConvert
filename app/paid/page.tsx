"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import HeroBrand from "@/src/brand/HeroBrand";
import { useBrandColors } from "@/hooks/useBrandColors";
import { paletteFrom, applyBrandPalette } from "@/utils/theme";
import { usePreviewQuota } from "@/src/demo/usePreviewQuota";
import { useCountdown } from "@/src/demo/useCountdown";
import React from "react";
import { attachCheckoutHandlers } from "@/src/lib/checkout";
import { tid } from "@/src/lib/testids";
import Footer from "@/components/Footer";
import PaidFooter from "@/components/PaidFooter";
import TrustRow from "@/components/trust/TrustRow";
import DemoPreviewTopBar from "@/components/marketing/DemoPreviewTopBar";
import { PRODUCT_NAME } from "@/lib/product-identity";

function buildIntakeHref(
  searchParams: ReturnType<typeof useSearchParams>,
  includeDemo: boolean,
) {
  const p = new URLSearchParams();
  const company = searchParams?.get("company");
  if (company) p.set("company", company);
  const logo = searchParams?.get("logo");
  if (logo) p.set("logo", logo);
  const brandColor = searchParams?.get("brandColor");
  if (brandColor) p.set("brandColor", brandColor);
  const primary = searchParams?.get("primary");
  if (primary) p.set("primary", primary);
  if (includeDemo) {
    const demo = searchParams?.get("demo");
    if (demo) p.set("demo", demo);
  }
  const qs = p.toString();
  return qs ? `/intake?${qs}` : "/intake";
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const b = useBrandTakeover();
  useBrandColors();
  const isDemo = b.isDemo;

  const urlBrandColor =
    searchParams?.get("brandColor") || searchParams?.get("primary");
  const brandColor = urlBrandColor
    ? `#${urlBrandColor.replace("#", "")}`
    : b.primary || "#d97706";

  useEffect(() => {
    if (brandColor) {
      document.documentElement.style.setProperty("--brand-primary", brandColor);
      document.documentElement.style.setProperty("--brand", brandColor);
    }
  }, [brandColor]);

  useEffect(() => {
    if (b.enabled && !isDemo) {
      const palette = paletteFrom(b.primary);
      applyBrandPalette(palette);
    }
  }, [b.enabled, b.primary, isDemo]);

  const { read } = usePreviewQuota(2);
  const remaining = read();
  const countdown = useCountdown(7);

  const intakeHref = useMemo(
    () => buildIntakeHref(searchParams, isDemo),
    [searchParams, isDemo],
  );

  useEffect(() => {
    attachCheckoutHandlers();
  }, []);

  useEffect(() => {
    console.log("[route] hydrated");
    (window as unknown as { __CONTENT_SHOWN__?: boolean }).__CONTENT_SHOWN__ =
      true;
  }, []);

  const handleLaunchClick = async () => {
    if (b.enabled) {
      try {
        const token = searchParams?.get("token");
        const company = searchParams?.get("company");
        const utm_source = searchParams?.get("utm_source");
        const utm_campaign = searchParams?.get("utm_campaign");
        const button = document.querySelector(
          "[data-cta-button]",
        ) as HTMLButtonElement;
        if (button) {
          button.textContent = "Loading...";
          button.disabled = true;
          const response = await fetch("/api/stripe/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              plan: "starter",
              token,
              company,
              utm_source,
              utm_campaign,
            }),
          });
          if (!response.ok) throw new Error("Checkout failed");
          const { url } = await response.json();
          window.location.href = url;
        }
      } catch (e) {
        console.error("Checkout error:", e);
        alert("Unable to start checkout. Please try again.");
      }
    } else {
      router.push("/signup");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-gray-100 font-inter"
      data-demo={isDemo}
    >
      {isDemo && b.enabled ? (
        <DemoPreviewTopBar
          brandName={b.brand || "Your Company"}
          countdown={countdown}
          runsLeft={remaining}
        />
      ) : null}
      <main
        className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
        data-paid-hero={!isDemo}
      >
        <div className="space-y-6 text-center">
          {!isDemo ? (
            <div
              className="mx-auto mt-4 flex max-w-3xl items-center justify-center gap-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900"
              {...tid("live-bar")}
            >
              <span className="mr-2 flex-shrink-0">✅</span>
              <span>
                Live for <b>{b.brand || "Your Company"}</b>. Patient intake is
                branded to you; leads go to your inbox and dashboard.
              </span>
            </div>
          ) : null}

          {isDemo && b.enabled ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl py-6 px-8 border border-gray-200/50 shadow-lg mx-auto max-w-2xl">
              <div className="text-center" {...tid("demo-cta")}>
                <h2 className="text-3xl font-bold text-gray-900">
                  Demo for {b.brand || "Your Company"} —{" "}
                  <span style={{ color: b.primary }}>{PRODUCT_NAME}</span>
                </h2>
                <p className="text-lg text-gray-600 mt-4">
                  Your logo. Your URL. Branded GLP-1 intake and booking — live in
                  24 hours.
                </p>
                <button
                  data-cta="primary"
                  onClick={handleLaunchClick}
                  data-cta-button
                  className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-full border border-transparent px-4 py-4 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                  aria-label="Launch Your Branded Version Now"
                  data-testid="primary-cta-hero"
                >
                  <span className="mr-3">⚡</span>
                  <span>Launch Your Branded Version Now</span>
                </button>
                <p
                  className="mt-6 text-sm text-gray-600"
                  data-testid="microcopy-hero"
                >
                  $99/mo + $399 setup • Live in 24 hours — or your setup fee is
                  refunded.
                </p>
              </div>
            </div>
          ) : null}

          {isDemo ? (
            <div
              className="relative mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${b.primary}, ${b.primary}CC)`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative z-10 text-6xl" aria-hidden>
                ⚕️
              </span>
            </div>
          ) : (
            <HeroBrand />
          )}

          <div className="space-y-6">
            <h1
              className="text-5xl font-black leading-tight text-gray-900 md:text-7xl"
              data-hero-headline
            >
              {isDemo ? (
                <>
                  Your branded GLP intake path
                  <span className="block text-[var(--brand-primary)]">
                    — ready to launch
                  </span>
                </>
              ) : (
                <>Start your intake — branded for your clinic</>
              )}
            </h1>
            <p
              className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 md:text-2xl"
              data-hero-subhead
            >
              {isDemo
                ? "Launch your white-label pre-consult experience in 24 hours. Patients get clarity and consult readiness; you get higher-intent bookings — under your brand."
                : "This page is your patient-facing entry. Continue to the short intake; your team receives structured lead details."}
            </p>
          </div>

          <TrustRow />

          <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200/30 bg-white/80 p-8 shadow-2xl backdrop-blur-xl md:p-12">
            <h2 className="text-2xl font-bold text-gray-900">
              Patient intake
            </h2>
            <p className="mt-3 text-gray-600">
              Opens your branded funnel: education, expectations, and booking
              handoff. Not medical advice — your providers confirm eligibility.
            </p>
            <a
              href={intakeHref}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 sm:w-auto"
              data-testid="paid-intake-cta"
            >
              {isDemo ? "Open demo intake" : "Continue to intake"}
            </a>
          </div>

          {!isDemo ? (
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-white/60 p-8 text-center shadow-sm ring-1 ring-black/5">
                <div className="mb-2 text-2xl font-bold text-gray-900">
                  HIPAA-ready
                </div>
                <div className="text-sm text-gray-600">
                  Posture aligned for PHI workflows
                </div>
              </div>
              <div className="rounded-2xl bg-white/60 p-8 text-center shadow-sm ring-1 ring-black/5">
                <div className="mb-2 text-2xl font-bold text-gray-900">
                  Provider-led
                </div>
                <div className="text-sm text-gray-600">
                  Rules-based copy; no diagnosis on our side
                </div>
              </div>
              <div className="rounded-2xl bg-white/60 p-8 text-center shadow-sm ring-1 ring-black/5">
                <div className="mb-2 text-2xl font-bold text-gray-900">
                  CRM handoff
                </div>
                <div className="text-sm text-gray-600">
                  Email + dashboard + optional sync
                </div>
              </div>
            </div>
          ) : null}

          {isDemo ? (
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-4">
              {[
                ["HIPAA-ready", "Security posture"],
                ["SOC 2 aligned", "Controls you expect"],
                ["CRM ready", "HubSpot, Salesforce"],
                ["24/7", "Email support"],
              ].map(([t, s]) => (
                <div
                  key={t}
                  className="rounded-2xl border border-gray-200/50 bg-white/60 p-8 text-center backdrop-blur-sm"
                >
                  <div className="mb-2 text-2xl font-black text-gray-900">
                    {t}
                  </div>
                  <div className="font-semibold text-gray-600">{s}</div>
                </div>
              ))}
            </div>
          ) : null}

          {isDemo ? (
            <div
              className="mx-auto max-w-5xl section-spacing"
              {...tid("howitworks-section")}
            >
              <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
                How it works
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] to-white text-lg font-bold text-gray-900 shadow-lg">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Embed or host
                  </h3>
                  <p className="text-gray-600">
                    One script tag or hosted link — your brand, your domain.
                  </p>
                </div>
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] to-white text-lg font-bold text-gray-900 shadow-lg">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Patients complete intake
                  </h3>
                  <p className="text-gray-600">
                    Structured steps with compliance-safe language.
                  </p>
                </div>
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] to-white text-lg font-bold text-gray-900 shadow-lg">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    You get qualified handoffs
                  </h3>
                  <p className="text-gray-600">
                    Leads in your inbox and dashboard, ready for consult.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {isDemo ? (
            <div className="mx-auto max-w-4xl section-spacing" {...tid("pricing-section")}>
              <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
                Frequently asked questions
              </h2>
              <div className="space-y-6 text-left">
                <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-6 backdrop-blur-sm">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Is this medical advice?
                  </h3>
                  <p className="text-gray-600">
                    No. {PRODUCT_NAME} supports education, intake, and booking
                    only. Licensed providers decide eligibility.
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-6 backdrop-blur-sm">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    How fast is setup?
                  </h3>
                  <p className="text-gray-600">
                    Most clinics go live within 24 hours with your branding.
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-6 backdrop-blur-sm">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Security?
                  </h3>
                  <p className="text-gray-600">
                    Encrypted in transit; SOC 2–aligned practices. You control
                    your CRM and data policies.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      {isDemo ? <Footer /> : <PaidFooter />}
    </div>
  );
}

export default function PaidHome() {
  return <HomeContent />;
}
