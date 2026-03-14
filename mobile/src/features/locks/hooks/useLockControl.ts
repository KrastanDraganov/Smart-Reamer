import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteLock,
  renameLock,
  sendLockCommand,
} from '../services/lockService';
import { LOCK_KEYS } from './useLocks';

export function useLockToggle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'lock' | 'unlock' }) =>
      sendLockCommand(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCK_KEYS.all });
    },
  });
}

export function useDeleteLock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCK_KEYS.all });
    },
  });
}

export function useRenameLock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      renameLock(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCK_KEYS.all });
    },
  });
}
