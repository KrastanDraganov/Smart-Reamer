import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addLock } from '../services/lockService';
import type { AddLockPayload } from '../types';
import { LOCK_KEYS } from './useLocks';

export function useAddLock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddLockPayload) => addLock(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCK_KEYS.all });
    },
  });
}
