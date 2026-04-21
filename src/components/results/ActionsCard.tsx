import { CheckCircle2, AlertTriangle, BellOff } from 'lucide-react';
import type { VerdictClassification } from '@/types';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { getActionChecklist } from '@/utils/formatters';
import { PRIORITY_COLORS } from '@/utils/constants';
import { clsx } from 'clsx';

interface ActionsCardProps {
  verdict: VerdictClassification;
  suppressAlert: boolean;
  recommendedPriority: string;
}

export function ActionsCard({ verdict, suppressAlert, recommendedPriority }: ActionsCardProps) {
  const actions = getActionChecklist(verdict, suppressAlert);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-cyan-400" />
          Recommended Actions
        </h3>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Priority banner */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
          <span className="text-sm text-slate-400">Recommended Priority</span>
          <span
            className={clsx(
              'text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border',
              PRIORITY_COLORS[recommendedPriority] ?? PRIORITY_COLORS['Medium'],
            )}
          >
            {recommendedPriority}
          </span>
        </div>

        {/* Suppress alert notice */}
        {suppressAlert && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <BellOff size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-300">
              AI recommends suppressing this alert. Review carefully before auto-closing.
            </p>
          </div>
        )}

        {/* Action checklist */}
        <ul className="space-y-2">
          {actions.map((action, i) => {
            const isWarning = action.startsWith('⚠');
            return (
              <li key={i} className="flex items-start gap-2.5">
                {isWarning ? (
                  <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <div
                    className={clsx(
                      'w-4 h-4 rounded-full border flex-shrink-0 mt-0.5 flex items-center justify-center',
                      verdict === 'malicious'
                        ? 'border-red-500/40 bg-red-500/10'
                        : verdict === 'suspicious'
                        ? 'border-amber-500/40 bg-amber-500/10'
                        : 'border-emerald-500/40 bg-emerald-500/10',
                    )}
                  >
                    <span
                      className={clsx(
                        'w-1.5 h-1.5 rounded-full',
                        verdict === 'malicious'
                          ? 'bg-red-400'
                          : verdict === 'suspicious'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400',
                      )}
                    />
                  </div>
                )}
                <span className={clsx('text-sm leading-relaxed', isWarning ? 'text-amber-300' : 'text-slate-300')}>
                  {isWarning ? action.replace('⚠ ', '') : action}
                </span>
              </li>
            );
          })}
        </ul>
      </CardBody>
    </Card>
  );
}
