'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface HealthService {
  service: string;
  status: 'ok' | 'degraded' | 'down';
  latency?: number;
  error?: string;
}

interface HealthConfig {
  supabase?: boolean;
  stripe?: boolean;
  nrel?: boolean;
  eia?: boolean;
  geocoding?: boolean;
  resend?: boolean;
  google_places?: boolean;
}

interface HealthStatus {
  ok: boolean;
  timestamp: string;
  version?: string;
  commit?: string;
  services: HealthService[];
  config?: HealthConfig;
}

interface SyntheticTestResult {
  testName: string;
  status: 'pass' | 'fail' | 'degraded';
  lastRun: string;
  durationMs?: number;
  summary?: string;
  failureReason?: string;
  artifactsUrl?: string;
  recentFailureCount?: number;
  environment: string;
}

interface SyntheticResults {
  homeowner?: SyntheticTestResult;
  buyer?: SyntheticTestResult;
  lastUpdated?: string;
}

const SERVICE_LABELS: Record<string, { title: string; desc: string }> = {
  supabase: { title: 'Supabase', desc: 'Data storage — tenants & leads' },
  stripe: { title: 'Stripe', desc: 'Payments — checkout & webhooks' },
  nrel: { title: 'NREL PVWatts', desc: 'Solar production — quotes' },
  eia: { title: 'EIA', desc: 'Utility rates — electricity data' },
  google_geocoding: { title: 'Google Geocoding', desc: 'Address lookup (server)' },
  google_places: { title: 'Google Places', desc: 'Address autocomplete (client)' },
  resend: { title: 'Resend', desc: 'Email — lead alerts & delivery' },
  vercel_kv: { title: 'Vercel KV (Upstash)', desc: 'DLQ, webhook idempotency, rate limiting' },
  usgs_3dep: { title: 'USGS 3DEP Elevation', desc: 'Shading / terrain — solar shade analysis' },
};

export default function StatusPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [synthetic, setSynthetic] = useState<SyntheticResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const searchParams = useSearchParams();

  const fetchHealth = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json().catch(() => null);
      if (data && typeof data === 'object' && Array.isArray(data.services)) {
        setHealth(data);
        setError(null);
      } else {
        setError(response.ok ? 'Invalid response' : `HTTP ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  const fetchSynthetic = useCallback(async () => {
    try {
      const res = await fetch('/api/synthetic-results');
      if (res.ok) {
        const data = await res.json();
        setSynthetic(data);
      }
    } catch {
      setSynthetic(null);
    }
  }, []);

  useEffect(() => {
    fetchSynthetic();
  }, [fetchSynthetic]);

  // Auto-refresh every 60s when page is visible
  useEffect(() => {
    if (!health) return;
    const t = setInterval(() => fetchHealth(true), 60000);
    return () => clearInterval(t);
  }, [health, fetchHealth]);

  if (loading && !health) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" data-testid="status-page-content">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Checking system status...</p>
        </div>
      </div>
    );
  }

  if (error && !health) {
    return (
      <div className="min-h-screen bg-slate-50 py-8" data-testid="status-page-content">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-md mx-auto mb-8">
            <div className="text-red-500 text-5xl mb-4">⚠</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Status check failed</h1>
            <p className="text-slate-600 mb-4">{error}</p>
            <button
              onClick={() => fetchHealth(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
          {/* Synthetic monitoring still shown when health fails */}
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 mb-6" data-testid="synthetic-monitoring-section">
            <p className="text-lg font-semibold text-slate-900 mb-2">Synthetic monitoring</p>
            <p className="text-sm text-slate-500 mb-3">
              Latest results from scheduled production flows (homeowner quote, buyer checkout). Updated by GitHub Actions.
            </p>
            {synthetic && (synthetic.homeowner || synthetic.buyer) ? (
              <div className="space-y-3">
                {synthetic.homeowner && (
                  <div className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-slate-100 last:border-0" data-testid="synthetic-homeowner-row">
                    <span className="text-sm font-medium text-slate-800">Homeowner flow</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${synthetic.homeowner.status === 'pass' ? 'text-emerald-600' : synthetic.homeowner.status === 'fail' ? 'text-red-600' : 'text-amber-600'}`}>
                        {synthetic.homeowner.status === 'pass' ? 'PASS' : synthetic.homeowner.status === 'fail' ? 'FAIL' : 'DEGRADED'}
                      </span>
                      <span className="text-xs text-slate-500">
                        {synthetic.homeowner.lastRun ? new Date(synthetic.homeowner.lastRun).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                      </span>
                      {synthetic.homeowner.summary && <p className="text-xs text-slate-500 w-full">{synthetic.homeowner.summary}</p>}
                    </div>
                  </div>
                )}
                {synthetic.buyer && (
                  <div className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-slate-100 last:border-0" data-testid="synthetic-buyer-row">
                    <span className="text-sm font-medium text-slate-800">Buyer checkout flow</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${synthetic.buyer.status === 'pass' ? 'text-emerald-600' : synthetic.buyer.status === 'fail' ? 'text-red-600' : 'text-amber-600'}`}>
                        {synthetic.buyer.status === 'pass' ? 'PASS' : synthetic.buyer.status === 'fail' ? 'FAIL' : 'DEGRADED'}
                      </span>
                      <span className="text-xs text-slate-500">
                        {synthetic.buyer.lastRun ? new Date(synthetic.buyer.lastRun).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                      </span>
                      {synthetic.buyer.summary && <p className="text-xs text-slate-500 w-full">{synthetic.buyer.summary}</p>}
                    </div>
                  </div>
                )}
                {synthetic.lastUpdated && <p className="text-xs text-slate-400 pt-1">Results last updated: {new Date(synthetic.lastUpdated).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</p>}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No recent synthetic data. Runs every 30 minutes via GitHub Actions.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Unable to determine system status.</p>
        </div>
      </div>
    );
  }

  const allOk = health.ok;
  const downCount = (health.services || []).filter((s) => s.status !== 'ok').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8" data-testid="status-page-content">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero: single source of truth — only h1 on the page */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">System Status</h1>
          <p className="text-slate-600 mb-4">
            This is the only page you need to confirm all Sunspire systems are up. If every service below is green, you’re good to go.
          </p>
          <p className="text-sm text-slate-500">
            Last updated: {new Date(health.timestamp).toLocaleString()}
            {health.version && <> · Version {health.version}</>}
            {health.commit && <> · <code className="text-xs bg-slate-100 px-1 rounded">{health.commit}</code></>}
            {' · '}
            <button
              type="button"
              onClick={() => fetchHealth(true)}
              disabled={refreshing}
              className="text-blue-600 hover:underline disabled:opacity-50"
            >
              {refreshing ? 'Refreshing…' : 'Refresh now'}
            </button>
            {' · '}
            <span className="text-slate-400">Auto-refresh every 60s</span>
          </p>
        </div>

        {/* Overall status banner */}
        <div
          className={`rounded-xl border-2 px-6 py-5 mb-8 ${
            allOk
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <span
              className={`text-3xl ${allOk ? 'text-emerald-600' : 'text-amber-600'}`}
              aria-hidden
            >
              {allOk ? '✓' : '!'}
            </span>
            <div className="text-left">
              <span
                className={`text-xl font-bold ${
                  allOk ? 'text-emerald-800' : 'text-amber-800'
                }`}
              >
                {allOk
                  ? 'All systems operational'
                  : `${downCount} service${downCount !== 1 ? 's' : ''} need attention`}
              </span>
              <p
                className={`text-sm mt-0.5 ${
                  allOk ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {allOk
                  ? 'Every API Sunspire depends on is responding.'
                  : 'Check the list below and TO-DO-LIST / MAINTENANCE-GUIDE if needed.'}
              </p>
            </div>
          </div>
        </div>

        {/* What we check — every API and dependency; nothing hidden (single header: only "System Status" above) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <p className="text-lg font-semibold text-slate-900">Everything Sunspire depends on (checked live)</p>
            <p className="text-sm text-slate-500 mt-0.5">
              Data (Supabase), payments (Stripe), quotes (NREL + EIA), address (Google Geocoding + Places), email (Resend), storage (Vercel KV), shading (USGS 3DEP). Each row is probed by <code className="text-xs bg-slate-100 px-1 rounded">/api/health</code> — only services with env vars set appear. This covers every API in the quote/lead/payment path. See <code className="text-xs bg-slate-100 px-1 rounded">docs/API-HEALTH-COVERAGE.md</code> for the full route list.
            </p>
          </div>
          <div className="divide-y divide-slate-200" data-testid="status-service-list">
            {(health.services || []).map((s) => {
              const label = SERVICE_LABELS[s.service] || {
                title: s.service,
                desc: '',
              };
              const isOk = s.status === 'ok';
              const isDegraded = s.status === 'degraded';
              return (
                <div
                  key={s.service}
                  data-testid="status-service-row"
                  data-service={s.service}
                  className="px-6 py-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900" role="text">
                      {label.title}
                    </p>
                    {label.desc && (
                      <p className="text-sm text-slate-500 truncate">{label.desc}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {s.latency != null && s.latency > 0 && isOk && (
                      <span className="text-xs text-slate-400">{s.latency}ms</span>
                    )}
                    <span
                      className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-lg font-medium ${
                        isOk
                          ? 'bg-emerald-100 text-emerald-700'
                          : isDegraded
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                      aria-hidden
                    >
                      {isOk ? '✓' : isDegraded ? '!' : '✕'}
                    </span>
                    <span
                      className={`text-sm font-semibold min-w-[80px] ${
                        isOk
                          ? 'text-emerald-600'
                          : isDegraded
                            ? 'text-amber-600'
                            : 'text-red-600'
                      }`}
                    >
                      {isOk ? 'Operational' : isDegraded ? 'Degraded' : 'Down'}
                    </span>
                    {s.error && (
                      <span
                        className="text-xs text-red-600 max-w-[180px] truncate"
                        title={s.error}
                      >
                        {s.error}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Config presence (no values) — catch env drift in prod */}
        {health.config && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-4 mb-6">
            <p className="text-sm font-semibold text-slate-800 mb-2">Config (env set)</p>
            <p className="text-xs text-slate-500 mb-2">Which integrations have env vars configured. Use this to spot production drift.</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(health.config).map(([key, value]) => (
                <span
                  key={key}
                  className={`text-xs font-medium px-2 py-1 rounded ${value ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}
                  title={value ? 'Configured' : 'Not set'}
                >
                  {key}: {value ? '✓' : '—'}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Synthetic monitoring results (from scheduled Playwright runs) */}
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 mb-6" data-testid="synthetic-monitoring-section">
          <p className="text-lg font-semibold text-slate-900 mb-2">Synthetic monitoring</p>
          <p className="text-sm text-slate-500 mb-3">
            Latest results from scheduled production flows (homeowner quote, buyer checkout). Updated by GitHub Actions.
          </p>
          {synthetic && (synthetic.homeowner || synthetic.buyer) ? (
            <div className="space-y-3">
              {synthetic.homeowner && (
                <div className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-slate-100 last:border-0" data-testid="synthetic-homeowner-row">
                  <span className="text-sm font-medium text-slate-800">Homeowner flow</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        synthetic.homeowner.status === 'pass'
                          ? 'text-emerald-600'
                          : synthetic.homeowner.status === 'fail'
                            ? 'text-red-600'
                            : 'text-amber-600'
                      }`}
                    >
                      {synthetic.homeowner.status === 'pass' ? 'PASS' : synthetic.homeowner.status === 'fail' ? 'FAIL' : 'DEGRADED'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {synthetic.homeowner.lastRun
                        ? new Date(synthetic.homeowner.lastRun).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
                        : '—'}
                    </span>
                    {synthetic.homeowner.durationMs != null && (
                      <span className="text-xs text-slate-400">{Math.round(synthetic.homeowner.durationMs / 1000)}s</span>
                    )}
                  </div>
                  {synthetic.homeowner.summary && (
                    <p className="text-xs text-slate-500 w-full">{synthetic.homeowner.summary}</p>
                  )}
                  {synthetic.homeowner.failureReason && (
                    <p className="text-xs text-red-600 w-full">{synthetic.homeowner.failureReason}</p>
                  )}
                  {synthetic.homeowner.artifactsUrl && (
                    <a href={synthetic.homeowner.artifactsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      View run
                    </a>
                  )}
                </div>
              )}
              {synthetic.buyer && (
                <div className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-slate-100 last:border-0" data-testid="synthetic-buyer-row">
                  <span className="text-sm font-medium text-slate-800">Buyer checkout flow</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        synthetic.buyer.status === 'pass'
                          ? 'text-emerald-600'
                          : synthetic.buyer.status === 'fail'
                            ? 'text-red-600'
                            : 'text-amber-600'
                      }`}
                    >
                      {synthetic.buyer.status === 'pass' ? 'PASS' : synthetic.buyer.status === 'fail' ? 'FAIL' : 'DEGRADED'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {synthetic.buyer.lastRun
                        ? new Date(synthetic.buyer.lastRun).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
                        : '—'}
                    </span>
                    {synthetic.buyer.durationMs != null && (
                      <span className="text-xs text-slate-400">{Math.round(synthetic.buyer.durationMs / 1000)}s</span>
                    )}
                  </div>
                  {synthetic.buyer.summary && (
                    <p className="text-xs text-slate-500 w-full">{synthetic.buyer.summary}</p>
                  )}
                  {synthetic.buyer.failureReason && (
                    <p className="text-xs text-red-600 w-full">{synthetic.buyer.failureReason}</p>
                  )}
                  {synthetic.buyer.artifactsUrl && (
                    <a href={synthetic.buyer.artifactsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      View run
                    </a>
                  )}
                </div>
              )}
              {synthetic.lastUpdated && (
                <p className="text-xs text-slate-400 pt-1">Results last updated: {new Date(synthetic.lastUpdated).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No recent synthetic data. Runs every 30 minutes via GitHub Actions.</p>
          )}
        </div>

        {/* Streamlined: UptimeRobot, /status, Sentry — alerts to support@getsunspire.com */}
        <div className="rounded-xl border-2 border-slate-200 bg-white px-6 py-4 mb-8">
          <p className="text-sm font-semibold text-slate-800 mb-2">
            Daily check: UptimeRobot, this page, Sentry — alerts to support@getsunspire.com
          </p>
          <p className="text-sm text-slate-600 mb-2">
            <code className="text-xs bg-slate-100 px-1 rounded">/api/health</code> probes every API (Supabase, Stripe, NREL, EIA, Google Geocoding/Places, Resend, Vercel KV, USGS 3DEP). See <code className="text-xs bg-slate-100 px-1 rounded">docs/API-HEALTH-COVERAGE.md</code>.
          </p>
          <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
            <li><strong>UptimeRobot</strong> — Monitor <code className="text-xs bg-slate-100 px-1 rounded">GET /api/health</code>. When status is not 200, alert <a href="mailto:support@getsunspire.com" className="text-blue-600 hover:underline">support@getsunspire.com</a>.</li>
            <li><strong>This page</strong> — Open <code className="text-xs bg-slate-100 px-1 rounded">/status</code> to see each service and version.</li>
            <li><strong>Sentry</strong> — Set project alerts to <a href="mailto:support@getsunspire.com" className="text-blue-600 hover:underline">support@getsunspire.com</a> (Settings → Alerts).</li>
          </ul>
        </div>

        <p className="text-xs text-slate-500 mb-6">Vercel usage and Sentry limits: MAINTENANCE-GUIDE.</p>

        <div className="text-center">
          <Link
            href={
              searchParams?.get('demo')
                ? `/?${searchParams?.toString() || ''}`
                : `/paid?${searchParams?.toString() || ''}`
            }
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-slate-700 hover:bg-slate-800"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
