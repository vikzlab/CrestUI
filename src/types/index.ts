export type VerdictClassification = 'benign' | 'suspicious' | 'malicious';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type AlertPriority = 'P0' | 'P1' | 'P2' | 'P3' | 'Critical' | 'High' | 'Medium' | 'Low';
export type StageStatus = 'pending' | 'in-progress' | 'complete' | 'error';
export type TriggerType = 'auto' | 'manual';

export interface Vendor {
  name: string;
  result: string;
  category: string;
}

export interface AlertData {
  issue_key: string;
  indicator: string;
  indicator_type: string;
  user_id: string;
  source_ip: string;
  priority: string;
  event_timestamp: string;
}

export interface EnrichmentData {
  malicious_detections: number;
  suspicious_detections: number;
  total_detections: number;
  detection_ratio: number;
  reputation_score: number;
  categories: string[];
  threat_names: string[];
  top_vendors: Vendor[];
}

export interface VerdictData {
  classification: VerdictClassification;
  confidence: ConfidenceLevel;
  reasoning: string;
  key_factors: string[];
  recommended_priority: string;
  suppress_alert: boolean;
  fallback_mode: boolean;
  model_used: string;
  latency_ms: number;
  prompt_version?: string;
}

export interface TriageResult {
  success: boolean;
  triage_id: string;
  alert: AlertData;
  enrichment: EnrichmentData;
  verdict: VerdictData;
  summary_text: string;
  duration_ms: number;
  auto_triggered: boolean;
}

export interface TriageRequest {
  jira_key: string;
}

export interface TriageError {
  detail: string;
}

export interface PipelineStage {
  id: string;
  label: string;
  description: string;
  status: StageStatus;
  icon: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  issue_key: string;
  indicator: string;
  indicator_type: string;
  verdict: VerdictClassification;
  confidence: ConfidenceLevel;
  duration_ms: number;
  trigger_type: TriggerType;
  triage_result: TriageResult;
}

export interface QueueAlert {
  id: string;
  issue_key: string;
  summary: string;
  priority: string;
  priority_score: number;
  indicator: string;
  indicator_type: string;
  age_minutes: number;
  auto_triggered: boolean;
  triage_status?: 'pending' | 'running' | 'complete' | 'error';
  triage_id?: string;
}

export interface StatsData {
  triaged_today: number;
  malicious_count: number;
  avg_duration_ms: number;
  queue_size: number;
}

export interface ConnectionStatus {
  status: 'connected' | 'disconnected' | 'checking';
  latency_ms?: number;
  last_checked?: string;
}
