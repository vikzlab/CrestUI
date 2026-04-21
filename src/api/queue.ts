import type { QueueAlert } from '@/types';
import { getPriorityScore } from '@/utils/formatters';

// Mock queue data — replace with real endpoint when available
const MOCK_QUEUE: QueueAlert[] = [
  {
    id: 'q-001',
    issue_key: 'SOC-2891',
    summary: 'Suspicious DNS query to known C2 domain',
    priority: 'P0',
    priority_score: 97,
    indicator: 'c2-malware-domain.ru',
    indicator_type: 'domain',
    age_minutes: 3,
    auto_triggered: true,
    triage_status: 'pending',
  },
  {
    id: 'q-002',
    issue_key: 'SOC-2890',
    summary: 'Phishing email link clicked by user jsmith',
    priority: 'P1',
    priority_score: 78,
    indicator: 'phishing-portal.com/login',
    indicator_type: 'url',
    age_minutes: 12,
    auto_triggered: false,
    triage_status: 'pending',
  },
  {
    id: 'q-003',
    issue_key: 'SOC-2889',
    summary: 'Repeated failed login attempts from external IP',
    priority: 'P1',
    priority_score: 72,
    indicator: '45.33.32.156',
    indicator_type: 'ip',
    age_minutes: 28,
    auto_triggered: false,
    triage_status: 'pending',
  },
  {
    id: 'q-004',
    issue_key: 'SOC-2888',
    summary: 'Malware hash detected in endpoint scan',
    priority: 'P2',
    priority_score: 55,
    indicator: 'd41d8cd98f00b204e9800998ecf8427e',
    indicator_type: 'hash',
    age_minutes: 45,
    auto_triggered: false,
    triage_status: 'pending',
  },
  {
    id: 'q-005',
    issue_key: 'SOC-2887',
    summary: 'Unusual outbound traffic pattern detected',
    priority: 'P2',
    priority_score: 48,
    indicator: '203.0.113.42',
    indicator_type: 'ip',
    age_minutes: 67,
    auto_triggered: false,
    triage_status: 'pending',
  },
  {
    id: 'q-006',
    issue_key: 'SOC-2886',
    summary: 'Suspicious PowerShell execution detected',
    priority: 'P3',
    priority_score: 32,
    indicator: 'powershell.exe -enc JABjAD0A...',
    indicator_type: 'hash',
    age_minutes: 120,
    auto_triggered: false,
    triage_status: 'pending',
  },
];

export async function fetchQueue(): Promise<QueueAlert[]> {
  // In production, replace with: apiClient.get<QueueAlert[]>('/api/alerts/queue')
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_QUEUE.map((alert) => ({
    ...alert,
    priority_score: alert.priority_score ?? getPriorityScore(alert.priority),
  })).sort((a, b) => b.priority_score - a.priority_score);
}
