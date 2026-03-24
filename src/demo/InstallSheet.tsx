/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { track } from "./track";

export default function InstallSheet() {
  const b = useBrandTakeover();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"hosted" | "embed">("hosted");
  const [plan, setPlan] = useState<"monthly" | "annual">("monthly");
  const [subdomain, setSubdomain] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const on = (e: CustomEvent) => {
      setOpen(true);
      track("drawer_open", {
        brand: b.brand || undefined,
        domain: b.domain || undefined,
      });
    };
    document.addEventListener("openInstall", on as EventListener);
    return () =>
      document.removeEventListener("openInstall", on as EventListener);
  }, [b.brand, b.domain]);

  useEffect(() => {
    if (b.enabled && b.pilot) setOpen(true);
  }, [b.enabled, b.pilot]);

  // Set default subdomain
  useEffect(() => {
    if (b.domain) {
      setSubdomain(`solar.${b.domain}`);
    } else if (b.brand) {
      setSubdomain(`solar.${b.brand.toLowerCase().replace(/\s+/g, "")}`);
    }
  }, [b.domain, b.brand]);

  if (!b.enabled || !open) return null;

  async function handleCheckout() {
    setIsSubmitting(true);
    track("checkout_start", {
      brand: b.brand || undefined,
      domain: b.domain || undefined,
      plan,
      subdomain,
    });

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "lease",
          domain: b.domain || b.brand,
          subdomain,
          planType: plan,
          email: "", // Will be collected by Stripe
          utm: {
            source: "demo_install",
            medium: "modal",
            campaign: "install_sheet",
          },
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error("Checkout failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const validateSubdomain = (value: string) => {
    return (
      /^[a-z0-9-]+$/.test(value) && value.length >= 3 && value.length <= 63
    );
  };

  const isSubdomainValid = validateSubdomain(subdomain);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.35)",
          zIndex: 1100,
          display: "grid",
          placeItems: "end",
        }}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(520px,96vw)",
            background: "#fff",
            height: "100%",
            padding: 24,
            overflow: "auto",
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Launch Your Solar Tool
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("hosted")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "hosted"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Hosted
            </button>
            <button
              onClick={() => setActiveTab("embed")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "embed"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Embed
            </button>
          </div>

          {/* Hosted Tab */}
          {activeTab === "hosted" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subdomain
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">https://</span>
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      isSubdomainValid ? "border-gray-300" : "border-red-300"
                    }`}
                    placeholder="solar.yourdomain"
                  />
                  <span className="text-gray-500">.sunspire.app</span>
                </div>
                {!isSubdomainValid && subdomain && (
                  <p className="text-sm text-red-600 mt-1">
                    Subdomain must be 3-63 characters, lowercase letters,
                    numbers, and hyphens only
                  </p>
                )}
              </div>

              {/* Plan Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Plan
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPlan("monthly")}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      plan === "monthly"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-lg font-semibold text-gray-900">
                      $99/mo + $399 setup
                    </div>
                  </button>
                  <button
                    onClick={() => setPlan("annual")}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      plan === "annual"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-lg font-semibold text-gray-900">
                      $999/yr + $399 setup
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      Save vs monthly
                    </div>
                  </button>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Full projections & assumptions
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Bank-level security
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Live in minutes
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    14-day refund
                  </li>
                </ul>
              </div>

              {/* Primary Button */}
              <button
                onClick={handleCheckout}
                disabled={!isSubdomainValid || isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all ${
                  !isSubdomainValid || isSubmitting
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700 transform hover:scale-[1.02]"
                }`}
              >
                {isSubmitting ? "Processing..." : "Start 14-Day Trial"}
              </button>

              {/* Billing Note */}
              <div className="text-xs text-gray-500 text-center">
                {plan === "monthly"
                  ? "We'll charge the $99/mo + $399 setup today. Your plan continues at $99/mo after the trial."
                  : "We'll charge the $99/mo + $399 setup + $999/yr today."}
              </div>
            </div>
          )}

          {/* Embed Tab */}
          {activeTab === "embed" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  1-line script + div
                </h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <code className="text-green-400 text-sm">
                    &lt;script src="https://{subdomain || "solar.yourdomain"}
                    .sunspire.app/embed.js"&gt;&lt;/script&gt;
                  </code>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `<script src="https://${subdomain || "solar.yourdomain"}.sunspire.app/embed.js"></script>`,
                      )
                    }
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Copy Script
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Add this div where you want the widget
                </h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <code className="text-green-400 text-sm">
                    &lt;div id="sunspire-quote-widget"&gt;&lt;/div&gt;
                  </code>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        '<div id="sunspire-quote-widget"></div>',
                      )
                    }
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Copy Div
                  </button>
                </div>
              </div>

              {/* Same pricing and benefits as hosted */}
              <div className="border-t pt-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Full projections & assumptions
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Bank-level security
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Live in minutes
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      14-day refund
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all ${
                    isSubmitting
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-orange-600 hover:bg-orange-700 transform hover:scale-[1.02]"
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Start 14-Day Trial"}
                </button>

                <div className="text-xs text-gray-500 text-center mt-3">
                  {plan === "monthly"
                    ? "We'll charge the $99/mo + $399 setup today. Your plan continues at $99/mo after the trial."
                    : "We'll charge the $99/mo + $399 setup + $999/yr today."}
                </div>
              </div>
            </div>
          )}

          {/* Helper Links */}
          <div className="border-t pt-6 mt-6">
            <div className="flex justify-center space-x-6 text-sm">
              <a
                href="https://docs.sunspire.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Docs
              </a>
              <a
                href="mailto:support@sunspire.app"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Email support
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
