import { Plug, ExternalLink, Cpu, Shield } from 'lucide-react';
import { IntegrationTile } from '@/components/configuration/IntegrationTile';
import type { ConnectionTestResult } from '@/components/configuration/IntegrationTile';

async function testJira(values: Record<string, string>): Promise<ConnectionTestResult> {
  const url = values.endpoint?.trim();
  if (!url) return { success: false, message: 'No endpoint configured' };
  const start = Date.now();
  try {
    await fetch(`${url}/rest/api/2/serverInfo`, { method: 'GET', signal: AbortSignal.timeout(5000) });
    return { success: true, latency: Date.now() - start, message: 'Jira reachable' };
  } catch {
    return { success: false, message: 'Could not reach Jira endpoint' };
  }
}

async function testVirusTotal(values: Record<string, string>): Promise<ConnectionTestResult> {
  const key = values.apiKey?.trim();
  if (!key) return { success: false, message: 'No API key configured' };
  const start = Date.now();
  try {
    const res = await fetch('https://www.virustotal.com/api/v3/urls/aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbQ', {
      headers: { 'x-apikey': key },
      signal: AbortSignal.timeout(6000),
    });
    if (res.status === 401) return { success: false, message: 'Invalid API key' };
    return { success: true, latency: Date.now() - start, message: 'VirusTotal reachable' };
  } catch {
    return { success: false, message: 'Could not reach VirusTotal API' };
  }
}

async function testOpenAI(values: Record<string, string>): Promise<ConnectionTestResult> {
  const key = values.apiKey?.trim();
  const endpoint = (values.endpoint?.trim() || 'https://api.openai.com/v1').replace(/\/$/, '');
  if (!key) return { success: false, message: 'No API key configured' };
  const start = Date.now();
  try {
    const res = await fetch(`${endpoint}/models`, {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(6000),
    });
    if (res.status === 401) return { success: false, message: 'Invalid API key' };
    return { success: true, latency: Date.now() - start, message: 'OpenAI API reachable' };
  } catch {
    return { success: false, message: 'Could not reach OpenAI API' };
  }
}

export function Configuration() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            <Plug size={16} className="text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Integrations</h1>
        </div>
        <p className="text-sm text-slate-500 ml-11">
          Configure API endpoints and credentials for each platform integration.
        </p>
      </div>

      {/* Tile grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <IntegrationTile
          name="Jira"
          description="Issue tracking and alert source for SOC triage"
          icon={<ExternalLink size={16} />}
          accentColor="blue"
          badge="Atlassian"
          fields={[
            {
              key: 'endpoint',
              label: 'Jira Base URL',
              placeholder: 'https://yourorg.atlassian.net',
              type: 'url',
              storageKey: 'soc_jira_url',
            },
            {
              key: 'email',
              label: 'Account Email',
              placeholder: 'analyst@yourorg.com',
              type: 'text',
              storageKey: 'soc_jira_email',
            },
            {
              key: 'apiToken',
              label: 'API Token',
              placeholder: 'ATATT3xFfGF0…',
              type: 'password',
              storageKey: 'soc_jira_token',
            },
          ]}
          onTestConnection={testJira}
        />

        <IntegrationTile
          name="VirusTotal"
          description="Threat intelligence enrichment for IOC analysis"
          icon={<Shield size={16} />}
          accentColor="emerald"
          badge="v3 API"
          fields={[
            {
              key: 'endpoint',
              label: 'API Endpoint',
              placeholder: 'https://www.virustotal.com/api/v3',
              type: 'url',
              storageKey: 'soc_vt_endpoint',
            },
            {
              key: 'apiKey',
              label: 'API Key',
              placeholder: 'Your VirusTotal API key',
              type: 'password',
              storageKey: 'soc_vt_key',
            },
          ]}
          onTestConnection={testVirusTotal}
        />

        <IntegrationTile
          name="OpenAI"
          description="GPT-4o AI engine for triage classification verdicts"
          icon={<Cpu size={16} />}
          accentColor="cyan"
          badge="gpt-4o"
          fields={[
            {
              key: 'endpoint',
              label: 'API Endpoint',
              placeholder: 'https://api.openai.com/v1',
              type: 'url',
              storageKey: 'soc_openai_endpoint',
            },
            {
              key: 'apiKey',
              label: 'API Key',
              placeholder: 'sk-…',
              type: 'password',
              storageKey: 'soc_openai_key',
            },
          ]}
          onTestConnection={testOpenAI}
        />
      </div>
    </div>
  );
}
