import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ProgressPipeline } from '@/components/triage/ProgressPipeline';
import { useTriage } from '@/hooks/useTriage';
import { Button } from '@/components/ui/Button';

export function TriageRun() {
  const { jiraKey } = useParams<{ jiraKey: string }>();
  const navigate = useNavigate();
  const triage = useTriage();
  const hasStarted = useRef(false);

  useEffect(() => {
    if (jiraKey && !hasStarted.current) {
      hasStarted.current = true;
      triage.startTriage(jiraKey, 'manual');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jiraKey]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft size={14} />
          Cancel & go home
        </button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ProgressPipeline
          stages={triage.stages}
          elapsedMs={triage.elapsedMs}
          onCancel={() => {
            triage.cancel();
            navigate('/');
          }}
          jiraKey={jiraKey}
          error={triage.error}
        />

        {triage.error && (
          <div className="mt-4">
            <Button onClick={() => navigate('/')} variant="secondary" leftIcon={<ArrowLeft size={14} />}>
              Return to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
