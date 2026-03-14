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
    const pairedLock = locks.find((l) => l.token && l.ipAddress);
    if (!pairedLock) return;

    const token = pairedLock.token ?? '';
    lockWsClient.setToken(token);

    lockWsClient.setConnectionChangeHandler((connected) => {
      setConnectionState(pairedLock.id, connected ? 'connected' : 'disconnected');
      if (connected) {
        lockWsClient.send('get_status').then((res) => {
          updateLock(pairedLock.id, {
            isLocked: res.isLocked ?? pairedLock.isLocked,
            isOnline: true,
            lastSeen: new Date().toISOString(),
          });
          queryClient.invalidateQueries({ queryKey: LOCK_KEYS.all });
        }).catch(() => {
          // Status fetch failed, state will update on next event
        });
      }
    });

    unsubRef.current?.();
    unsubRef.current = lockWsClient.on('status_change', (data: WsResponse) => {
      updateLock(pairedLock.id, {
        isLocked: data.isLocked ?? pairedLock.isLocked,
        isOnline: true,
        lastSeen: new Date().toISOString(),
      });
      queryClient.invalidateQueries({ queryKey: LOCK_KEYS.all });
    });

    if (!lockWsClient.isConnected) {
      setConnectionState(pairedLock.id, 'connecting');
      lockWsClient.connect(pairedLock.ipAddress, pairedLock.token);
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
