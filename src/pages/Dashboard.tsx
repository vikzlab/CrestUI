import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Activity, Clock, AlertTriangle, List, ChevronRight, Zap } from 'lucide-react';
import { TriageForm } from '@/components/triage/TriageForm';
import { ProgressPipeline } from '@/components/triage/ProgressPipeline';
import { VerdictBadge } from '@/components/results/VerdictBadge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useHistory } from '@/hooks/useHistory';
import { useQueue } from '@/hooks/useQueue';
import { useTriage } from '@/hooks/useTriage';
import { formatRelativeTime, formatDuration } from '@/utils/formatters';
import { clsx } from 'clsx';

export function Dashboard() {
  const navigate = useNavigate();
  const { entries, stats } = useHistory();
  const { data: queue } = useQueue();
  const triage = useTriage();
  const [activeTriageKey, setActiveTriageKey] = useState<string>('');

  const handleTriage = (jiraKey: string) => {
    setActiveTriageKey(jiraKey);
    triage.startTriage(jiraKey, 'manual');
  };

  const recentEntries = entries.slice(0, 5);

  const statsCards = [
    {
      label: 'Triaged Today',
      value: stats.triaged_today,
      icon: <Shield size={16} />,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      label: 'Malicious',
      value: stats.malicious_count,
      icon: <AlertTriangle size={16} />,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
    {
      label: 'Avg Duration',
      value: stats.avg_duration_ms > 0 ? formatDuration(stats.avg_duration_ms) : '—',
      icon: <Clock size={16} />,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Queue Size',
      value: queue?.length ?? 0,
      icon: <List size={16} />,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-sm p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-cyan-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">CrestSOC</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mb-2">AI Alert Triage</h1>
          <p className="text-slate-400 text-sm mb-6">
            Enter a Jira issue key to run automated threat intelligence enrichment and AI-powered verdict classification.
          </p>
          <TriageForm onSubmit={handleTriage} isLoading={triage.isRunning} size="hero" />
        </div>
      </div>

      {/* Active triage progress */}
      {(triage.isRunning || triage.error) && (
        <div className="animate-slide-in">
          <ProgressPipeline
            stages={triage.stages}
            elapsedMs={triage.elapsedMs}
            onCancel={triage.cancel}
            jiraKey={activeTriageKey}
            error={triage.error}
          />
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <Card key={card.label} className="hover:border-slate-700 transition-colors">
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-slate-500 mb-1">{card.label}</div>
                  <div className={clsx('text-2xl font-bold', card.color)}>
                    {card.value}
                  </div>
                </div>
                <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center', card.bg, card.color)}>
                  {card.icon}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Recent triages */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Activity size={14} className="text-cyan-400" />
              Recent Triages
            </h2>
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
        </CardHeader>
        {recentEntries.length === 0 ? (
          <CardBody>
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-3">
                <Zap size={20} className="text-slate-600" />
              </div>
              <p className="text-slate-500 text-sm">No triages yet.</p>
              <p className="text-slate-600 text-xs mt-1">Run your first triage above to get started.</p>
            </div>
          </CardBody>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => navigate(`/results/${entry.id}`)}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <VerdictBadge verdict={entry.verdict} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-cyan-400">{entry.issue_key}</span>
                      {entry.trigger_type === 'auto' && (
                        <Badge variant="auto" size="sm">Auto</Badge>
                      )}
                    </div>
                    <span className="font-mono text-xs text-slate-500 truncate block">{entry.indicator}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-500">{formatRelativeTime(entry.timestamp)}</span>
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
