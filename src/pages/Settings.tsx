import { useState } from 'react';
import { Settings as SettingsIcon, Wifi, Trash2, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CrestDataLogo } from '@/components/ui/CrestDataLogo';
import { useHistoryStore } from '@/store/historyStore';
import { useHealthCheck } from '@/hooks/useHealthCheck';

export function Settings() {
  const clearHistory = useHistoryStore((s) => s.clearHistory);
  const entries = useHistoryStore((s) => s.entries);
  const { connection, refresh } = useHealthCheck(0);

  const defaultApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const defaultJiraUrl = import.meta.env.VITE_JIRA_BASE_URL || 'https://crestdata.atlassian.net';

  const [apiUrl, setApiUrl] = useState<string>(() => localStorage.getItem('soc_api_url') || defaultApiUrl);
  const [jiraUrl, setJiraUrl] = useState<string>(() => localStorage.getItem('soc_jira_url') || defaultJiraUrl);
  const [testing, setTesting] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const saveApiUrl = () => {
    const url = apiUrl.trim().replace(/\/$/, '');
    localStorage.setItem('soc_api_url', url);
    setApiUrl(url);
    toast.success('API URL saved');
  };

  const testConnection = async () => {
    setTesting(true);
    await refresh();
    setTesting(false);
  };

  const handleClearHistory = () => {
    if (confirmClear) {
      clearHistory();
      setConfirmClear(false);
      toast.success('History cleared');
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 5000);
    }
  };

  const connectionStatusColor = {
    connected: 'text-emerald-400',
    disconnected: 'text-red-400',
    checking: 'text-amber-400',
  }[connection.status];

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            <SettingsIcon size={16} className="text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        </div>
        <p className="text-sm text-slate-500 ml-11">Configure the SOC Triage system</p>
      </div>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Wifi size={14} className="text-cyan-400" />
            Backend Connection
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <Input
              label="API URL"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8000"
              className="font-mono text-sm"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Base URL for the FastAPI backend. Changes saved to localStorage.
            </p>
          </div>

          {/* Connection status */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center gap-2 flex-1">
              {connection.status === 'connected' ? (
                <Check size={14} className="text-emerald-400" />
              ) : (
                <AlertCircle size={14} className="text-red-400" />
              )}
              <span className={`text-sm font-medium ${connectionStatusColor}`}>
                {connection.status === 'connected' ? 'Server reachable' : connection.status === 'checking' ? 'Checking…' : 'Server unreachable'}
              </span>
              {connection.status === 'connected' && connection.latency_ms && (
                <span className="text-xs text-slate-500 font-mono">({connection.latency_ms}ms)</span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={saveApiUrl} leftIcon={<Check size={14} />}>
              Save URL
            </Button>
            <Button
              variant="secondary"
              onClick={testConnection}
              loading={testing}
              leftIcon={<Wifi size={14} />}
            >
              Test Connection
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Jira Configuration */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <ExternalLink size={14} className="text-cyan-400" />
            Jira Configuration
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <Input
              label="Jira Base URL"
              value={jiraUrl}
              onChange={(e) => setJiraUrl(e.target.value)}
              placeholder="https://yourorg.atlassian.net"
              className="font-mono text-sm"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Used to generate "View in Jira" links on result pages.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              localStorage.setItem('soc_jira_url', jiraUrl.trim());
              toast.success('Jira URL saved');
            }}
            leftIcon={<Check size={14} />}
          >
            Save Jira URL
          </Button>
        </CardBody>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Trash2 size={14} className="text-red-400" />
            Data Management
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div>
              <div className="text-sm text-slate-300 font-medium">Triage History</div>
              <div className="text-xs text-slate-500 mt-0.5">{entries.length} entries stored locally</div>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={handleClearHistory}
              disabled={entries.length === 0}
              leftIcon={<Trash2 size={14} />}
            >
              {confirmClear ? 'Click to Confirm' : 'Clear History'}
            </Button>
          </div>
          {confirmClear && (
            <p className="text-xs text-amber-400">
              Click "Click to Confirm" again to permanently delete all {entries.length} history entries. This cannot be undone.
            </p>
          )}
        </CardBody>
      </Card>

      {/* About */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <CrestDataLogo size="md" variant="full" />
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <div className="text-sm font-semibold text-slate-300">SOC Alert Triage System</div>
                <div className="text-xs text-slate-500 mt-0.5">Version 1.0.0 · Phase 2 · Capstone 2026</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-1 rounded-md">TRIAGE_PROMPT_V2.0</span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded-md">claude-sonnet-4</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
