import { useState } from 'react';
import { Copy, ExternalLink, Zap, Check, FileText, Clock } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TriageResult } from '@/types';
import { VerdictHero } from './VerdictHero';
import { AlertInfoCard } from './AlertInfoCard';
import { EnrichmentCard } from './EnrichmentCard';
import { AIAnalysisCard } from './AIAnalysisCard';
import { ActionsCard } from './ActionsCard';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { formatDuration } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

interface ResultsViewProps {
  result: TriageResult;
}

export function ResultsView({ result }: ResultsViewProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const jiraBaseUrl = import.meta.env.VITE_JIRA_BASE_URL || 'https://crestdata.atlassian.net';

  const copySummary = async () => {
    await navigator.clipboard.writeText(result.summary_text);
    setCopied(true);
    toast.success('Summary copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Verdict hero */}
      <VerdictHero result={result} />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="secondary"
          onClick={copySummary}
          leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}
        >
          {copied ? 'Copied!' : 'Copy Summary'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => window.open(`${jiraBaseUrl}/browse/${result.alert.issue_key}`, '_blank')}
          leftIcon={<ExternalLink size={14} />}
        >
          View in Jira
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate('/')}
          leftIcon={<Zap size={14} />}
        >
          New Triage
        </Button>
        <div className="ml-auto flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Clock size={12} />
          <span>Total: {formatDuration(result.duration_ms)}</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="xl:col-span-1 space-y-6">
          <AlertInfoCard alert={result.alert} />
          <ActionsCard
            verdict={result.verdict.classification}
            suppressAlert={result.verdict.suppress_alert}
            recommendedPriority={result.verdict.recommended_priority}
          />
        </div>

        {/* Middle column */}
        <div className="xl:col-span-1 space-y-6">
          <EnrichmentCard enrichment={result.enrichment} />
        </div>

        {/* Right column */}
        <div className="xl:col-span-1 space-y-6">
          <AIAnalysisCard verdict={result.verdict} />

          {/* Summary markdown card */}
          <Card>
            <CardHeader>
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <FileText size={14} className="text-cyan-400" />
                Full Summary
              </h3>
            </CardHeader>
            <CardBody>
              <div className="prose prose-sm prose-invert max-w-none text-slate-300
                prose-headings:text-slate-200 prose-headings:font-semibold
                prose-strong:text-slate-200
                prose-code:text-cyan-400 prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                prose-li:marker:text-cyan-400">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.summary_text}
                </ReactMarkdown>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
