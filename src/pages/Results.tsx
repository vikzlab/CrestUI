import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useHistoryStore } from '@/store/historyStore';
import { ResultsView } from '@/components/results/ResultsView';
import { Button } from '@/components/ui/Button';

export function Results() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getEntry = useHistoryStore((s) => s.getEntry);

  if (!id) {
    navigate('/');
    return null;
  }

  const entry = getEntry(id);

  if (!entry) {
    return (
      <div className="animate-fade-in">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
            <AlertCircle size={28} className="text-slate-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-300 mb-2">Result Not Found</h2>
          <p className="text-slate-500 text-sm max-w-sm mb-6">
            Triage result with ID <code className="font-mono text-cyan-400">{id}</code> could not be found.
            It may have been cleared from history.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate(-1)} leftIcon={<ArrowLeft size={14} />}>
              Go Back
            </Button>
            <Button onClick={() => navigate('/')}>New Triage</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      </div>
      <ResultsView result={entry.triage_result} />
    </div>
  );
}
