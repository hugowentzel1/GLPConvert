"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

interface StripeCheckoutButtonProps {
  companyHandle: string;
  plan: "Starter" | "Growth" | "Scale";
  payerEmail: string;
  brandColors?: string;
  logoURL?: string;
  className?: string;
  children?: React.ReactNode;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export function StripeCheckoutButton({
  companyHandle,
  plan,
  payerEmail,
  brandColors,
  logoURL,
  className = "",
  children,
}: StripeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      // Collect tracking parameters from URL
      const params = new URLSearchParams(window.location.search);
      const payload = {
        plan: plan.toLowerCase(),
        company: params.get("company") || companyHandle || "Demo",
        token: params.get("token") || undefined,
        utm_source: params.get("utm_source") || undefined,
        utm_campaign: params.get("utm_campaign") || undefined,
        cancel_url: window.location.href, // Capture current page for cancel redirect
      };

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanPrice = (plan: string) => {
    switch (plan) {
      case "Starter":
        return "$99";
      case "Growth":
        return "$199";
      case "Scale":
        return "$499";
      default:
        return "$99";
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className={`px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Processing...</span>
        </div>
      ) : (
        children || `⚡ Launch Your Branded Version Now`
      )}
    </button>
  );
}

// Alternative: Simple checkout button for existing tenants
export function SimpleCheckoutButton({
  plan,
  className = "",
  children,
}: {
  plan: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      // Collect tracking parameters from URL
      const params = new URLSearchParams(window.location.search);
      const payload = {
        plan: plan.toLowerCase(),
        company: params.get("company") || "Demo",
        token: params.get("token") || undefined,
        utm_source: params.get("utm_source") || undefined,
        utm_campaign: params.get("utm_campaign") || undefined,
        cancel_url: window.location.href, // Capture current page for cancel redirect
      };

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className={`px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? "Processing..." : children || `Upgrade to ${plan}`}
    </button>
  );
}
