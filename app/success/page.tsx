'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

interface StripeSession {
  id: string;
  metadata: {
    plan: string;
    company: string;
    token?: string;
  };
  subscription?: {
    current_period_end: number;
  };
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const [session, setSession] = useState<StripeSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const b = useBrandTakeover();

  const fetchSessionDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/stripe/session?session_id=${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch session details');
      }
      const data = await response.json();
      setSession(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails();
    }
  }, [sessionId, fetchSessionDetails]);

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Portal error:', err);
      alert('Unable to access billing portal. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your subscription details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Details</h1>
          <p className="text-gray-600 mb-4">Error: {error}</p>
          <Link href={searchParams?.get('demo') ? `/?${searchParams?.toString()}` : `/paid?${searchParams?.toString()}`} className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-600 text-6xl mb-4">❓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Not Found</h1>
          <p className="text-gray-600 mb-4">Unable to find your subscription details</p>
          <Link href={searchParams?.get('demo') ? `/?${searchParams?.toString()}` : `/paid?${searchParams?.toString()}`} className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const nextBillingDate = session.subscription?.current_period_end 
    ? new Date(session.subscription.current_period_end * 1000).toLocaleDateString()
    : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-green-600 text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Sunspire!</h1>
          <p className="text-lg text-gray-600">
            Your solar intelligence tool is now active and ready to use.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Subscription Details</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Plan</h3>
                <p className="text-sm text-gray-500">{session.metadata.plan || 'Starter'}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Company</h3>
                <p className="text-sm text-gray-500">{session.metadata.company}</p>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Next Billing Date</h3>
                <p className="text-sm text-gray-500">{nextBillingDate}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <Link
            href={`/onboard/domain?tenant=${session.metadata.company}&companyWebsite=${encodeURIComponent(session.metadata.company || '')}`}
            className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
          >
            Set up your custom domain (recommended) →
          </Link>
          
          <button
            onClick={handleManageBilling}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Manage Billing
          </button>
          
          <Link
            href={searchParams?.get('demo') ? `/?${searchParams?.toString()}` : `/paid?${searchParams?.toString()}`}
            className="block w-full text-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            Return to Home
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Covered by our 14-day guarantee — see <a href="/terms#refunds" className="text-blue-600 hover:underline">Refunds</a>.</p>
          <p className="mt-2">Need help? Contact our support team.</p>
        </div>
      </div>
    </div>
  );
}
