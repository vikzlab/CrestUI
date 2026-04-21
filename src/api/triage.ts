import { apiClient } from './client';
import type { TriageResult, TriageRequest } from '@/types';

export async function runTriage(request: TriageRequest): Promise<TriageResult> {
  return apiClient.post<TriageResult>('/triage', request);
}

export async function healthCheck(): Promise<{ status: string; latency_ms: number }> {
  const start = Date.now();
  await apiClient.get<unknown>('/health');
  return { status: 'ok', latency_ms: Date.now() - start };
}
