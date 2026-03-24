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
    console.log('🔧 fetchTenantData called for:', companyHandle);
    try {
      // In production, this fetches from Supabase via API
      // For now, generate the data based on company handle
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      
      console.log('🔧 Setting tenant data...');
      setTenantData({
        company: companyHandle,
        instantUrl: `${baseUrl}/${companyHandle}`,
        customDomain: `quote.${companyHandle}.com`,
        embedCode: `<iframe 
  src="${baseUrl}/${companyHandle}" 
  width="100%" 
  height="600" 
  frameborder="0"
  title="${companyHandle} — ${'GLPConvert'} intake">
</iframe>`,
        apiKey: 'sk_' + Math.random().toString(36).substring(2, 50),
        status: 'active'
      });
      console.log('🔧 Setting isLoading to false...');
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
        // FOR DEMO: Allow access without token (remove in production)
        console.log('⚠️ DEMO MODE: Allowing access without token');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tenantData?.company} Dashboard
              </h1>
              <p className="text-gray-600">
                Your branded GLPConvert intake funnel is live — leads route to your inbox and dashboard.
              </p>
            </div>
            <div className="flex items-center">
              <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                ✅ {tenantData?.status}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Instant URL */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <span className="text-2xl">📍</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Instant URL</h2>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              Share this link anywhere - social media, ads, email campaigns:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              <code className="text-black text-sm break-all">
                {tenantData?.instantUrl}
              </code>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(tenantData?.instantUrl, 'url')}
                style={{ backgroundColor: 'var(--brand-primary, #667eea)' }}
                className="flex-1 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                {copiedItem === 'url' ? '✅ Copied!' : 'Copy URL'}
              </button>
              <a
                href={tenantData?.instantUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: 'var(--brand-primary, #667eea)' }}
                className="flex-1 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity text-center"
              >
                Visit Site
              </a>
            </div>
          </div>

          {/* Embed Code */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <span className="text-2xl">💻</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Embed Code</h2>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              Paste this code on any page of your website:
            </p>
            
            <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
              <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap break-all">
{tenantData?.embedCode}
              </pre>
            </div>
            
            <button
              onClick={() => copyToClipboard(tenantData?.embedCode, 'embed')}
              style={{ backgroundColor: 'var(--brand-primary, #667eea)' }}
              className="w-full text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {copiedItem === 'embed' ? '✅ Code Copied!' : 'Copy Embed Code'}
            </button>
          </div>

          {/* Custom Domain */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <span className="text-2xl">🌐</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Custom Domain</h2>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              Your professional domain:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              <code className="text-black text-sm break-all">
                {tenantData?.customDomain}
              </code>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-yellow-800 text-sm">
                Status: <strong>{tenantData?.domainStatus}</strong>
              </p>
            </div>
            
            <Link
              href={`/docs/setup?company=${companyHandle}`}
              style={{ backgroundColor: 'var(--brand-primary, #667eea)' }}
              className="w-full inline-block text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity text-center"
            >
              Setup Instructions
            </Link>
          </div>

          {/* API Key */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center mr-3">
                <span className="text-2xl">🔑</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">API Key</h2>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              For advanced integrations and custom development:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              <code className="text-gray-800 text-xs font-mono break-all">
                {tenantData?.apiKey}
              </code>
            </div>
            
            <button
              onClick={() => copyToClipboard(tenantData?.apiKey, 'api')}
              style={{ backgroundColor: 'var(--brand-primary, #667eea)' }}
              className="w-full text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {copiedItem === 'api' ? '✅ Copied!' : 'Copy API Key'}
            </button>
          </div>

        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Need Help?
          </h3>
          <p className="text-gray-600 mb-4">
            Check out our documentation or contact support
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/docs/setup"
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              📚 Documentation
            </Link>
            <Link
              href="/support"
              style={{ backgroundColor: 'var(--brand-primary, #667eea)' }}
              className="text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              💬 Contact Support
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Bookmark this page for easy access to your dashboard</p>
          <p className="mt-2">
            <Link href="/privacy" className="text-black hover:opacity-70">Privacy</Link> •{' '}
            <Link href="/terms" className="text-black hover:opacity-70">Terms</Link> •{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-black hover:opacity-70">{SUPPORT_EMAIL}</a>
          </p>
        </div>

      </div>
    </div>
  );
}

