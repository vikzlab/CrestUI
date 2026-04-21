import { useState, useEffect, useCallback } from 'react';
import type { ConnectionStatus } from '@/types';

async function pingServer(baseUrl: string): Promise<{ ok: boolean; latency_ms: number }> {
  const start = Date.now();
  try {
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    return { ok: response.ok || response.status === 404, latency_ms: Date.now() - start };
  } catch {
    return { ok: false, latency_ms: Date.now() - start };
  }
}

export function useHealthCheck(intervalMs = 30000) {
  const [connection, setConnection] = useState<ConnectionStatus>({ status: 'checking' });

  const check = useCallback(async () => {
    setConnection((prev) => ({ ...prev, status: 'checking' }));
    const baseUrl =
      localStorage.getItem('soc_api_url') ||
      import.meta.env.VITE_API_URL ||
      'http://localhost:8000';

    const result = await pingServer(baseUrl);
    setConnection({
      status: result.ok ? 'connected' : 'disconnected',
      latency_ms: result.latency_ms,
      last_checked: new Date().toISOString(),
    });
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, intervalMs);
    return () => clearInterval(interval);
  }, [check, intervalMs]);

  return { connection, refresh: check };
}
