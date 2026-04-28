import { useState } from 'react';
import { RefreshCw, Filter, ChevronDown } from 'lucide-react';
import type { QueueAlert } from '@/types';
import { QueueRow } from './QueueRow';
import { Button } from '@/components/ui/Button';
import { SkeletonRow } from '@/components/ui/Skeleton';
import { clsx } from 'clsx';


interface QueueTableProps {
  alerts: QueueAlert[];
  isLoading: boolean;
  onRefresh: () => void;
  onTriage: (issueKey: string) => void;
  runningKeys?: Set<string>;
  lastRefreshed?: Date;
}

type PriorityFilter = 'all' | 'P0' | 'P1' | 'P2' | 'P3';

export function QueueTable({ alerts, isLoading, onRefresh, onTriage, runningKeys = new Set() }: QueueTableProps) {
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  const filtered = alerts.filter((a) => {
    if (priorityFilter === 'all') return true;
    return a.priority === priorityFilter || (priorityFilter === 'P0' && a.priority === 'Critical');
  });

  const PRIORITY_FILTERS: PriorityFilter[] = ['all', 'P0', 'P1', 'P2', 'P3'];

  return (
    <div className="space-y-4">
      {/* Table header controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-500" />
          <div className="flex gap-1">
            {PRIORITY_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setPriorityFilter(f)}
                className={clsx(
                  'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                  priorityFilter === f
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800',
                )}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          loading={isLoading}
          leftIcon={<RefreshCw size={12} />}
        >
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                {[
                  { label: 'Score', width: 'w-16' },
                  { label: 'Issue Key', width: 'w-28' },
                  { label: 'Summary' },
                  { label: 'Priority', width: 'w-24' },
                  { label: 'Status', width: 'w-28' },
                  { label: 'Age', width: 'w-16' },
                  { label: 'Indicator', width: 'w-40' },
                  { label: 'Actions', width: 'w-36' },
                ].map(({ label, width }) => (
                  <th
                    key={label}
                    className={clsx(
                      'px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider',
                      width,
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {label === 'Score' && <ChevronDown size={10} className="text-slate-600" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && filtered.length === 0
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                : filtered.length === 0
                ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-500 text-sm">
                      No alerts in queue matching the selected filter.
                    </td>
                  </tr>
                )
                : filtered.map((alert, i) => (
                  <QueueRow
                    key={alert.id}
                    alert={alert}
                    index={i}
                    onTriage={onTriage}
                    isRunning={runningKeys.has(alert.issue_key)}
                    isExpanded={expandedId === alert.id}
                    onToggleExpand={() => toggleExpand(alert.id)}
                  />
                ))}

            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {filtered.length} of {alerts.length} alerts
          </span>
          <span className="text-xs text-slate-600">Auto-refreshes every 30s</span>
        </div>
      </div>
    </div>
  );
}
