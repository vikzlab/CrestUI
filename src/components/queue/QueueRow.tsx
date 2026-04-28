import { useState } from 'react';
import { Zap, Loader2, CheckCircle2, AlertOctagon, ChevronDown, Copy, Check, Clock, Hash, Globe, Wifi, FileSearch } from 'lucide-react';
import { toast } from 'sonner';
import type { QueueAlert } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PriorityScore } from './PriorityScore';
import { PRIORITY_COLORS } from '@/utils/constants';
import { clsx } from 'clsx';

type TriageStatus = QueueAlert['triage_status'];

function StatusBadge({ status }: { status: TriageStatus }) {
  if (status === 'running') return <Badge variant="cyan" pulse>In-Progress</Badge>;
  if (status === 'complete') return <Badge variant="benign">Closed</Badge>;
  if (status === 'error') return <Badge variant="malicious">Error</Badge>;
  return <Badge variant="slate">Open</Badge>;
}

const INDICATOR_ICONS: Record<string, React.ReactNode> = {
  domain: <Globe size={12} />,
  url:    <Globe size={12} />,
  ip:     <Wifi size={12} />,
  hash:   <Hash size={12} />,
};

function formatAge(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m ago` : `${hours}h ago`;
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-red-500' :
    score >= 60 ? 'bg-orange-500' :
    score >= 40 ? 'bg-amber-400' : 'bg-blue-500';
  return (
    <div className="h-1 w-full rounded-full bg-slate-700 overflow-hidden">
      <div className={clsx('h-full rounded-full', color)} style={{ width: `${score}%` }} />
    </div>
  );
}

interface QueueRowProps {
  alert: QueueAlert;
  index: number;
  onTriage: (issueKey: string) => void;
  isRunning?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

function ExpandedPanel({ alert, onTriage, isRunning }: { alert: QueueAlert; onTriage: (k: string) => void; isRunning?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(alert.indicator);
    setCopied(true);
    toast.success('Indicator copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreDesc =
    alert.priority_score >= 90 ? 'Critical threat — immediate action required' :
    alert.priority_score >= 70 ? 'High-risk alert — triage recommended soon' :
    alert.priority_score >= 50 ? 'Moderate risk — schedule for review' :
    'Low risk — monitor and log';

  const statusLabel = alert.triage_status === 'complete' ? 'Triage complete' :
    alert.triage_status === 'running' ? 'Triage in progress' :
    alert.triage_status === 'error'   ? 'Triage failed — retry available' :
    'Awaiting triage';

  return (
    <tr className="border-b border-slate-800/60">
      <td colSpan={8} className="px-0 py-0">
        <div className="mx-3 mb-3 rounded-xl border border-slate-700/60 bg-slate-900/80 overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/60 bg-slate-800/30">
            <div className="flex items-center gap-2">
              <FileSearch size={13} className="text-cyan-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Alert Details</span>
              <span className="font-mono text-xs text-cyan-400 ml-1">{alert.issue_key}</span>
            </div>
            {alert.auto_triggered && (
              <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
                Auto-Triggered
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/60">
            {/* Column 1 — Indicator */}
            <div className="px-5 py-4 space-y-3">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Indicator</p>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex-shrink-0 text-slate-500">
                  {INDICATOR_ICONS[alert.indicator_type] ?? <Hash size={12} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm text-slate-100 break-all leading-relaxed">{alert.indicator}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded">
                      {alert.indicator_type}
                    </span>
                    <button
                      onClick={copy}
                      className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      {copied ? <Check size={10} /> : <Copy size={10} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="pt-1">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Full Summary</p>
                <p className="text-xs text-slate-400 leading-relaxed">{alert.summary}</p>
              </div>
            </div>

            {/* Column 2 — Risk profile */}
            <div className="px-5 py-4 space-y-4">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Risk Profile</p>
              <div>
                <div className="flex items-end justify-between mb-1.5">
                  <span className="text-xs text-slate-400">Priority Score</span>
                  <span className={clsx('text-lg font-bold font-mono',
                    alert.priority_score >= 80 ? 'text-red-400' :
                    alert.priority_score >= 60 ? 'text-orange-400' :
                    alert.priority_score >= 40 ? 'text-amber-400' : 'text-blue-400'
                  )}>{alert.priority_score}</span>
                </div>
                <ScoreBar score={alert.priority_score} />
                <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">{scoreDesc}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 px-3 py-2">
                  <p className="text-[10px] text-slate-500 mb-0.5">Priority</p>
                  <span className={clsx('text-xs font-bold uppercase', PRIORITY_COLORS[alert.priority]?.split(' ')[0])}>
                    {alert.priority}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 px-3 py-2">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Clock size={9} className="text-slate-500" />
                    <p className="text-[10px] text-slate-500">Age</p>
                  </div>
                  <span className="text-xs font-bold text-slate-300 font-mono">{formatAge(alert.age_minutes)}</span>
                </div>
              </div>
            </div>

            {/* Column 3 — Status & Actions */}
            <div className="px-5 py-4 space-y-4">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Status & Actions</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                  <StatusBadge status={isRunning ? 'running' : alert.triage_status} />
                  <span className="text-xs text-slate-400">{statusLabel}</span>
                </div>
                {alert.triage_id && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/40">
                    <span className="text-[10px] text-slate-500">Triage ID:</span>
                    <span className="font-mono text-[10px] text-cyan-400">{alert.triage_id}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {alert.triage_status !== 'complete' && (
                  <Button
                    size="sm"
                    onClick={() => onTriage(alert.issue_key)}
                    loading={isRunning}
                    leftIcon={!isRunning ? <Zap size={12} /> : undefined}
                  >
                    {isRunning ? 'Running Triage…' : 'Run Triage'}
                  </Button>
                )}
                {alert.triage_status === 'complete' && (
                  <Button size="sm" variant="secondary" leftIcon={<CheckCircle2 size={12} />} onClick={() => {}}>
                    View Results
                  </Button>
                )}
                {alert.triage_status === 'error' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onTriage(alert.issue_key)}
                    loading={isRunning}
                    leftIcon={<Zap size={12} />}
                  >
                    Retry Triage
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export function QueueRow({ alert, index, onTriage, isRunning, isExpanded = false, onToggleExpand }: QueueRowProps) {
  const isP0Critical = alert.auto_triggered && (alert.priority === 'P0' || alert.priority === 'Critical');
  const isAutoTriggered = alert.auto_triggered || alert.priority === 'P0' || alert.priority === 'Critical';
  const isComplete = alert.triage_status === 'complete';

  return (
    <>
      <tr
        onClick={onToggleExpand}
        className={clsx(
          'border-b border-slate-800/60 transition-colors group cursor-pointer select-none',
          index % 2 === 0 ? 'bg-transparent' : 'bg-slate-900/20',
          isAutoTriggered && 'border-l-2 border-l-violet-500/50',
          isExpanded ? 'bg-slate-800/40' : 'hover:bg-slate-800/30',
        )}
      >
        {/* Priority Score */}
        <td className="px-4 py-3">
          <PriorityScore score={alert.priority_score} size="sm" />
        </td>

        {/* Issue Key */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-sm text-cyan-400 group-hover:text-cyan-300 transition-colors">
              {alert.issue_key}
            </span>
            <ChevronDown
              size={12}
              className={clsx(
                'text-slate-600 transition-transform duration-200',
                isExpanded && 'rotate-180 text-cyan-500',
              )}
            />
          </div>
        </td>

        {/* Summary */}
        <td className="px-4 py-3 max-w-xs">
          <span className="text-sm text-slate-300 line-clamp-1">{alert.summary}</span>
        </td>

        {/* Priority */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span
              className={clsx(
                'text-xs px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider',
                PRIORITY_COLORS[alert.priority] ?? 'text-slate-400 bg-slate-800 border-slate-700',
              )}
            >
              {alert.priority}
            </span>
            {isP0Critical && (
              <span
                title="P0 Critical — auto-triggered"
                className="flex items-center gap-0.5 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-1.5 py-0.5 rounded-full uppercase tracking-wide"
              >
                <AlertOctagon size={9} />
                Auto
              </span>
            )}
          </div>
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <StatusBadge status={isRunning ? 'running' : alert.triage_status} />
        </td>

        {/* Age */}
        <td className="px-4 py-3">
          <span className="text-xs text-slate-400 font-mono">{formatAge(alert.age_minutes)}</span>
        </td>

        {/* Indicator */}
        <td className="px-4 py-3 max-w-[150px]">
          <div>
            <span className="font-mono text-xs text-slate-300 truncate block">{alert.indicator}</span>
            <span className="text-[10px] text-slate-600 uppercase">{alert.indicator_type}</span>
          </div>
        </td>

        {/* Actions — stop propagation so buttons don't toggle expand */}
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          {isAutoTriggered ? (
            <div className="flex items-center gap-2">
              {isRunning ? (
                <Badge variant="auto" pulse>
                  <Loader2 size={10} className="animate-spin" />
                  Running
                </Badge>
              ) : isComplete ? (
                <Badge variant="benign">
                  <CheckCircle2 size={10} />
                  Done
                </Badge>
              ) : (
                <Badge variant="auto">Auto-Triggered</Badge>
              )}
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => onTriage(alert.issue_key)}
              loading={isRunning}
              leftIcon={!isRunning ? <Zap size={12} /> : undefined}
            >
              {isRunning ? 'Running' : 'Run Triage'}
            </Button>
          )}
        </td>
      </tr>

      {isExpanded && (
        <ExpandedPanel alert={alert} onTriage={onTriage} isRunning={isRunning} />
      )}
    </>
  );
}
