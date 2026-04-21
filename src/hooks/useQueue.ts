import { useQuery } from '@tanstack/react-query';
import { fetchQueue } from '@/api/queue';
import { QUEUE_REFRESH_INTERVAL } from '@/utils/constants';

export function useQueue() {
  return useQuery({
    queryKey: ['queue'],
    queryFn: fetchQueue,
    refetchInterval: QUEUE_REFRESH_INTERVAL,
    staleTime: 10000,
  });
}
