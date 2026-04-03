'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
// Verify magic link token (client-side version)
function verifyMagicLink(token: string): { email: string; company: string } | null {
  try {
    // Use atob for browser-compatible base64 decoding
    const decoded = JSON.parse(atob(token.replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check if token is less than 7 days old
    const age = Date.now() - decoded.timestamp;
    if (age > 7 * 24 * 60 * 60 * 1000) {
      return null; // Expired
    }
    
    return { email: decoded.email, company: decoded.company };
  } catch {
    return null;
  }
}
import Link from 'next/link';
import { SUPPORT_EMAIL } from '@/lib/product-identity';

export default function CompanyDashboard() {
  const params = useParams();
  const searchParams = useSearchParams();
  const companyHandle = params?.companyHandle as string;
  const token = searchParams?.get('token');
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tenantData, setTenantData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const fetchTenantData = useCallback(async () => {
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

      setTenantData({
        company: companyHandle,
        instantUrl: `${baseUrl}/intake?handle=${encodeURIComponent(companyHandle)}&company=${encodeURIComponent(companyHandle)}`,
        embedCode: `<iframe src="${baseUrl}/intake?handle=${encodeURIComponent(companyHandle)}" width="100%" height="720" style="border:0" title="Intake"></iframe>`,
        status: 'active',
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      setError('Failed to load tenant data');
      setIsLoading(false);
    }
  }, [companyHandle]);

  useEffect(() => {
    // Verify magic link token
    if (token) {
      const verified = verifyMagicLink(token);
      if (verified && verified.company === companyHandle) {
        setIsAuthenticated(true);
        // Store auth in sessionStorage
        sessionStorage.setItem(`auth:${companyHandle}`, 'true');
      } else {
        console.error('Token verification failed:', { verified, companyHandle });
        setError('Invalid or expired link');
      }
    } else {
      // Check if already authenticated
      const hasAuth = sessionStorage.getItem(`auth:${companyHandle}`);
      if (hasAuth) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(true);
      }
    }

    // Fetch tenant data
    fetchTenantData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, companyHandle]);

  const copyToClipboard = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemName);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Required
          </h1>
          <p className="text-gray-600 mb-6">
            {error || 'Please use the magic link sent to your email to access this dashboard.'}
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{tenantData?.company}</h1>
              <p className="mt-1 text-sm text-slate-600">Intake overview — leads and handoffs</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              {tenantData?.status}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              [
                ["Intake starts", "—"],
                ["Completions", "—"],
                ["Leads", "—"],
                ["Bookings", "—"],
              ] as const
            ).map(([label, val]) => (
              <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900">{val}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-[11px] text-slate-400">
            Live counts when your tenant backend is connected. Use Leads for submissions now.
          </p>

          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
            <h2 className="text-sm font-semibold text-slate-900">Patient intake link</h2>
            <p className="mt-1 text-xs text-slate-600">Use on ads, landers, or email. Branding comes from your tenant settings.</p>
            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
              <code className="break-all text-xs text-slate-800">{tenantData?.instantUrl}</code>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => copyToClipboard(tenantData?.instantUrl, "url")}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {copiedItem === "url" ? "Copied" : "Copy link"}
              </button>
              <a
                href={tenantData?.instantUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Open intake
              </a>
              <Link
                href={`/c/${companyHandle}/leads`}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                View leads
              </Link>
            </div>
          </div>

          <details className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
            <summary className="cursor-pointer font-semibold text-slate-800">Embed on your site</summary>
            <p className="mt-2 text-xs text-slate-600">Paste into an HTML block. Adjust height to fit your layout.</p>
            <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-slate-900 p-3 text-[11px] text-emerald-300">
              {tenantData?.embedCode}
            </pre>
            <button
              type="button"
              onClick={() => copyToClipboard(tenantData?.embedCode, "embed")}
              className="mt-2 text-xs font-semibold text-slate-700 underline"
            >
              {copiedItem === "embed" ? "Copied" : "Copy embed code"}
            </button>
          </details>

          <div className="mt-8 flex flex-wrap justify-center gap-4 border-t border-slate-100 pt-6 text-sm">
            <Link href="/support" className="font-medium text-slate-700 hover:text-slate-900">
              Support
            </Link>
            <Link href="/contact" className="font-medium text-slate-700 hover:text-slate-900">
              Contact
            </Link>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-slate-700 hover:text-slate-900">
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

