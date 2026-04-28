import { useState } from 'react';
import { Check, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';

export interface IntegrationField {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'password' | 'url';
  storageKey: string;
}

export interface ConnectionTestResult {
  success: boolean;
  latency?: number;
  message?: string;
}

export interface IntegrationTileProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  accentColor: 'blue' | 'emerald' | 'violet' | 'cyan' | 'orange';
  fields: IntegrationField[];
  onTestConnection: (values: Record<string, string>) => Promise<ConnectionTestResult>;
  badge?: string;
}

const accentMap: Record<string, { icon: string; border: string; text: string; bg: string; glow: string }> = {
  blue:    { icon: 'text-blue-400',    border: 'border-blue-500/20',    text: 'text-blue-400',    bg: 'bg-blue-500/10',    glow: 'shadow-blue-500/10' },
  emerald: { icon: 'text-emerald-400', border: 'border-emerald-500/20', text: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/10' },
  violet:  { icon: 'text-violet-400',  border: 'border-violet-500/20',  text: 'text-violet-400',  bg: 'bg-violet-500/10',  glow: 'shadow-violet-500/10' },
  cyan:    { icon: 'text-cyan-400',    border: 'border-cyan-500/20',    text: 'text-cyan-400',    bg: 'bg-cyan-500/10',    glow: 'shadow-cyan-500/10' },
  orange:  { icon: 'text-orange-400',  border: 'border-orange-500/20',  text: 'text-orange-400',  bg: 'bg-orange-500/10',  glow: 'shadow-orange-500/10' },
};

type ConnectionState = 'idle' | 'testing' | 'success' | 'error';

export function IntegrationTile({ name, description, icon, accentColor, fields, onTestConnection, badge }: IntegrationTileProps) {
  const accent = accentMap[accentColor];

  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((f) => {
      initial[f.key] = localStorage.getItem(f.storageKey) || '';
    });
    return initial;
  });

  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [connectionMsg, setConnectionMsg] = useState<string>('');
  const [latency, setLatency] = useState<number | undefined>();

  const save = () => {
    fields.forEach((f) => {
      localStorage.setItem(f.storageKey, values[f.key] ?? '');
    });
    toast.success(`${name} settings saved`);
  };

  const test = async () => {
    setConnectionState('testing');
    setConnectionMsg('');
    try {
      const result = await onTestConnection(values);
      setConnectionState(result.success ? 'success' : 'error');
      setConnectionMsg(result.message ?? (result.success ? 'Connection successful' : 'Connection failed'));
      setLatency(result.latency);
    } catch {
      setConnectionState('error');
      setConnectionMsg('Unexpected error during test');
    }
  };

  const toggleReveal = (key: string) => setRevealed((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <Card className={clsx('border', accent.border, 'shadow-xl', accent.glow)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={clsx('w-9 h-9 rounded-xl border flex items-center justify-center', accent.bg, accent.border, accent.icon)}>
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-200">{name}</span>
                {badge && (
                  <span className={clsx('text-[10px] font-mono px-1.5 py-0.5 rounded border', accent.bg, accent.border, accent.text)}>
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            </div>
          </div>

          {/* Connection status indicator */}
          {connectionState !== 'idle' && (
            <div className="flex items-center gap-1.5">
              {connectionState === 'testing' && <Loader2 size={12} className="animate-spin text-amber-400" />}
              {connectionState === 'success' && <Check size={12} className="text-emerald-400" />}
              {connectionState === 'error' && <AlertCircle size={12} className="text-red-400" />}
              <span className={clsx('text-xs font-medium', {
                'text-amber-400': connectionState === 'testing',
                'text-emerald-400': connectionState === 'success',
                'text-red-400': connectionState === 'error',
              })}>
                {connectionState === 'testing' ? 'Testing…' : connectionMsg}
                {connectionState === 'success' && latency ? ` · ${latency}ms` : ''}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        {fields.map((field) => {
          const isPassword = field.type === 'password';
          const isRevealed = revealed[field.key];

          return (
            <div key={field.key}>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">{field.label}</label>
              <div className="relative">
                <input
                  type={isPassword && !isRevealed ? 'password' : 'text'}
                  value={values[field.key] ?? ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-600 font-mono focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600/50 transition-colors pr-8"
                />
                {isPassword && (
                  <button
                    type="button"
                    onClick={() => toggleReveal(field.key)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <div className="flex gap-2 pt-1">
          <Button size="sm" onClick={save} leftIcon={<Check size={12} />}>
            Save
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={test}
            loading={connectionState === 'testing'}
          >
            Test Connection
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
