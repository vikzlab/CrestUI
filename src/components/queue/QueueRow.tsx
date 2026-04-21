import { Zap, Loader2, CheckCircle2 } from 'lucide-react';
import type { QueueAlert } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PriorityScore } from './PriorityScore';
import { PRIORITY_COLORS } from '@/utils/constants';
import { clsx } from 'clsx';

interface QueueRowProps {
  alert: QueueAlert;
  index: number;
  onTriage: (issueKey: string) => void;
  isRunning?: boolean;
}

function formatAge(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function QueueRow({ alert, index, onTriage, isRunning }: QueueRowProps) {
  const isAutoTriggered = alert.auto_triggered || alert.priority === 'P0' || alert.priority === 'Critical';
  const isComplete = alert.triage_status === 'complete';

  return (
    <tr
      className={clsx(
        'border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors group',
        index % 2 === 0 ? 'bg-transparent' : 'bg-slate-900/20',
        isAutoTriggered && 'border-l-2 border-l-violet-500/50',
      )}
    >
      {/* Priority Score */}
      <td className="px-4 py-3">
        <PriorityScore score={alert.priority_score} size="sm" />
      </td>

      {/* Issue Key */}
      <td className="px-4 py-3">
        <span className="font-mono text-sm text-cyan-400 group-hover:text-cyan-300 transition-colors">
          {alert.issue_key}
        </span>
      </td>

      {/* Summary */}
      <td className="px-4 py-3 max-w-xs">
        <span className="text-sm text-slate-300 line-clamp-1">{alert.summary}</span>
      </td>

      {/* Priority */}
      <td className="px-4 py-3">
        <span
          className={clsx(
            'text-xs px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider',
            PRIORITY_COLORS[alert.priority] ?? 'text-slate-400 bg-slate-800 border-slate-700',
          )}
        >
          {alert.priority}
        </span>
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

      {/* Actions */}
      <td className="px-4 py-3">
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
  );
}
