"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { PlaceResult } from "@/lib/types";
import CookieBanner from "@/components/CookieBanner";
import DisclaimerBar from "@/components/DisclaimerBar";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import HeroBrand from "@/src/brand/HeroBrand";
import { useBrandColors } from "@/hooks/useBrandColors";
import { paletteFrom, applyBrandPalette } from "@/utils/theme";
import StickyBar from "@/components/StickyBar";
import { usePreviewQuota } from "@/src/demo/usePreviewQuota";
import { useCountdown } from "@/src/demo/useCountdown";
import { useIsDemo } from "@/src/lib/isDemo";
import { isDemoFromSearch } from "@/lib/isDemo";
import React from "react";
import { attachCheckoutHandlers } from "@/src/lib/checkout";
import { tid } from "@/src/lib/testids";
import Footer from "@/components/Footer";
import PaidFooter from "@/components/PaidFooter";

const AddressAutocomplete = dynamic(
  () => import("@/components/AddressAutocomplete"),
  {
    ssr: false,
    loading: () => (
      <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
    ),
  },
);

function HomeContent() {
  console.log("[route] render start");

  const [address, setAddress] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showSampleReportModal, setShowSampleReportModal] = useState(false);
  const [sampleReportSubmitted, setSampleReportSubmitted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Brand takeover mode detection
  const b = useBrandTakeover();

  // Apply brand colors from URL parameters
  useBrandColors();

  // Demo mode detection - use brand state instead of separate hook
  const isDemo = b.isDemo;

  // Get brand color directly from URL for server-side rendering
  const urlBrandColor = searchParams?.get('brandColor') || searchParams?.get('primary');
  const brandColor = urlBrandColor ? `#${urlBrandColor.replace('#', '')}` : (b.primary || '#d97706');
  
  // Set CSS variable directly for consistency
  useEffect(() => {
    if (brandColor) {
      document.documentElement.style.setProperty('--brand-primary', brandColor);
      document.documentElement.style.setProperty('--brand', brandColor);
    }
  }, [brandColor]);

  // Debug logging for brand state
  useEffect(() => {
    console.log("Paid page brand state:", b);
    console.log(
      "Paid page localStorage:",
      localStorage.getItem("sunspire-brand-takeover"),
    );
    console.log("Paid page isDemo:", isDemo);
    console.log("Paid page b.enabled:", b.enabled);
    console.log("Paid page b.brand:", b.brand);
    console.log("Paid page b.logo:", b.logo);
    console.log("Paid page searchParams:", {
      company: searchParams?.get("company"),
      brandColor: searchParams?.get("brandColor"),
      logo: searchParams?.get("logo"),
      demo: searchParams?.get("demo")
    });
  }, [b, isDemo, searchParams]);

  // Brand colors from URL
  useBrandColors();

  // Apply brand palette for paid experience
  useEffect(() => {
    if (b.enabled && !isDemo) {
      const palette = paletteFrom(b.primary);
      applyBrandPalette(palette);
    }
  }, [b.enabled, b.primary, isDemo]);

  const { read, consume } = usePreviewQuota(2);
  const remaining = read();
  const countdown = useCountdown(7);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Attach checkout handlers to CTAs
  useEffect(() => {
    attachCheckoutHandlers();
  }, []);

  // Function to create URLs with preserved parameters
  const createUrlWithParams = (path: string) => {
    const params = new URLSearchParams();
    if (searchParams?.get("company")) params.set("company", searchParams?.get("company") || "");
    if (searchParams?.get("brandColor")) params.set("brandColor", searchParams?.get("brandColor") || "");
    if (searchParams?.get("logo")) params.set("logo", searchParams?.get("logo") || "");
    if (searchParams?.get("demo")) params.set("demo", searchParams?.get("demo") || "");

    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  const handleAddressSelect = (result: any) => {
    console.log("🔍 handleAddressSelect called with:", result);
    setAddress(result.formattedAddress);
    setSelectedPlace(result);

    if (b.enabled && isClient) {
      // Track address selection for paid experience
      console.log("Address selected for paid experience:", result);
    }

    // Automatically navigate to report page when address is selected from dropdown
    if (result.formattedAddress && result.formattedAddress.trim()) {
      console.log("🚀 Auto-navigating to report page for address:", result.formattedAddress);
      
      // Use the same logic as handleGenerateEstimate but with the selected place
      const q = new URLSearchParams({
        address: result.formattedAddress,
        lat: String(result.lat || 40.7128),
        lng: String(result.lng || -74.0060),
        placeId: result.placeId || "demo",
      });

      // Add all URL parameters
      if (searchParams?.get("company")) q.set("company", searchParams?.get("company") || "");
      if (searchParams?.get("demo")) q.set("demo", searchParams?.get("demo") || "");
      if (searchParams?.get("brandColor")) q.set("brandColor", searchParams?.get("brandColor") || "");
      if (searchParams?.get("logo")) q.set("logo", searchParams?.get("logo") || "");

      console.log("Navigating to report with selected place:", q.toString());
      router.push(`/report?${q.toString()}`);
    }
  };

  const handleGenerateEstimate = () => {
    if (!address || !address.trim()) return;

    console.log("Generating estimate for address:", address);
    console.log("Selected place:", selectedPlace);

    // Check and consume quota
    if (b.enabled) {
      const currentQuota = read();
      console.log("🔒 Paid page quota check - currentQuota:", currentQuota);

      // Consume demo quota first
      consume();
      const newQuota = read();
      console.log("🔒 Paid page quota consumed, remaining:", newQuota);

      // If quota is now negative, navigate to lockout page
      if (newQuota < 0) {
        console.log("🔒 Quota exhausted after consumption, navigating to report page to show lockout");
        // Navigate to report page which will show lockout overlay
        const q = new URLSearchParams({
          address: address || "123 Main St",
          lat: "40.7128",
          lng: "-74.0060",
          placeId: "demo",
        });

        // Add all URL parameters
        if (searchParams?.get("company")) q.set("company", searchParams?.get("company") || "");
        if (searchParams?.get("demo")) q.set("demo", searchParams?.get("demo") || "");
        if (searchParams?.get("brandColor")) q.set("brandColor", searchParams?.get("brandColor") || "");
        if (searchParams?.get("logo")) q.set("logo", searchParams?.get("logo") || "");

        router.push(`/report?${q.toString()}`);
        return;
      }
    }

    setIsLoading(true);

    try {
      if (selectedPlace && selectedPlace.formattedAddress) {
        const q = new URLSearchParams({
          address: selectedPlace.formattedAddress,
          lat: String(selectedPlace.lat),
          lng: String(selectedPlace.lng),
          placeId: selectedPlace.placeId,
        });

        // Add all URL parameters
        if (searchParams?.get("company")) q.set("company", searchParams?.get("company") || "");
        if (searchParams?.get("demo")) q.set("demo", searchParams?.get("demo") || "");
        if (searchParams?.get("brandColor")) q.set("brandColor", searchParams?.get("brandColor") || "");
        if (searchParams?.get("logo")) q.set("logo", searchParams?.get("logo") || "");

        console.log("Navigating to report with selected place:", q.toString());
        router.push(`/report?${q.toString()}`);
      } else {
        const q = new URLSearchParams({
          address,
          lat: "40.7128",
          lng: "-74.0060",
          placeId: "demo",
        });

        // Add all URL parameters
        if (searchParams?.get("company")) q.set("company", searchParams?.get("company") || "");
        if (searchParams?.get("demo")) q.set("demo", searchParams?.get("demo") || "");
        if (searchParams?.get("brandColor")) q.set("brandColor", searchParams?.get("brandColor") || "");
        if (searchParams?.get("logo")) q.set("logo", searchParams?.get("logo") || "");

        console.log("Navigating to report with manual address:", q.toString());
        router.push(`/report?${q.toString()}`);
      }
    } catch (error) {
      console.error("Error generating estimate:", error);
      setIsLoading(false);
    }
  };

  const handleLaunchClick = async () => {
    if (b.enabled) {
      // Start Stripe checkout with tracking
      try {
        // Collect tracking parameters from URL
        const token = searchParams?.get("token");
        const company = searchParams?.get("company");
        const utm_source = searchParams?.get("utm_source");
        const utm_campaign = searchParams?.get("utm_campaign");

        // Show loading state
        const button = document.querySelector("[data-cta-button]") as HTMLButtonElement;
        if (button) {
          const originalText = button.textContent;
          button.textContent = "Loading...";
          button.disabled = true;

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
            }),
          });

          if (!response.ok) {
            throw new Error("Checkout failed");
          }

          const { url } = await response.json();
          window.location.href = url;
        }
      } catch (error) {
        console.error("Checkout error:", error);
        alert("Unable to start checkout. Please try again.");
      }
    } else {
      // Route to signup page for non-branded experience
      router.push(createUrlWithParams("/signup"));
    }
  };

  // Add debug markers and content shown sentinel - force redeploy
  useEffect(() => {
    console.log("[route] hydrated");
    (window as any).__CONTENT_SHOWN__ = true;
  }, []);

  const initials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-gray-100 font-inter"
      data-demo={isDemo}
    >
      <main
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        data-paid-hero={!isDemo}
      >
        <div className="text-center space-y-6">
          {/* Remove internal/ops copy from paid UI */}

          {/* HERO ICON: Show company logo in paid mode, sun icon in demo */}
          {isDemo ? (
            <div
              className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${b.primary}, ${b.primary}CC)`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="text-6xl relative z-10">☀️</span>
            </div>
          ) : (
            <HeroBrand />
          )}

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -top-6 -right-12 w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#10B981' }}>
                <span className="text-white text-lg">✓</span>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">
                {isDemo ? (
                  <>
                    Your Branded Solar Quote Tool
                    <span className="block text-[var(--brand-primary)]">
                      — Ready to Launch
                    </span>
                  </>
                ) : (
                  <>Instant Solar Analysis for Your Home</>
                )}
              </h1>
              <p
                className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                data-hero-subhead
              >
                {isDemo
                  ? `Launch your branded solar quote tool in 24 hours — no coding, no hassle. Capture more leads, book more consultations, and close more installs under your company's name.`
                  : "Enter your address to see solar production, savings, and payback—instantly."}
              </p>
            </div>
          </div>


          <div className="flex flex-wrap justify-center gap-8 text-sm section-spacing">
            {/* Tenant trust badges are removed as per edit hint */}
            {/* {tenant.trustBadges.slice(0, 3).map((badge, index) => ( */}
            {/*   <div key={index} className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-200/50"> */}
            {/*     <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div> */}
            {/*     <span className="font-semibold text-gray-700">{badge}</span> */}
            {/*   </div> */}
            {/* ))} */}
          </div>

          {/* Address Input Section - Exact match to aa28acf */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/30 p-6 md:p-8 max-w-3xl mx-auto section-spacing">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Enter Your Property Address
                </h2>
                <p className="text-gray-600">
                  Get a comprehensive solar analysis tailored to your specific
                  location
                </p>
              </div>

              <div className="space-y-6">
                {/* Address Input - Show for both demo and regular modes */}
                <div className="w-full max-w-2xl mx-auto">
                  <div className="relative">
                    <AddressAutocomplete
                      id="address-input"
                      value={address}
                      onChange={setAddress}
                      onSelect={handleAddressSelect}
                      data-testid="paid-address-input"
                      data-address-input
                      placeholder={
                        b.city
                          ? `Start typing an address in ${b.city}...`
                          : "Start typing your property address..."
                      }
                      className="w-full"
                      aria-label="Enter Your Property Address"
                    />
                    <div 
                      className="pointer-events-none absolute right-3 -bottom-5 text-[11px] text-gray-400"
                      data-testid="powered-by-google"
                    >
                      Powered by Google
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-8">
                    We only use your address to estimate sun, rates, and savings. Nothing is shared.
                  </p>
                  {address &&
                    address.length > 0 &&
                    !address.includes("@") &&
                    address.split(" ").length < 2 && (
                      <p className="text-sm text-amber-600 mt-4 mb-4 text-center">
                        Please enter a complete street address
                      </p>
                    )}
                </div>

                {/* Generate Button - Now below the search bar */}
                <div className="mt-14">
                <button
                  onClick={
                    address && address.trim()
                      ? handleGenerateEstimate
                      : b.enabled
                        ? handleLaunchClick
                        : handleGenerateEstimate
                  }
                  disabled={!address || !address.trim() || isLoading}
                  data-testid="paid-generate-btn"
                  data-cta-button
                  {...tid("cta-primary")}
                  className={`w-full ${
                    !address || !address.trim() || isLoading ? "btn-disabled" : "btn-cta"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing Your Property...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-4">
                      <span>
                        {isDemo
                          ? address && address.trim()
                            ? `Generate Solar Report`
                            : `Launch Tool`
                          : "Generate Solar Report"}
                      </span>
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  )}
                </button>
                </div>

                {isDemo && (
                  <div className="text-sm text-gray-500 text-center space-y-2">
                    {remaining > 0 ? (
                      <>
                        <p>
                          Preview: {remaining} run{remaining === 1 ? "" : "s"}{" "}
                          left.
                        </p>
                        <p>
                          Expires in {countdown.days}d {countdown.hours}h{" "}
                          {countdown.minutes}m {countdown.seconds}s
                        </p>
                      </>
                    ) : (
                      <div className="font-semibold" style={{ color: b.primary }}>
                        <p>🚫 Demo limit reached</p>
                        <p>Launch to get full access</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Credibility section - only show homeowner-relevant info in paid mode */}
          {!isDemo && (
            <div className="max-w-5xl mx-auto section-spacing">
              {/* Top row - 3 cards without icons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="rounded-2xl p-8 shadow-sm bg-white/60 ring-1 ring-black/5 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    NREL v8
                  </div>
                  <div className="text-sm text-gray-600">Accurate Modeling</div>
                </div>
                <div className="rounded-2xl p-8 shadow-sm bg-white/60 ring-1 ring-black/5 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    Current Rates
                  </div>
                  <div className="text-sm text-gray-600">
                    Local Utility Data
                  </div>
                </div>
                <div className="rounded-2xl p-8 shadow-sm bg-white/60 ring-1 ring-black/5 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    Private
                  </div>
                  <div className="text-sm text-gray-600">Encrypted</div>
                </div>
              </div>

              {/* Bottom row - 2 original cards with icons, centered together */}
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-6 max-w-2xl">
                  <div className="feature-card p-5 text-center">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-2xl flex items-center justify-center shadow-lg">
                      <svg
                        className="w-6 h-6 text-gray-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div className="title">NREL PVWatts® v8</div>
                    <div className="desc">
                      Industry-standard solar modeling with current utility
                      rates
                    </div>
                  </div>
                  <div className="feature-card p-5 text-center">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-2xl flex items-center justify-center shadow-lg">
                      <svg
                        className="w-6 h-6 text-gray-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <div className="title">End-to-End Encryption</div>
                    <div className="desc">Secure data protection</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Demo badges - only show in demo mode */}
          {isDemo && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto section-spacing">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center">
                <div className="text-4xl font-black text-gray-900 mb-2">
                  NREL v8
                </div>
                <div className="text-gray-600 font-semibold">
                  Industry Standard
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center">
                <div className="text-4xl font-black text-gray-900 mb-2">
                  SOC 2
                </div>
                <div className="text-gray-600 font-semibold">Compliance</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center">
                <div className="text-4xl font-black text-gray-900 mb-2">
                  CRM Ready
                </div>
                <div className="text-gray-600 font-semibold">
                  HubSpot, Salesforce
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center">
                <div className="text-4xl font-black text-gray-900 mb-2">
                  24/7
                </div>
                <div className="text-gray-600 font-semibold">Support</div>
              </div>
            </div>
          )}

          {/* How It Works Section - Demo only */}
          {isDemo && (
            <div
              className="max-w-5xl mx-auto section-spacing"
              {...tid("howitworks-section")}
            >
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-2xl flex items-center justify-center text-gray-900 font-bold text-lg shadow-lg">
                    <span>1</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Add the widget
                  </h3>
                  <p className="text-gray-600">
                    One line of code to embed on your website
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-2xl flex items-center justify-center text-gray-900 font-bold text-lg shadow-lg">
                    <span>2</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Visitors get instant quotes
                  </h3>
                  <p className="text-gray-600">
                    AI-powered analysis in seconds
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-2xl flex items-center justify-center text-gray-900 font-bold text-lg shadow-lg">
                    <span>3</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Your team gets qualified leads
                  </h3>
                  <p className="text-gray-600">
                    Qualified leads ready to convert
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Section - Demo only */}
          {isDemo && (
            <div
              className="max-w-4xl mx-auto section-spacing"
              {...tid("pricing-section")}
            >
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    CMS? — Yes, 1-line &lt;script&gt;. Hosted option too.
                  </h3>
                  <p className="text-gray-600">
                    Works with any website platform. Just add one line of code.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Accuracy? — NREL PVWatts v8 • EIA rates • local irradiance
                  </h3>
                  <p className="text-gray-600">
                    Industry-standard data sources.{" "}
                    <a
                      href={createUrlWithParams("/methodology")}
                      className="text-[var(--brand-primary)] hover:underline"
                    >
                      View methodology
                    </a>
                    .
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Security? — Encrypted in transit & at rest
                  </h3>
                  <p className="text-gray-600">
                    Bank-level security for all customer data.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Cancel? — Yes, cancel anytime. Setup fee refunded if not live in 24 hours
                  </h3>
                  <p className="text-gray-600">
                    No long-term contracts. Cancel anytime.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Support? — Email support 24/7
                  </h3>
                  <p className="text-gray-600">
                    Get help whenever you need it.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sample Report Modal */}
      {showSampleReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            {!sampleReportSubmitted ? (
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Request Sample Report
                </h3>
                <p className="text-gray-600">
                  Get a detailed sample report to see the full capabilities of
                  our solar analysis platform.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSampleReportSubmitted(true);
                    setTimeout(() => {
                      setShowSampleReportModal(false);
                      setSampleReportSubmitted(false);
                    }, 3000);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-lg text-white font-semibold transition-colors"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                  >
                    Submit Request
                  </button>
                </form>
                <button
                  onClick={() => setShowSampleReportModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: `${b.primary}20` }}>
                  <svg
                    className="w-8 h-8"
                    style={{ color: b.primary }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Sample Report Requested!
                </h3>
                <p className="text-gray-600">
                  Thanks for reaching out! We&apos;ll send your sample report to
                  your email within 24 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Use PaidFooter for paid mode (demo=0), regular Footer for demo mode */}
      {isDemo ? <Footer /> : <PaidFooter />}
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}// Force deployment Fri Sep 19 23:06:28 EDT 2025
