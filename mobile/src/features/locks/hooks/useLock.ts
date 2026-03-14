import { useQuery } from '@tanstack/react-query';
import { fetchLock, fetchLockEvents } from '../services/lockService';
import { LOCK_KEYS } from './useLocks';

export function useLock(id: string) {
  return useQuery({
    queryKey: LOCK_KEYS.detail(id),
    queryFn: () => fetchLock(id),
    enabled: !!id,
  });
}

export function useLockEvents(lockId: string) {
  return useQuery({
    queryKey: LOCK_KEYS.events(lockId),
    queryFn: () => fetchLockEvents(lockId),
    enabled: !!lockId,
  });
}
