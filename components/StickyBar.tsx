"use client";

import { useState, useEffect } from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { useIsDemo } from "@/src/lib/isDemo";

export default function StickyBar({
  ctaUrl = "/book",
  onEmail,
}: {
  ctaUrl?: string;
  onEmail?: () => void;
}) {
  const b = useBrandTakeover();
  const isDemo = useIsDemo();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Show sticky bar when user has scrolled past 35% of the viewport height
      if (scrollY > windowHeight * 0.35) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Only show in demo mode, never in paid mode
  if (!isVisible || !isDemo) return null;

  const handleEmailPDF = async () => {
    try {
      // Track the event
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "report_email_sent", {
          event_category: "engagement",
          event_label: "sticky_bar",
        });
      }

      // Get current report data from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const address = urlParams.get("address");
      const company = urlParams.get("company");

      // Call the email report API
      const response = await fetch("/api/email-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          company,
          source: "sticky_bar",
        }),
      });

      if (response.ok) {
        // Show success message
        const button = document.querySelector(
          "[data-email-pdf]",
        ) as HTMLButtonElement;
        if (button) {
          const originalText = button.textContent;
          button.textContent = "Email sent!";
          button.disabled = true;
          setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
          }, 3000);
        }
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Email PDF error:", error);
      alert("Unable to send email. Please try again.");
    }
  };

  const handleConsultationClick = () => {
    // Track the event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "consult_click", {
        event_category: "engagement",
        event_label: "sticky_bar",
      });
    }

    // Use the provided ctaUrl or default behavior
    if (ctaUrl && ctaUrl !== "/book") {
      window.location.href = ctaUrl;
    } else {
      // Default: scroll to top to show the address form
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      data-sticky-bar
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-semibold text-gray-900">
              Ready to get started?
            </h3>
            <p className="text-xs text-gray-600">
              Book a consultation or get your report via email
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onEmail || handleEmailPDF}
              data-email-pdf
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2"
            >
              📧 Email PDF
            </button>
            <button
              onClick={handleConsultationClick}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2"
              style={{
                backgroundColor: "var(--brand)",
                color: "var(--on-brand)",
              }}
            >
              📅 Book Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
