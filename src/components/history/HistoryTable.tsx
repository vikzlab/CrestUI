import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Filter, Search } from 'lucide-react';
import type { HistoryEntry, VerdictClassification, TriggerType } from '@/types';
import { VerdictBadge } from '@/components/results/VerdictBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SkeletonRow } from '@/components/ui/Skeleton';
import { formatTimestamp, formatDuration, exportHistoryToCSV } from '@/utils/formatters';
import { CONFIDENCE_COLORS } from '@/utils/constants';
import { clsx } from 'clsx';

interface HistoryTableProps {
  entries: HistoryEntry[];
  isLoading?: boolean;
}

export function HistoryTable({ entries, isLoading }: HistoryTableProps) {
  const navigate = useNavigate();
  const [verdictFilter, setVerdictFilter] = useState<VerdictClassification | 'all'>('all');
  const [triggerFilter, setTriggerFilter] = useState<TriggerType | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = entries.filter((e) => {
    if (verdictFilter !== 'all' && e.verdict !== verdictFilter) return false;
    if (triggerFilter !== 'all' && e.trigger_type !== triggerFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!e.issue_key.toLowerCase().includes(q) && !e.indicator.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const VERDICT_FILTERS: Array<VerdictClassification | 'all'> = ['all', 'malicious', 'suspicious', 'benign'];
  const TRIGGER_FILTERS: Array<TriggerType | 'all'> = ['all', 'auto', 'manual'];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="w-48">
            <Input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={14} />}
              className="py-1.5 text-sm"
            />
          </div>

          {/* Verdict filter */}
          <div className="flex items-center gap-1.5">
            <Filter size={12} className="text-slate-500" />
            {VERDICT_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setVerdictFilter(f)}
                className={clsx(
                  'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors capitalize',
                  verdictFilter === f
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800',
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Trigger filter */}
          <div className="flex items-center gap-1">
            {TRIGGER_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setTriggerFilter(f)}
                className={clsx(
                  'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors capitalize',
                  triggerFilter === f
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800',
                )}
              >
                {f === 'auto' ? 'Auto' : f === 'manual' ? 'Manual' : 'All Triggers'}
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => exportHistoryToCSV(filtered)}
          leftIcon={<Download size={12} />}
          disabled={filtered.length === 0}
        >
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                {['Time', 'Issue Key', 'Indicator', 'Verdict', 'Confidence', 'Duration', 'Trigger'].map((label) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                : filtered.length === 0
                ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500 text-sm">
                      No triage history found. Run a triage to see results here.
                    </td>
                  </tr>
                )
                : filtered.map((entry, i) => (
                  <tr
                    key={entry.id}
                    onClick={() => navigate(`/results/${entry.id}`)}
                    className={clsx(
                      'border-b border-slate-800/60 hover:bg-slate-800/40 cursor-pointer transition-colors',
                      i % 2 === 0 ? 'bg-transparent' : 'bg-slate-900/20',
                    )}
                  >
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono whitespace-nowrap">
                      {formatTimestamp(entry.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-cyan-400">{entry.issue_key}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      <span className="font-mono text-xs text-slate-300 truncate block">{entry.indicator}</span>
                      <span className="text-[10px] text-slate-600 uppercase">{entry.indicator_type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <VerdictBadge verdict={entry.verdict} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx(
                          'text-xs px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider',
                          CONFIDENCE_COLORS[entry.confidence],
                        )}
                      >
                        {entry.confidence}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">
                      {formatDuration(entry.duration_ms)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={entry.trigger_type === 'auto' ? 'auto' : 'manual'} size="sm">
                        {entry.trigger_type}
                      </Badge>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-800">
          <span className="text-xs text-slate-500">{filtered.length} of {entries.length} entries</span>
        </div>
      </div>
    </div>
  );
}
