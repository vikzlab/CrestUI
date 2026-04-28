import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Activity, Clock, AlertTriangle, List, ChevronRight, Zap, TrendingUp, BarChart2 } from 'lucide-react';
import { TriageForm } from '@/components/triage/TriageForm';
import { ProgressPipeline } from '@/components/triage/ProgressPipeline';
import { VerdictBadge } from '@/components/results/VerdictBadge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CrestDataLogo } from '@/components/ui/CrestDataLogo';
import { useHistory } from '@/hooks/useHistory';
import { useQueue } from '@/hooks/useQueue';
import { useTriage } from '@/hooks/useTriage';
import { formatRelativeTime, formatDuration } from '@/utils/formatters';
import { clsx } from 'clsx';

interface BarSegment { label: string; count: number; color: string; bg: string }

function MiniBarChart({ title, segments, total }: { title: string; segments: BarSegment[]; total: number }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <BarChart2 size={12} className="text-cyan-400" />
          {title}
        </h3>
      </CardHeader>
      <CardBody className="py-4 space-y-3">
        {total === 0 ? (
          <p className="text-xs text-slate-600 text-center py-2">No data yet</p>
        ) : (
          segments.map(({ label, count, color, bg }) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className={clsx('text-xs font-medium capitalize', color)}>{label}</span>
                  <span className="text-xs text-slate-500 font-mono">{count} · {pct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={clsx('h-full rounded-full transition-all duration-500', bg)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardBody>
    </Card>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { entries, stats } = useHistory();
  const { data: queue } = useQueue();
  const triage = useTriage();
  const [activeTriageKey, setActiveTriageKey] = useState('');

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
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      trend: '+0',
    },
    {
      label: 'Malicious',
      value: stats.malicious_count,
      icon: <AlertTriangle size={16} />,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20',
      trend: null,
    },
    {
      label: 'Avg Duration',
      value: stats.avg_duration_ms > 0 ? formatDuration(stats.avg_duration_ms) : '—',
      icon: <Clock size={16} />,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      trend: null,
    },
    {
      label: 'Queue Size',
      value: queue?.length ?? 0,
      icon: <List size={16} />,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
      trend: null,
    },
  ];

  return (
    <div className="space-y-7 animate-fade-in">
      {/* ── Hero ─────────────────────────────────────── */}
      <div className="relative rounded-2xl border border-slate-800/60 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/80 to-[#070b16]" />
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-violet-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500 rounded-full blur-3xl" />
        </div>
        {/* Grid decoration */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative px-8 pt-8 pb-10">
          {/* Crest Data branding */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CrestDataLogo size="md" variant="full" />
              <div className="h-5 w-px bg-slate-700" />
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">SOC Triage Platform</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <TrendingUp size={11} className="text-cyan-400" />
              <span className="text-[11px] text-cyan-400 font-medium">AI-Powered</span>
            </div>
          </div>

          {/* Headline */}
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold text-slate-100 mb-2 leading-tight">
              Automated Alert Triage
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-7">
              Enter a Jira issue key to run the full triage pipeline — Jira retrieval, VirusTotal enrichment, Claude AI classification, and summary posted back automatically.
            </p>
            <TriageForm onSubmit={handleTriage} isLoading={triage.isRunning} size="hero" />
          </div>

          {/* Pipeline steps teaser */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            {[
              { n: '01', label: 'Alert Retrieval' },
              { n: '02', label: 'VT Enrichment' },
              { n: '03', label: 'Claude Analysis' },
              { n: '04', label: 'Summary Posted' },
            ].map((step, i, arr) => (
              <div key={step.n} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] font-mono text-slate-600">{step.n}</span>
                  <span className="text-xs text-slate-400">{step.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <ChevronRight size={12} className="text-slate-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Active triage progress ────────────────────── */}
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

      {/* ── Stats cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <Card key={card.label}>
            <CardBody className="py-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-slate-500 mb-1.5">{card.label}</div>
                  <div className={clsx('text-2xl font-bold', card.color)}>
                    {card.value}
                  </div>
                </div>
                <div className={clsx('w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0', card.bg, card.color)}>
                  {card.icon}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* ── Security posture KPIs ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MiniBarChart
          title="Alerts by Verdict"
          total={entries.length}
          segments={[
            { label: 'Malicious',  count: stats.verdict_counts.malicious,  color: 'text-red-400',     bg: 'bg-red-500' },
            { label: 'Suspicious', count: stats.verdict_counts.suspicious, color: 'text-amber-400',   bg: 'bg-amber-500' },
            { label: 'Benign',     count: stats.verdict_counts.benign,     color: 'text-emerald-400', bg: 'bg-emerald-500' },
          ]}
        />
        <MiniBarChart
          title="Alerts by Severity"
          total={entries.length}
          segments={[
            { label: 'High Confidence',   count: stats.confidence_counts.high,   color: 'text-red-400',     bg: 'bg-red-500' },
            { label: 'Medium Confidence', count: stats.confidence_counts.medium, color: 'text-amber-400',   bg: 'bg-amber-400' },
            { label: 'Low Confidence',    count: stats.confidence_counts.low,    color: 'text-slate-400',   bg: 'bg-slate-500' },
          ]}
        />
        <MiniBarChart
          title="Alerts by Priority"
          total={entries.length}
          segments={[
            { label: 'P0 Critical', count: stats.priority_counts.P0,    color: 'text-red-400',    bg: 'bg-red-500' },
            { label: 'P1 High',     count: stats.priority_counts.P1,    color: 'text-orange-400', bg: 'bg-orange-500' },
            { label: 'P2 Medium',   count: stats.priority_counts.P2,    color: 'text-amber-400',  bg: 'bg-amber-400' },
            { label: 'P3 Low',      count: stats.priority_counts.P3,    color: 'text-blue-400',   bg: 'bg-blue-500' },
          ]}
        />
      </div>

      {/* ── Recent triages ────────────────────────────── */}
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
            <div className="flex flex-col items-center py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-4">
                <Zap size={22} className="text-slate-600" />
              </div>
              <p className="text-slate-400 text-sm font-medium">No triages yet</p>
              <p className="text-slate-600 text-xs mt-1.5 max-w-xs">
                Enter a Jira issue key above to run your first AI-powered triage.
              </p>
            </div>
          </CardBody>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => navigate(`/results/${entry.id}`)}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/20 cursor-pointer transition-colors group"
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
                  <span className="text-xs text-slate-500 hidden sm:block">{formatRelativeTime(entry.timestamp)}</span>
                  <ChevronRight size={13} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── Footer attribution ────────────────────────── */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/40">
        <div className="flex items-center gap-2">
          <CrestDataLogo size="sm" variant="full" />
          <span className="text-xs text-slate-700">· Capstone Project 2026</span>
        </div>
        <span className="text-xs text-slate-700 font-mono">SOC Triage v1.0</span>
      </div>
    </div>
  );
}
