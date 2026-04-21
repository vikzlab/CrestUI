export const PIPELINE_STAGES = [
  {
    id: 'retrieval',
    label: 'Alert Retrieval',
    description: 'Fetching alert from Jira',
    icon: 'Search',
  },
  {
    id: 'enrichment',
    label: 'Enrichment',
    description: 'Querying VirusTotal',
    icon: 'Database',
  },
  {
    id: 'analysis',
    label: 'Claude Analysis',
    description: 'AI classification',
    icon: 'Brain',
  },
  {
    id: 'summary',
    label: 'Summary Posted',
    description: 'Writing back to Jira',
    icon: 'FileText',
  },
] as const;

export const STAGE_TIMINGS = {
  retrieval: { start: 0, end: 20 },
  enrichment: { start: 20, end: 45 },
  analysis: { start: 45, end: 80 },
  summary: { start: 80, end: 100 },
};

export const VERDICT_COLORS = {
  malicious: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    badge: 'bg-red-500/20 text-red-400 border border-red-500/30',
    glow: 'shadow-red-500/20',
  },
  suspicious: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    glow: 'shadow-amber-500/20',
  },
  benign: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    glow: 'shadow-emerald-500/20',
  },
};

export const PRIORITY_COLORS: Record<string, string> = {
  P0: 'text-red-400 bg-red-500/10 border-red-500/30',
  P1: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  P2: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  P3: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  Critical: 'text-red-400 bg-red-500/10 border-red-500/30',
  High: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  Low: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
};

export const CONFIDENCE_COLORS = {
  high: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  low: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
};

export const HISTORY_STORAGE_KEY = 'soc_triage_history';
export const API_URL_STORAGE_KEY = 'soc_api_url';
export const THEME_STORAGE_KEY = 'soc_theme';
export const LAST_TRIAGE_STORAGE_KEY = 'soc_last_triage_id';
export const MAX_HISTORY_ENTRIES = 50;
export const QUEUE_REFRESH_INTERVAL = 30000;
export const TRIAGE_TIMEOUT_MS = 60000;
