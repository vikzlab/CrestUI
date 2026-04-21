import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { TriageResult, StageStatus, PipelineStage } from '@/types';
import { runTriage } from '@/api/triage';
import { useHistoryStore } from '@/store/historyStore';
import { ApiError } from '@/api/client';
import { LAST_TRIAGE_STORAGE_KEY } from '@/utils/constants';

const INITIAL_STAGES: PipelineStage[] = [
  { id: 'retrieval', label: 'Alert Retrieval', description: 'Fetching alert from Jira', status: 'pending', icon: 'Search' },
  { id: 'enrichment', label: 'Enrichment', description: 'Querying VirusTotal', status: 'pending', icon: 'Database' },
  { id: 'analysis', label: 'Claude Analysis', description: 'AI classification', status: 'pending', icon: 'Brain' },
  { id: 'summary', label: 'Summary Posted', description: 'Writing back to Jira', status: 'pending', icon: 'FileText' },
];

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export function useTriage() {
  const navigate = useNavigate();
  const addEntry = useHistoryStore((s) => s.addEntry);

  const [isRunning, setIsRunning] = useState(false);
  const [stages, setStages] = useState<PipelineStage[]>(INITIAL_STAGES);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const abortRef = useRef<boolean>(false);

  const updateStage = useCallback((index: number, status: StageStatus) => {
    setStages((prev) =>
      prev.map((s, i) => (i === index ? { ...s, status } : s)),
    );
  }, []);

  const startTimer = () => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 100);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const reset = useCallback(() => {
    setStages(INITIAL_STAGES);
    setElapsedMs(0);
    setResult(null);
    setError(null);
    setIsRunning(false);
    stopTimer();
  }, []);

  const cancel = useCallback(() => {
    abortRef.current = true;
    stopTimer();
    setIsRunning(false);
    setError('Triage cancelled.');
    toast.info('Triage cancelled');
  }, []);

  const startTriage = useCallback(
    async (jiraKey: string, triggerType: 'auto' | 'manual' = 'manual') => {
      reset();
      abortRef.current = false;
      setIsRunning(true);
      startTimer();

      // Stage 1: Alert Retrieval
      updateStage(0, 'in-progress');
      await sleep(600);
      if (abortRef.current) return;
      updateStage(0, 'complete');

      // Stage 2: Enrichment
      updateStage(1, 'in-progress');
      await sleep(400);
      if (abortRef.current) return;

      try {
        const triageResult = await runTriage({ jira_key: jiraKey });

        if (abortRef.current) return;
        updateStage(1, 'complete');

        // Stage 3: Analysis
        updateStage(2, 'in-progress');
        await sleep(300);
        if (abortRef.current) return;
        updateStage(2, 'complete');

        // Stage 4: Summary
        updateStage(3, 'in-progress');
        await sleep(300);
        if (abortRef.current) return;
        updateStage(3, 'complete');

        stopTimer();
        setResult(triageResult);
        setIsRunning(false);

        addEntry(triageResult, triggerType);
        localStorage.setItem(LAST_TRIAGE_STORAGE_KEY, triageResult.triage_id);

        toast.success(`Triage complete — ${triageResult.verdict.classification.toUpperCase()}`);
        navigate(`/results/${triageResult.triage_id}`);
      } catch (err) {
        if (abortRef.current) return;

        stopTimer();
        setIsRunning(false);

        const stageStatuses: StageStatus[] = ['in-progress', 'in-progress', 'pending', 'pending'];
        setStages((prev) =>
          prev.map((s, i) => ({
            ...s,
            status: i < 2 ? (i === 1 ? 'error' : 'complete') : stageStatuses[i],
          })),
        );

        const message =
          err instanceof ApiError
            ? err.message
            : 'An unexpected error occurred. Please try again.';

        setError(message);
        toast.error(message);
      }
    },
    [reset, updateStage, navigate, addEntry],
  );

  return {
    isRunning,
    stages,
    elapsedMs,
    result,
    error,
    startTriage,
    cancel,
    reset,
  };
}
