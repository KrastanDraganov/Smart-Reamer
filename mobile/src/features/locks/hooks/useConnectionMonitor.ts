import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { STATUS_POLL_INTERVAL_MS } from '../constants';
import { pingLock } from '../services/httpLockClient';
import { useLockStore } from '../stores/lockStore';

/**
 * Periodically checks connectivity to all saved locks by pinging their IP.
 * Updates the connection state in the lock store.
 * Pauses when the app is in the background.
 */
export function useConnectionMonitor() {
  const locks = useLockStore((s) => s.locks);
  const setConnectionState = useLockStore((s) => s.setConnectionState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkAll = useCallback(async () => {
    const checks = locks.map(async (lock) => {
      setConnectionState(lock.id, 'connecting');
      const reachable = await pingLock(lock.ipAddress);
      setConnectionState(lock.id, reachable ? 'connected' : 'disconnected');
    });
    await Promise.allSettled(checks);
  }, [locks, setConnectionState]);

  useEffect(() => {
    checkAll();

    intervalRef.current = setInterval(checkAll, STATUS_POLL_INTERVAL_MS);

    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        checkAll();
      }
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      appStateSubscription.remove();
    };
  }, [checkAll]);
}
