import { useState } from 'react';
import { List, AlertTriangle } from 'lucide-react';
import { QueueTable } from '@/components/queue/QueueTable';
import { useQueue } from '@/hooks/useQueue';
import { useTriage } from '@/hooks/useTriage';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardBody } from '@/components/ui/Card';

export function Queue() {
  const queryClient = useQueryClient();
  const { data: alerts = [], isLoading, refetch } = useQueue();
  const triage = useTriage();
  const [runningKeys, setRunningKeys] = useState<Set<string>>(new Set());

  const handleTriage = async (issueKey: string) => {
    setRunningKeys((prev) => new Set([...prev, issueKey]));
    try {
      // Use the triage hook — it will navigate to results on success
      await triage.startTriage(issueKey, 'manual');
    } finally {
      setRunningKeys((prev) => {
        const next = new Set(prev);
        next.delete(issueKey);
        return next;
      });
    }
  };

  const autoCount = alerts.filter((a) => a.auto_triggered || a.priority === 'P0' || a.priority === 'Critical').length;
  const p0Count = alerts.filter((a) => a.priority === 'P0' || a.priority === 'Critical').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <List size={16} className="text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Alert Queue</h1>
        </div>
        <p className="text-sm text-slate-500 ml-11">
          {alerts.length} open alerts · {p0Count} critical · {autoCount} auto-triggered
        </p>
      </div>

      {/* P0 banner */}
      {p0Count > 0 && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardBody className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={16} className="text-red-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-400">
                  {p0Count} Critical Alert{p0Count > 1 ? 's' : ''} — Auto-Triage Initiated
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  P0/Critical alerts are automatically queued for triage. Scroll down to view progress.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <QueueTable
        alerts={alerts}
        isLoading={isLoading}
        onRefresh={() => {
          queryClient.invalidateQueries({ queryKey: ['queue'] });
          refetch();
        }}
        onTriage={handleTriage}
        runningKeys={runningKeys}
      />
    </div>
  );
}
