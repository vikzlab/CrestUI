import type { TriageResult } from '@/types';
import { VerdictBadge } from './VerdictBadge';
import { Badge } from '@/components/ui/Badge';
import { CONFIDENCE_COLORS, PRIORITY_COLORS } from '@/utils/constants';
import { clsx } from 'clsx';

interface VerdictHeroProps {
  result: TriageResult;
}

const verdictBgGradients = {
  malicious: 'from-red-500/5 via-transparent to-transparent',
  suspicious: 'from-amber-500/5 via-transparent to-transparent',
  benign: 'from-emerald-500/5 via-transparent to-transparent',
};

export function VerdictHero({ result }: VerdictHeroProps) {
  const { verdict, alert, auto_triggered } = result;

  return (
    <div
      className={clsx(
        'rounded-2xl border border-slate-800 bg-gradient-to-br p-8 shadow-2xl relative overflow-hidden',
        verdictBgGradients[verdict.classification],
        verdict.classification === 'malicious' && 'border-red-500/20',
        verdict.classification === 'suspicious' && 'border-amber-500/20',
        verdict.classification === 'benign' && 'border-emerald-500/20',
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className={clsx(
            'absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl',
            verdict.classification === 'malicious' && 'bg-red-500',
            verdict.classification === 'suspicious' && 'bg-amber-500',
            verdict.classification === 'benign' && 'bg-emerald-500',
          )}
        />
      </div>

      <div className="relative">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {auto_triggered && (
            <Badge variant="auto" pulse>Auto-Triggered</Badge>
          )}
          {verdict.suppress_alert && (
            <Badge variant="slate">Suppress Alert</Badge>
          )}
          {verdict.fallback_mode && (
            <Badge variant="slate">Fallback Mode</Badge>
          )}
        </div>

        {/* Main verdict */}
        <VerdictBadge verdict={verdict.classification} size="hero" />

        {/* Issue key and indicator */}
        <div className="mt-6 space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-lg font-bold text-slate-100">{alert.issue_key}</span>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-base text-slate-300">{alert.indicator}</span>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-md font-mono">
              {alert.indicator_type}
            </span>
          </div>
        </div>

        {/* Confidence and priority */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">Confidence</span>
            <span
              className={clsx(
                'text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                CONFIDENCE_COLORS[verdict.confidence],
              )}
            >
              {verdict.confidence}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">Recommended Priority</span>
            <span
              className={clsx(
                'text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                PRIORITY_COLORS[verdict.recommended_priority] ?? PRIORITY_COLORS['Medium'],
              )}
            >
              {verdict.recommended_priority}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">Model</span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
              {verdict.model_used}
            </span>
          </div>
          {verdict.prompt_version && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Prompt</span>
              <span className="text-xs font-mono text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md">
                {verdict.prompt_version}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
