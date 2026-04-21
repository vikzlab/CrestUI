import { useState } from 'react';
import { Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface TriageFormProps {
  onSubmit: (jiraKey: string) => void;
  isLoading?: boolean;
  size?: 'default' | 'hero';
}

export function TriageForm({ onSubmit, isLoading = false, size = 'default' }: TriageFormProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = value.trim().toUpperCase();
    if (!key) {
      setError('Please enter a Jira issue key.');
      return;
    }
    if (!/^[A-Z]+-\d+$/.test(key)) {
      setError('Invalid format. Use format like SOC-1234.');
      return;
    }
    setError('');
    onSubmit(key);
  };

  const isHero = size === 'hero';

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={isHero ? 'flex flex-col sm:flex-row gap-3' : 'flex gap-2'}>
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError('');
            }}
            placeholder="SOC-1234"
            leftIcon={<Search size={16} />}
            error={error}
            disabled={isLoading}
            className={isHero ? 'py-4 text-base font-mono' : 'font-mono'}
            aria-label="Jira issue key"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <Button
          type="submit"
          loading={isLoading}
          size={isHero ? 'lg' : 'md'}
          leftIcon={!isLoading ? <Zap size={16} /> : undefined}
          className={isHero ? 'sm:w-auto w-full py-4 whitespace-nowrap' : 'whitespace-nowrap'}
        >
          {isLoading ? 'Running…' : 'Run Triage'}
        </Button>
      </div>
    </form>
  );
}
