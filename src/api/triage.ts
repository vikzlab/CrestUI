import { apiClient } from './client';
import type { TriageResult, TriageRequest } from '@/types';

// Normalize backend response to handle both naming conventions:
// Design doc: alert_metadata / total_duration_ms
// API spec:   alert          / duration_ms
// The backend uses the API spec names; this guard ensures both work.
function normalizeTriageResult(raw: Record<string, unknown>): TriageResult {
  return {
    success: (raw.success as boolean) ?? true,
    triage_id: raw.triage_id as string,
    alert: (raw.alert ?? raw.alert_metadata) as TriageResult['alert'],
    enrichment: raw.enrichment as TriageResult['enrichment'],
    verdict: raw.verdict as TriageResult['verdict'],
    summary_text: raw.summary_text as string,
    duration_ms: (raw.duration_ms ?? raw.total_duration_ms ?? 0) as number,
    auto_triggered: (raw.auto_triggered ?? false) as boolean,
  };
}

export async function runTriage(request: TriageRequest): Promise<TriageResult> {
  const raw = await apiClient.post<Record<string, unknown>>('/triage', request);
  return normalizeTriageResult(raw);
}

export async function healthCheck(): Promise<{ status: string; latency_ms: number }> {
  const start = Date.now();
  await apiClient.get<unknown>('/health');
  return { status: 'ok', latency_ms: Date.now() - start };
}
