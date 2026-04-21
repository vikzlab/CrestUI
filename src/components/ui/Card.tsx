import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'red' | 'amber' | 'emerald' | 'cyan' | 'violet' | null;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, glow, hover, onClick }: CardProps) {
  const glowColors = {
    red: 'shadow-red-500/10',
    amber: 'shadow-amber-500/10',
    emerald: 'shadow-emerald-500/10',
    cyan: 'shadow-cyan-500/10',
    violet: 'shadow-violet-500/10',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl',
        glow && ['shadow-2xl', glowColors[glow]],
        hover && 'hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-200 cursor-pointer',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={clsx('px-6 py-4 border-b border-slate-800', className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx('px-6 py-5', className)}>{children}</div>;
}
