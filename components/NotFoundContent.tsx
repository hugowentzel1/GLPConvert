"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { isIntakeBrandedMarketingMode } from "@/lib/glp-intake-demo-mode";
import { buildAppHomeHref, buildBrandedDemoReturnHref } from "@/lib/glp-intake-nav-href";

/**
 * 404 body: “home” link preserves demo / company query when in branded preview, so users don’t
 * drop `demo=1` and branding by landing on `/` from a bad link.
 */
export default function NotFoundContent() {
  const sp = useSearchParams();
  const usp = sp ? new URLSearchParams(sp.toString()) : null;
  const marketing = isIntakeBrandedMarketingMode(usp);
  const homeHref = marketing ? buildBrandedDemoReturnHref(sp) : buildAppHomeHref(sp);
  const cta = marketing ? "Back to intake preview" : "Return home";

  const h =
    typeof globalThis !== "undefined" ? globalThis.location?.hostname : undefined;
  const onLoopback = h === "localhost" || h === "127.0.0.1" || h === "[::1]";
  const showLocalhostHint = Boolean(
    onLoopback && typeof globalThis !== "undefined" && !globalThis.location?.port,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-4">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        {showLocalhostHint ? (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200/80 rounded-lg px-3 py-2 mb-6">
            If you&apos;re running the app locally, open it with the port from your terminal (for example{" "}
            <span className="whitespace-nowrap font-mono text-amber-900">http://localhost:3000</span>
            ) — not <span className="font-mono">http://localhost</span> alone.
          </p>
        ) : null}
        <Link
          href={homeHref}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[var(--brand-primary)] hover:opacity-90 transition-opacity"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
