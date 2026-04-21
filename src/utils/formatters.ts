import { format, formatDistanceToNow, parseISO } from 'date-fns';
import type { HistoryEntry, VerdictClassification } from '@/types';

export function formatTimestamp(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d, yyyy HH:mm:ss');
  } catch {
    return iso;
  }
}

export function formatRelativeTime(iso: string): string {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true });
  } catch {
    return iso;
  }
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

export function formatDetectionRatio(malicious: number, total: number): string {
  return `${malicious}/${total}`;
}

export function formatPercentage(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`;
}

export function formatReputationScore(score: number): string {
  if (score > 0) return `+${score}`;
  return `${score}`;
}

export function getReputationColor(score: number): string {
  if (score > 0) return 'text-emerald-400';
  if (score === 0) return 'text-slate-400';
  if (score > -50) return 'text-amber-400';
  return 'text-red-400';
}

export function getPriorityScore(priority: string): number {
  const map: Record<string, number> = {
    P0: 95,
    Critical: 90,
    P1: 75,
    High: 70,
    P2: 50,
    Medium: 45,
    P3: 25,
    Low: 20,
  };
  return map[priority] ?? 50;
}

export function verdictLabel(v: VerdictClassification): string {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export function exportHistoryToCSV(entries: HistoryEntry[]): void {
  const headers = [
    'Timestamp',
    'Issue Key',
    'Indicator',
    'Indicator Type',
    'Verdict',
    'Confidence',
    'Duration',
    'Trigger Type',
  ];

  const rows = entries.map((e) => [
    e.timestamp,
    e.issue_key,
    e.indicator,
    e.indicator_type,
    e.verdict,
    e.confidence,
    formatDuration(e.duration_ms),
    e.trigger_type,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `soc-triage-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function getActionChecklist(verdict: VerdictClassification, suppressAlert: boolean): string[] {
  if (verdict === 'malicious') {
    return [
      'Block indicator at perimeter firewall',
      'Isolate affected endpoint if compromised',
      'Notify SOC lead and escalate to Tier 2',
      'Open incident ticket and link to this alert',
      'Check for lateral movement from source IP',
      'Preserve forensic evidence before remediation',
      suppressAlert ? '⚠ Alert suppression recommended — review before closing' : 'Keep alert open until remediation confirmed',
    ];
  }
  if (verdict === 'suspicious') {
    return [
      'Monitor indicator for 24 hours',
      'Check threat intelligence feeds for updates',
      'Review user activity around event timestamp',
      'Add to watchlist for auto-escalation',
      'Notify assigned analyst for manual review',
    ];
  }
  return [
    'Mark alert as reviewed',
    'Document findings in Jira comment',
    'Close ticket if no further action required',
    'Update allow-list if indicator is known-good',
  ];
}
