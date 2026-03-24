"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { PRODUCT_NAME, PLATFORM_DISPLAY_NAME, SUPPORT_EMAIL } from "@/lib/product-identity";

interface SmartFooterProps {
  variant?: "full" | "slim" | "none";
  companyName?: string;
}

export default function SmartFooter({
  variant,
  companyName,
}: SmartFooterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const b = useBrandTakeover();

  // Auto-detect footer type based on context
  const getFooterType = (): "full" | "slim" | "none" => {
    if (variant) return variant;

    // Demo/report pages with company personalization
    if (
      pathname?.includes("/demo") ||
      pathname?.includes("/report") ||
      pathname?.includes("/result") ||
      pathname?.includes("/tenant-preview") ||
      searchParams?.get("company")
    ) {
      return "slim";
    }

    // Main marketing pages
    if (
      ["/", "/pricing", "/partners", "/support", "/methodology"].includes(
        pathname || "",
      )
    ) {
      return "full";
    }

    // Legal/compliance pages
    if (
      [
        "/privacy",
        "/terms",
        "/dpa",
        "/status",
        "/preferences",
        "/unsubscribe",
      ].includes(pathname || "")
    ) {
      return "full";
    }

    // Default to full footer
    return "full";
  };

  const footerType = getFooterType();

  if (footerType === "none") {
    return null;
  }

  const company = companyName || (b.enabled ? b.brand : undefined);

  if (footerType === "slim") {
    return (
      <footer className="bg-gradient-to-b from-gray-50 via-white to-gray-100 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Slim footer for demo/report pages */}
          <div className="text-center space-y-4">
            {/* Essential links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a
                href="/terms"
                className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors"
              >
                Terms
              </a>
              <a
                href="/privacy"
                className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors"
              >
                Privacy
              </a>
              <a
                href="/methodology"
                className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors"
              >
                Methodology
              </a>
              <a
                href="/support"
                className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors"
              >
                Contact
              </a>
            </div>

            {/* Demo disclaimer */}
            {company && (
              <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
                Logos shown for demo only; not affiliated with {company}.
              </div>
            )}

            {/* Powered by */}
            <div className="text-xs text-gray-400">
              {PLATFORM_DISPLAY_NAME}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Full footer (default)
  return (
    <footer className="bg-gradient-to-b from-gray-50 via-white to-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {PRODUCT_NAME}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mx-auto max-w-xs">
              White-label intake and booking layer for GLP-1 and medical weight-loss programs.
              Not medical advice — a licensed provider determines final eligibility.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm text-gray-600">
                1700 Northside Drive Suite A7 #5164 Atlanta, GA 30318
              </span>
            </div>
            <div className="flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm text-gray-600">{SUPPORT_EMAIL}</span>
            </div>
            <div className="flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="text-sm text-gray-600">+1 (404) 770-2672</span>
            </div>
          </div>

          {/* Quick Links & Legal */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Quick Links</h4>
            <div className="space-y-2">
              <a
                href="/pricing"
                className="block text-sm text-gray-600 hover:text-[var(--brand-primary)] transition-colors"
              >
                Pricing
              </a>
              <a
                href="/partners"
                className="block text-sm text-gray-600 hover:text-[var(--brand-primary)] transition-colors"
              >
                Partners
              </a>
              <a
                href="/support"
                className="block text-sm text-gray-600 hover:text-[var(--brand-primary)] transition-colors"
              >
                Support
              </a>
            </div>
            <h4 className="font-semibold text-gray-900 mt-4">
              Legal & Support
            </h4>
            <div className="space-y-2">
              <a
                href="/privacy"
                className="block text-sm text-gray-600 hover:text-[var(--brand-primary)] transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="block text-sm text-gray-600 hover:text-[var(--brand-primary)] transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/methodology"
                className="block text-sm text-gray-600 hover:text-[var(--brand-primary)] transition-colors"
              >
                Methodology
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center mt-12 pt-10 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-sm text-gray-500">Powered by AI</span>
          </div>

          <div className="hidden md:inline text-gray-300">•</div>

          <div className="flex items-center gap-4">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <span className="text-sm text-gray-500">SOC 2 Compliant</span>
          </div>

          <div className="hidden md:inline text-gray-300">•</div>

          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} {PRODUCT_NAME} / Wellspire LLC. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
