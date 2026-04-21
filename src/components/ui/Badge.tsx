import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'malicious' | 'suspicious' | 'benign' | 'auto' | 'manual' | 'cyan' | 'slate' | 'violet';
  size?: 'sm' | 'md';
  className?: string;
  pulse?: boolean;
}

const variantMap: Record<string, string> = {
  malicious: 'bg-red-500/15 text-red-400 border border-red-500/30',
  suspicious: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  benign: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  auto: 'bg-violet-500/15 text-violet-400 border border-violet-500/30',
  manual: 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
  cyan: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
  slate: 'bg-slate-800 text-slate-400 border border-slate-700',
  violet: 'bg-violet-500/15 text-violet-400 border border-violet-500/30',
};

export function Badge({ children, variant = 'cyan', size = 'md', className, pulse }: BadgeProps) {
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wider',
        variantMap[variant] ?? variantMap.cyan,
        sizes[size],
        className,
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
