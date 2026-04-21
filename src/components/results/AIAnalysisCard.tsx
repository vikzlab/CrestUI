import { Brain, CheckCircle2, Clock, Cpu, Tag } from 'lucide-react';
import type { VerdictData } from '@/types';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { formatDuration } from '@/utils/formatters';

interface AIAnalysisCardProps {
  verdict: VerdictData;
}

const PROMPT_VERSION = 'TRIAGE_PROMPT_V2.0';

export function AIAnalysisCard({ verdict }: AIAnalysisCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Brain size={14} className="text-cyan-400" />
            AI Analysis
          </h3>
          <div className="flex items-center gap-2">
            {verdict.fallback_mode && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                Fallback Mode
              </span>
            )}
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-400 border border-violet-500/20">
              {verdict.prompt_version ?? PROMPT_VERSION}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-5">
        {/* Reasoning */}
        <div>
          <div className="text-xs text-slate-500 mb-2">Reasoning</div>
          <p className="text-sm text-slate-300 leading-relaxed">{verdict.reasoning}</p>
        </div>

        {/* Key factors */}
        {verdict.key_factors.length > 0 && (
          <div>
            <div className="text-xs text-slate-500 mb-2">Key Factors</div>
            <ul className="space-y-1.5">
              {verdict.key_factors.map((factor, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Model info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <Cpu size={14} className="text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-500">Model</div>
              <div className="text-xs font-mono text-slate-300">{verdict.model_used}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <Clock size={14} className="text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-500">AI Latency</div>
              <div className="text-xs font-mono text-slate-300">{formatDuration(verdict.latency_ms)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-800 col-span-2">
            <Tag size={14} className="text-violet-400" />
            <div>
              <div className="text-[10px] text-slate-500">Prompt Version</div>
              <div className="text-xs font-mono text-violet-400">{verdict.prompt_version ?? PROMPT_VERSION}</div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
