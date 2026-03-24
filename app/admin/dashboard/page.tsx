'use client';

import { useEffect, useState } from 'react';

interface HealthStatus {
  ok: boolean;
  timestamp: string;
  services?: Array<{
    service: string;
    status: 'ok' | 'degraded' | 'down';
    latency?: number;
    error?: string;
  }>;
  apis?: Record<string, boolean>;
}

interface CircuitBreakerState {
  state: 'closed' | 'open' | 'half-open';
  failures: number;
  lastFailureTime: number | null;
  successCount: number;
}

export default function AdminDashboard() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [circuitBreakerStates, setCircuitBreakerStates] = useState<Record<string, CircuitBreakerState>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      setError(null);
      
      // Get admin token from prompt (in production, use proper auth)
      const adminToken = prompt('Enter admin token:');
      if (!adminToken) {
        setError('Admin token required');
        setLoading(false);
        return;
      }

      // Load metrics from admin API
      const metricsRes = await fetch('/api/admin/metrics', {
        headers: {
          'x-admin-token': adminToken,
        },
      });

      if (!metricsRes.ok) {
        if (metricsRes.status === 401) {
          setError('Unauthorized - Invalid admin token');
        } else {
          setError(`Failed to load metrics: ${metricsRes.status}`);
        }
        setLoading(false);
        return;
      }

      const metrics = await metricsRes.json();
      setHealth(metrics.health);
      setCircuitBreakerStates(metrics.circuitBreakers || {});

      setLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={loadData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Health Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">System Health</h2>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
            health?.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {health?.ok ? 'All Systems Operational' : 'Some Systems Degraded'}
          </div>
          <div className="space-y-2">
            {health?.services && health.services.length > 0 ? (
              health.services.map((service) => (
                <div key={service.service} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      service.status === 'ok' ? 'bg-green-500' :
                      service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="font-medium">{service.service}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {service.latency ? `${service.latency}ms` : 'N/A'}
                    {service.error && ` - ${service.error}`}
                  </div>
                </div>
              ))
            ) : health?.apis ? (
              Object.entries(health.apis).map(([service, available]) => (
                <div key={service} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${available ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-medium">{service}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {available ? 'Available' : 'Unavailable'}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No service data available</p>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {health?.timestamp ? new Date(health.timestamp).toLocaleString() : 'Never'}
          </p>
        </div>

        {/* Circuit Breakers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Circuit Breakers</h2>
          <div className="space-y-2">
            {Object.entries(circuitBreakerStates).map(([service, state]) => (
              <div key={service} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    state.state === 'closed' ? 'bg-green-500' :
                    state.state === 'half-open' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="font-medium">{service}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    state.state === 'closed' ? 'bg-green-100 text-green-800' :
                    state.state === 'half-open' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {state.state.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Failures: {state.failures}
                  {state.lastFailureTime && (
                    <span className="ml-2">
                      Last failure: {new Date(state.lastFailureTime).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
