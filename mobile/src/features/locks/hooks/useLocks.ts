import { useQuery } from '@tanstack/react-query';
import { fetchLocks } from '../services/lockService';

export const LOCK_KEYS = {
  all: ['locks'] as const,
  list: () => [...LOCK_KEYS.all, 'list'] as const,
  detail: (id: string) => [...LOCK_KEYS.all, 'detail', id] as const,
  events: (id: string) => [...LOCK_KEYS.all, 'events', id] as const,
};

export function useLocks() {
  return useQuery({
    queryKey: LOCK_KEYS.list(),
    queryFn: fetchLocks,
  });
}
