import { useMemo } from 'react';
import { useHistoryStore } from '@/store/historyStore';
import type { VerdictClassification, TriggerType } from '@/types';

interface HistoryFilters {
  verdict?: VerdictClassification | 'all';
  trigger?: TriggerType | 'all';
  dateFrom?: string;
  dateTo?: string;
}

export function useHistory(filters: HistoryFilters = {}) {
  const entries = useHistoryStore((s) => s.entries);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (filters.verdict && filters.verdict !== 'all' && e.verdict !== filters.verdict) return false;
      if (filters.trigger && filters.trigger !== 'all' && e.trigger_type !== filters.trigger) return false;
      if (filters.dateFrom && e.timestamp < filters.dateFrom) return false;
      if (filters.dateTo && e.timestamp > filters.dateTo + 'T23:59:59') return false;
      return true;
    });
  }, [entries, filters.verdict, filters.trigger, filters.dateFrom, filters.dateTo]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = entries.filter((e) => e.timestamp.startsWith(today));
    return {
      triaged_today: todayEntries.length,
      malicious_count: entries.filter((e) => e.verdict === 'malicious').length,
      avg_duration_ms:
        entries.length > 0
          ? Math.round(entries.reduce((sum, e) => sum + e.duration_ms, 0) / entries.length)
          : 0,
    };
  }, [entries]);

  return { entries: filtered, stats, total: entries.length };
}
