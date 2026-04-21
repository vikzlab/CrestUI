import { History as HistoryIcon } from 'lucide-react';
import { HistoryTable } from '@/components/history/HistoryTable';
import { useHistory } from '@/hooks/useHistory';
import { Card, CardBody } from '@/components/ui/Card';
import { clsx } from 'clsx';

export function History() {
  const { entries } = useHistory();

  const verdictCounts = entries.reduce(
    (acc, e) => {
      acc[e.verdict] = (acc[e.verdict] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const summaryCards = [
    { label: 'Total', value: entries.length, color: 'text-cyan-400' },
    { label: 'Malicious', value: verdictCounts.malicious ?? 0, color: 'text-red-400' },
    { label: 'Suspicious', value: verdictCounts.suspicious ?? 0, color: 'text-amber-400' },
    { label: 'Benign', value: verdictCounts.benign ?? 0, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <HistoryIcon size={16} className="text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Triage History</h1>
        </div>
        <p className="text-sm text-slate-500 ml-11">Complete log of all triage runs</p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-4 gap-3">
        {summaryCards.map((c) => (
          <Card key={c.label}>
            <CardBody className="py-3">
              <div className="text-xs text-slate-500 mb-0.5">{c.label}</div>
              <div className={clsx('text-xl font-bold', c.color)}>{c.value}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Table */}
      <HistoryTable entries={entries} />
    </div>
  );
}
