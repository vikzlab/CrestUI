import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useHealthCheck } from '@/hooks/useHealthCheck';
import { clsx } from 'clsx';

export function ConnectionStatus() {
  const { connection } = useHealthCheck(30000);

  const configs = {
    connected: {
      icon: <Wifi size={12} />,
      label: 'Connected',
      dot: 'bg-emerald-400',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    disconnected: {
      icon: <WifiOff size={12} />,
      label: 'Offline',
      dot: 'bg-red-400',
      text: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20',
    },
    checking: {
      icon: <Loader2 size={12} className="animate-spin" />,
      label: 'Checking',
      dot: 'bg-amber-400',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
  };

  const config = configs[connection.status];

  return (
    <div
      title={
        connection.status === 'connected' && connection.latency_ms
          ? `Latency: ${connection.latency_ms}ms`
          : connection.status === 'checking'
          ? 'Checking server connection…'
          : 'Backend server is unreachable'
      }
      className={clsx(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-colors',
        config.bg,
        config.text,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {connection.status === 'connected' && (
          <span className={clsx('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', config.dot)} />
        )}
        <span className={clsx('relative inline-flex rounded-full h-1.5 w-1.5', config.dot)} />
      </span>
      {config.icon}
      <span>{config.label}</span>
      {connection.status === 'connected' && connection.latency_ms && (
        <span className="opacity-60">{connection.latency_ms}ms</span>
      )}
    </div>
  );
}
