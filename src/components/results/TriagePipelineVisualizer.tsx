import { useEffect, useState } from 'react';
import { Search, Database, Brain, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { formatDuration } from '@/utils/formatters';
import { clsx } from 'clsx';
import type { TriageResult } from '@/types';

interface StageConfig {
  id: string;
  label: string;
  detail: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  durationShare: number; // fraction of total duration_ms this stage took
}

const STAGE_CONFIGS: Omit<StageConfig, 'durationShare'>[] = [
  {
    id: 'retrieval',
    label: 'Alert Retrieval',
    detail: 'Fetched from Jira',
    icon: <Search size={14} />,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  },
  {
    id: 'enrichment',
    label: 'VT Enrichment',
    detail: 'VirusTotal IOC lookup',
    icon: <Database size={14} />,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
  },
  {
    id: 'analysis',
    label: 'Claude Analysis',
    detail: 'AI classification',
    icon: <Brain size={14} />,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  {
    id: 'summary',
    label: 'Summary Posted',
    detail: 'Written back to Jira',
    icon: <FileText size={14} />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
];

// Approximate time split per stage based on STAGE_TIMINGS constants
const DURATION_SHARES = [0.20, 0.30, 0.38, 0.12];

interface StageNodeProps {
  config: StageConfig;
  index: number;
  revealed: boolean;
  isLast: boolean;
  stageDurationMs: number;
}

function StageNode({ config, index, revealed, isLast, stageDurationMs }: StageNodeProps) {
  return (
    <div className="flex items-stretch gap-0">
      <div className="flex flex-col items-center">
        {/* Node circle */}
        <div
          className={clsx(
            'relative w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-500',
            revealed
              ? [config.bg, config.border, config.color, 'shadow-lg']
              : 'bg-slate-800/60 border-slate-700 text-slate-600',
          )}
          style={{ transitionDelay: `${index * 120}ms` }}
        >
          {revealed ? (
            <>
              {config.icon}
              <span
                className={clsx(
                  'absolute -top-1 -right-1 w-4 h-4 rounded-full border flex items-center justify-center',
                  config.bg, config.border,
                )}
              >
                <CheckCircle2 size={9} className={config.color} />
              </span>
            </>
          ) : (
            config.icon
          )}
        </div>

        {/* Connector line */}
        {!isLast && (
          <div className="w-0.5 flex-1 min-h-[28px] mt-1">
            <div
              className={clsx(
                'w-full h-full transition-all duration-700 rounded-full',
                revealed ? config.bg.replace('/10', '/40') : 'bg-slate-800',
              )}
              style={{ transitionDelay: `${index * 120 + 200}ms` }}
            />
          </div>
        )}
      </div>

      {/* Label + detail */}
      <div
        className={clsx(
          'ml-3 pb-6 transition-all duration-500',
          revealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2',
        )}
        style={{ transitionDelay: `${index * 120 + 60}ms` }}
      >
        <div className={clsx('text-sm font-semibold', revealed ? config.color : 'text-slate-600')}>
          {config.label}
        </div>
        <div className="text-xs text-slate-500 mt-0.5">{config.detail}</div>
        {revealed && (
          <div className="flex items-center gap-1 mt-1">
            <Clock size={10} className="text-slate-600" />
            <span className="text-[10px] font-mono text-slate-600">{formatDuration(stageDurationMs)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface TriagePipelineVisualizerProps {
  result: TriageResult;
}

export function TriagePipelineVisualizer({ result }: TriagePipelineVisualizerProps) {
  const [revealedCount, setRevealedCount] = useState(0);

  // Animate stages in sequentially on mount
  useEffect(() => {
    if (revealedCount >= STAGE_CONFIGS.length) return;
    const timer = setTimeout(() => {
      setRevealedCount((n) => n + 1);
    }, revealedCount === 0 ? 300 : 500);
    return () => clearTimeout(timer);
  }, [revealedCount]);

  const stages: StageConfig[] = STAGE_CONFIGS.map((s, i) => ({
    ...s,
    durationShare: DURATION_SHARES[i],
  }));

  const isSuccess = result.success;
  const totalMs = result.duration_ms;

  // Model + prompt metadata for the analysis node
  const modelLabel = result.verdict?.model_used ?? 'claude-sonnet-4';
  const promptVersion = result.verdict?.prompt_version ?? 'v2.0';
  const detectionRatio = result.enrichment?.detection_ratio ?? 0;

  const stageDetails = [
    `${result.alert.issue_key} · ${result.alert.indicator_type}`,
    `${Math.round(detectionRatio * 100)}% detection ratio`,
    `${modelLabel} · ${promptVersion}`,
    `${result.verdict.classification.toUpperCase()} verdict posted`,
  ];

  const enrichedStages = stages.map((s, i) => ({
    ...s,
    detail: stageDetails[i] ?? s.detail,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Search size={11} className="text-cyan-400" />
            </div>
            Triage Pipeline
          </h3>
          <div className="flex items-center gap-2">
            {isSuccess ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <CheckCircle2 size={12} />
                Complete
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-red-400 font-medium">
                <AlertCircle size={12} />
                Failed
              </span>
            )}
            <span className="text-xs text-slate-600 font-mono">{formatDuration(totalMs)}</span>
          </div>
        </div>
      </CardHeader>
      <CardBody className="py-5">
        {/* Progress bar */}
        <div className="mb-5 h-1 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 transition-all duration-1000"
            style={{ width: revealedCount >= STAGE_CONFIGS.length ? '100%' : `${(revealedCount / STAGE_CONFIGS.length) * 100}%` }}
          />
        </div>

        {/* Stage nodes */}
        <div className="flex flex-col">
          {enrichedStages.map((stage, i) => (
            <StageNode
              key={stage.id}
              config={stage}
              index={i}
              revealed={i < revealedCount}
              isLast={i === enrichedStages.length - 1}
              stageDurationMs={Math.round(totalMs * stage.durationShare)}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
