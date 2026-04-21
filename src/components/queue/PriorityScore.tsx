import { clsx } from 'clsx';

interface PriorityScoreProps {
  score: number;
  size?: 'sm' | 'md';
}

function getScoreColor(score: number): string {
  if (score >= 85) return 'from-red-600 to-red-500';
  if (score >= 70) return 'from-orange-600 to-orange-500';
  if (score >= 55) return 'from-amber-600 to-amber-500';
  if (score >= 40) return 'from-yellow-600 to-yellow-500';
  return 'from-blue-600 to-blue-500';
}

function getScoreTextColor(score: number): string {
  if (score >= 85) return 'text-red-400';
  if (score >= 70) return 'text-orange-400';
  if (score >= 55) return 'text-amber-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-blue-400';
}

export function PriorityScore({ score, size = 'md' }: PriorityScoreProps) {
  const isSmall = size === 'sm';

  return (
    <div className={clsx('flex flex-col gap-1', isSmall ? 'w-12' : 'w-16')}>
      <div className={clsx('font-bold font-mono text-center', isSmall ? 'text-sm' : 'text-base', getScoreTextColor(score))}>
        {score}
      </div>
      <div className={clsx('rounded-full bg-slate-800 overflow-hidden', isSmall ? 'h-1' : 'h-1.5')}>
        <div
          className={clsx('h-full rounded-full bg-gradient-to-r transition-all duration-700', getScoreColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
