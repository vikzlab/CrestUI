import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { VerdictClassification } from '@/types';
import { clsx } from 'clsx';

interface VerdictBadgeProps {
  verdict: VerdictClassification;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export function VerdictBadge({ verdict, size = 'md' }: VerdictBadgeProps) {
  const config = {
    malicious: {
      icon: ShieldAlert,
      label: 'MALICIOUS',
      colors: 'bg-red-500/15 border-red-500/40 text-red-400',
      iconColor: 'text-red-400',
      glow: 'shadow-red-500/20',
    },
    suspicious: {
      icon: Shield,
      label: 'SUSPICIOUS',
      colors: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
      iconColor: 'text-amber-400',
      glow: 'shadow-amber-500/20',
    },
    benign: {
      icon: ShieldCheck,
      label: 'BENIGN',
      colors: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
      iconColor: 'text-emerald-400',
      glow: 'shadow-emerald-500/20',
    },
  }[verdict];

  const sizes = {
    sm: { wrap: 'px-2.5 py-1 rounded-lg gap-1.5', icon: 12, text: 'text-xs font-semibold tracking-wide' },
    md: { wrap: 'px-3.5 py-2 rounded-xl gap-2', icon: 16, text: 'text-sm font-bold tracking-wide' },
    lg: { wrap: 'px-5 py-3 rounded-xl gap-2.5', icon: 20, text: 'text-base font-bold tracking-wider' },
    hero: { wrap: 'px-8 py-5 rounded-2xl gap-3', icon: 32, text: 'text-2xl font-extrabold tracking-widest' },
  }[size];

  const Icon = config.icon;

  return (
    <div
      className={clsx(
        'inline-flex items-center border shadow-xl',
        config.colors,
        config.glow,
        sizes.wrap,
      )}
    >
      <Icon size={sizes.icon} className={config.iconColor} />
      <span className={clsx(sizes.text, config.colors.split(' ').filter((c) => c.startsWith('text-')))}>{config.label}</span>
    </div>
  );
}
