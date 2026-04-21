import { CheckCircle2, XCircle, Loader2, Circle, Search, Database, Brain, FileText, type LucideIcon } from 'lucide-react';
import type { PipelineStage } from '@/types';
import { clsx } from 'clsx';

const ICONS: Record<string, LucideIcon> = {
  Search,
  Database,
  Brain,
  FileText,
};

interface StageIndicatorProps {
  stage: PipelineStage;
  index: number;
  isLast: boolean;
}

export function StageIndicator({ stage, index, isLast }: StageIndicatorProps) {
  const Icon: LucideIcon = ICONS[stage.icon] ?? Circle;

  const statusConfig = {
    pending: {
      iconEl: <Circle size={16} className="text-slate-600" />,
      dot: 'bg-slate-700 border-slate-600',
      text: 'text-slate-500',
      label: 'Waiting',
    },
    'in-progress': {
      iconEl: <Loader2 size={16} className="text-cyan-400 animate-spin" />,
      dot: 'bg-cyan-500/20 border-cyan-500 shadow-sm shadow-cyan-500/30',
      text: 'text-cyan-400',
      label: 'Running',
    },
    complete: {
      iconEl: <CheckCircle2 size={16} className="text-emerald-400" />,
      dot: 'bg-emerald-500/20 border-emerald-500',
      text: 'text-emerald-400',
      label: 'Done',
    },
    error: {
      iconEl: <XCircle size={16} className="text-red-400" />,
      dot: 'bg-red-500/20 border-red-500',
      text: 'text-red-400',
      label: 'Failed',
    },
  };

  const config = statusConfig[stage.status];

  return (
    <div className="flex items-start gap-4 animate-fade-in">
      {/* Left: Step indicator + connector line */}
      <div className="flex flex-col items-center">
        <div
          className={clsx(
            'w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-500 flex-shrink-0',
            config.dot,
          )}
        >
          <Icon size={16} className={clsx(config.text, 'opacity-80')} />
        </div>
        {!isLast && (
          <div
            className={clsx(
              'w-0.5 mt-1 transition-all duration-700 rounded-full',
              stage.status === 'complete' ? 'bg-emerald-500/40 h-8' : 'bg-slate-800 h-8',
            )}
          />
        )}
      </div>

      {/* Right: Content */}
      <div className="flex-1 pb-6 min-w-0">
        <div className="flex items-center gap-2 mt-1.5">
          <span className={clsx('text-sm font-semibold', config.text)}>{stage.label}</span>
          {config.iconEl}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{stage.description}</p>
        {stage.status === 'error' && (
          <p className="text-xs text-red-400 mt-1">Stage failed — check connection and retry</p>
        )}
      </div>

      {/* Step number */}
      <div className="text-xs text-slate-700 font-mono mt-2 flex-shrink-0">
        {String(index + 1).padStart(2, '0')}
      </div>
    </div>
  );
}
