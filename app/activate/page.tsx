'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

function ActivateLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading activation details...</p>
      </div>
    </div>
  );
}

function ActivateContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const b = useBrandTakeover();
  
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [tenantSlug, setTenantSlug] = useState<string>('');
  const [customDomain, setCustomDomain] = useState('');
  const [domainStatus, setDomainStatus] = useState<'idle' | 'verifying' | 'attaching' | 'attached' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'instant' | 'domain' | 'embed'>('instant');
  const [isLoading, setIsLoading] = useState(true);

  const companyFromUrl = searchParams?.get('company') || '';

  const fetchSessionDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/stripe/session?session_id=${sessionId}`);
      const data = await response.json();
      setSessionDetails(data);

      const company = data.metadata?.company || companyFromUrl || 'your-company';
      const slug = company.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') || 'your-company';
      setTenantSlug(slug);
    } catch (error) {
      console.error('Error fetching session details:', error);
      const slug = (companyFromUrl || 'your-company').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') || 'your-company';
      setTenantSlug(slug);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, companyFromUrl]);

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails();
    } else {
      const slug = (companyFromUrl || 'your-company').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') || 'your-company';
      setTenantSlug(slug);
      setIsLoading(false);
    }
  }, [sessionId, fetchSessionDetails, companyFromUrl]);

  const handleVerifyDomain = async () => {
    if (!customDomain) return;
    
    setDomainStatus('verifying');
    try {
      const response = await fetch('/api/domains/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: customDomain })
      });
      
      const result = await response.json();
      if (result.verified) {
        setDomainStatus('attaching');
        await handleAttachDomain();
      } else {
        setDomainStatus('error');
      }
    } catch (error) {
      console.error('Domain verification failed:', error);
      setDomainStatus('error');
    }
  };

  const handleAttachDomain = async () => {
    try {
      const response = await fetch('/api/domains/attach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          domain: customDomain,
          tenantSlug: tenantSlug
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setDomainStatus('attached');
      } else {
        setDomainStatus('error');
      }
    } catch (error) {
      console.error('Domain attachment failed:', error);
      setDomainStatus('error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activation details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Your Solar Tool is Ready!
          </h1>
          <p className="text-lg text-gray-600">
            Your tool is live. New leads go to your inbox and dashboard—optional CRM sync if you use one.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('instant')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'instant'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Instant URL
            </button>
            <button
              onClick={() => setActiveTab('domain')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'domain'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Custom Domain
            </button>
            <button
              onClick={() => setActiveTab('embed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'embed'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Embed Code
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {activeTab === 'instant' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Instant URL
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <code className="text-lg font-mono text-blue-600">
                  https://{tenantSlug}.out.sunspire.app
                </code>
              </div>
              <p className="text-gray-600 mb-6">
                Share this link to start receiving leads; you&apos;ll get an instant email and see them in your dashboard.
              </p>
              <button
                onClick={() => copyToClipboard(`https://${tenantSlug}.out.sunspire.app`)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Copy URL
              </button>
            </div>
          )}

          {activeTab === 'domain' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Attach Your Custom Domain
              </h2>
              <p className="text-gray-600 mb-6">
                Use your own domain like <code>quote.yourcompany.com</code> for a more professional look.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Domain
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="quote.yourcompany.com"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleVerifyDomain}
                      disabled={!customDomain || domainStatus === 'verifying' || domainStatus === 'attaching'}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {domainStatus === 'verifying' ? 'Verifying...' : 
                       domainStatus === 'attaching' ? 'Attaching...' : 'Attach Domain'}
                    </button>
                  </div>
                </div>

                {domainStatus === 'attached' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="text-green-600 mr-2">✅</div>
                      <div>
                        <p className="font-semibold text-green-800">Domain Attached Successfully!</p>
                        <p className="text-green-700">
                          Your solar tool is now live at: <code>https://{customDomain}</code>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {domainStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="text-red-600 mr-2">❌</div>
                      <div>
                        <p className="font-semibold text-red-800">Domain Setup Failed</p>
                        <p className="text-red-700">
                          Please check your DNS settings and try again.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'embed' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Embed Code
              </h2>
              <p className="text-gray-600 mb-6">
                Add this code to your website to embed the solar calculator directly.
              </p>
              
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <pre className="text-green-400 text-sm overflow-x-auto">
{`<iframe 
  src="https://${tenantSlug}.out.sunspire.app/embed" 
  width="100%" 
  height="600" 
  frameborder="0"
  title="Solar Calculator">
</iframe>`}
                </pre>
              </div>
              
              <button
                onClick={() => copyToClipboard(`<iframe src="https://${tenantSlug}.out.sunspire.app/embed" width="100%" height="600" frameborder="0" title="Solar Calculator"></iframe>`)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Copy Embed Code
              </button>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need help? Check out our{' '}
            <a href="/docs/setup" className="text-blue-600 hover:text-blue-700 font-semibold">
              setup guide
            </a>{' '}
            or{' '}
            <a href="/support" className="text-blue-600 hover:text-blue-700 font-semibold">
              contact support
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense fallback={<ActivateLoading />}>
      <ActivateContent />
    </Suspense>
  );
}
