import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { lockWsClient } from '../services/websocketClient';
import { useLockStore } from '../stores/lockStore';
import type { WsResponse } from '../types';
import { LOCK_KEYS } from './useLocks';

/**
 * Manages WebSocket connections to saved locks and listens for
 * real-time status_change push events from the firmware.
 * Falls back to periodic reconnection attempts when disconnected.
 */
export function useConnectionMonitor() {
  const locks = useLockStore((s) => s.locks);
  const setConnectionState = useLockStore((s) => s.setConnectionState);
  const updateLock = useLockStore((s) => s.updateLock);
  const queryClient = useQueryClient();
  const unsubRef = useRef<(() => void) | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const connectToActiveLock = useCallback(() => {
    // Gather all locks that have a token and IP address
    const pairedLocks = locks.filter((l) => l.token && l.ipAddress);
    if (pairedLocks.length === 0) return;

    // For now, we maintain a single active WebSocket connection to the first paired lock
    const activeLock = pairedLocks[0];

    const token = activeLock.token ?? '';
    lockWsClient.setToken(token);

    // Ensure non-active paired locks are marked as disconnected so their state is not stale
    pairedLocks.slice(1).forEach((lock) => {
      setConnectionState(lock.id, 'disconnected');
      updateLock(lock.id, {
        isOnline: false,
      });
    });

    lockWsClient.setConnectionChangeHandler((connected) => {
      // Update connection state for the active lock
      setConnectionState(activeLock.id, connected ? 'connected' : 'disconnected');

      if (connected) {
        lockWsClient
          .send('get_status')
          .then((res) => {
            updateLock(activeLock.id, {
              isLocked: res.isLocked ?? activeLock.isLocked,
              isOnline: true,
              lastSeen: new Date().toISOString(),
            });
            queryClient.invalidateQueries({ queryKey: LOCK_KEYS.all });
          })
          .catch(() => {
            // Status fetch failed, state will update on next event
          });
      } else {
        // When disconnected, ensure all paired locks are marked offline
        pairedLocks.forEach((lock) => {
          setConnectionState(lock.id, 'disconnected');
          updateLock(lock.id, {
            isOnline: false,
          });
        });
      }
    });

    unsubRef.current?.();
    unsubRef.current = lockWsClient.on('status_change', (data: WsResponse) => {
      // Status updates apply to the currently active lock
      updateLock(activeLock.id, {
        isLocked: data.isLocked ?? activeLock.isLocked,
        isOnline: true,
        lastSeen: new Date().toISOString(),
      });
      queryClient.invalidateQueries({ queryKey: LOCK_KEYS.all });
    });

    if (!lockWsClient.isConnected) {
      setConnectionState(activeLock.id, 'connecting');
      lockWsClient.connect(activeLock.ipAddress, activeLock.token);
    }
  }, [locks, setConnectionState, updateLock, queryClient]);

  useEffect(() => {
    connectToActiveLock();

    reconnectRef.current = setInterval(() => {
      if (!lockWsClient.isConnected) {
        connectToActiveLock();
      }
    }, 30000);

    const appStateSub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        connectToActiveLock();
      }
    });

    return () => {
      unsubRef.current?.();
      lockWsClient.setConnectionChangeHandler(null);
      if (reconnectRef.current) clearInterval(reconnectRef.current);
      appStateSub.remove();
    };
  }, [connectToActiveLock]);
}
