import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HistoryEntry, TriageResult } from '@/types';
import { HISTORY_STORAGE_KEY, MAX_HISTORY_ENTRIES } from '@/utils/constants';

interface HistoryStore {
  entries: HistoryEntry[];
  addEntry: (result: TriageResult, triggerType: 'auto' | 'manual') => void;
  clearHistory: () => void;
  getEntry: (id: string) => HistoryEntry | undefined;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (result: TriageResult, triggerType: 'auto' | 'manual') => {
        const entry: HistoryEntry = {
          id: result.triage_id,
          timestamp: new Date().toISOString(),
          issue_key: result.alert.issue_key,
          indicator: result.alert.indicator,
          indicator_type: result.alert.indicator_type,
          verdict: result.verdict.classification,
          confidence: result.verdict.confidence,
          duration_ms: result.duration_ms,
          trigger_type: triggerType,
          triage_result: result,
        };

        set((state) => ({
          entries: [entry, ...state.entries].slice(0, MAX_HISTORY_ENTRIES),
        }));
      },

      clearHistory: () => set({ entries: [] }),

      getEntry: (id: string) => get().entries.find((e) => e.id === id),
    }),
    {
      name: HISTORY_STORAGE_KEY,
    },
  ),
);
