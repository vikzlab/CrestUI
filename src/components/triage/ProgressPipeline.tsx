import { XCircle, Clock } from 'lucide-react';
import type { PipelineStage } from '@/types';
import { StageIndicator } from './StageIndicator';
import { Button } from '@/components/ui/Button';
import { formatDuration } from '@/utils/formatters';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

interface ProgressPipelineProps {
  stages: PipelineStage[];
  elapsedMs: number;
  onCancel?: () => void;
  jiraKey?: string;
  error?: string | null;
}

export function ProgressPipeline({ stages, elapsedMs, onCancel, jiraKey, error }: ProgressPipelineProps) {
  const completedCount = stages.filter((s) => s.status === 'complete').length;
  const progressPct = Math.round((completedCount / stages.length) * 100);
  const hasError = stages.some((s) => s.status === 'error') || !!error;

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-100">Running Triage</h2>
            {jiraKey && (
              <p className="text-xs text-slate-500 mt-0.5 font-mono">{jiraKey}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Clock size={12} />
              <span>{formatDuration(elapsedMs)}</span>
            </div>
            {onCancel && !hasError && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                leftIcon={<XCircle size={14} />}
                className="text-slate-500 hover:text-red-400"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              hasError ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 to-cyan-400'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </CardHeader>

      <CardBody>
        <div className="space-y-0">
          {stages.map((stage, index) => (
            <StageIndicator
              key={stage.id}
              stage={stage}
              index={index}
              isLast={index === stages.length - 1}
            />
          ))}
        </div>

        {error && !stages.some((s) => s.status === 'error') && (
          <div className="mt-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
