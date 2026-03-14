import { useLockStore } from '../stores/lockStore';
import type { AddLockPayload, Lock, LockEvent } from '../types';
import { lockWsClient } from './websocketClient';

/* ---- Local event log (persisted in memory per session) ---- */
const eventLog: LockEvent[] = [];

function addEvent(lockId: string, action: 'lock' | 'unlock') {
  eventLog.unshift({
    id: `evt-${Date.now()}`,
    lockId,
    action,
    timestamp: new Date().toISOString(),
    source: 'app',
  });
}

async function waitForConnection(
  client: { isConnected: boolean },
  timeoutMs: number = 5000,
  pollIntervalMs: number = 50
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (client.isConnected) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }
  throw new Error('Timeout while waiting for lock client to connect');
}

/* ---- Public API ---- */

export async function fetchLocks(): Promise<Lock[]> {
  const { locks } = useLockStore.getState();

  const updated = await Promise.all(
    locks.map(async (lock) => {
      if (!lock.token || !lock.ipAddress) return lock;
      try {
        lockWsClient.setToken(lock.token);
        if (!lockWsClient.isConnected) {
          lockWsClient.connect(lock.ipAddress, lock.token);
          try {
            await waitForConnection(lockWsClient);
          } catch {
            // Connection did not establish in time; treat as unreachable
            return lock;
          }
        }
        if (lockWsClient.isConnected) {
          const res = await lockWsClient.send('get_status');
          return {
            ...lock,
            isLocked: res.isLocked ?? lock.isLocked,
            isOnline: true,
            lastSeen: new Date().toISOString(),
          };
        }
      } catch {
        // Device unreachable, return stale data
      }
      return lock;
    })
  );

  return updated;
}

export async function fetchLock(id: string): Promise<Lock> {
  const { locks } = useLockStore.getState();
  const lock = locks.find((l) => l.id === id);
  if (!lock) throw new Error(`Lock ${id} not found`);

  if (lock.token && lock.ipAddress) {
    try {
      lockWsClient.setToken(lock.token);
      if (!lockWsClient.isConnected) {
        lockWsClient.connect(lock.ipAddress, lock.token);
        await new Promise((r) => setTimeout(r, 1500));
      }
      if (lockWsClient.isConnected) {
        const res = await lockWsClient.send('get_status');
        return {
          ...lock,
          isLocked: res.isLocked ?? lock.isLocked,
          isOnline: true,
          lastSeen: new Date().toISOString(),
        };
      }
    } catch {
      // Fall through to return local data
    }
  }
  return lock;
}

export async function sendLockCommand(
  id: string,
  action: 'lock' | 'unlock'
): Promise<Lock> {
  const { locks, updateLock } = useLockStore.getState();
  const lock = locks.find((l) => l.id === id);
  if (!lock) throw new Error(`Lock ${id} not found`);

  if (lock.token && lock.ipAddress) {
    lockWsClient.setToken(lock.token);
    if (!lockWsClient.isConnected) {
      lockWsClient.connect(lock.ipAddress, lock.token);
      await new Promise((r) => setTimeout(r, 1500));
    }
    const res = await lockWsClient.send(action);
    const isLocked = res.isLocked ?? (action === 'lock');
    updateLock(id, { isLocked, lastSeen: new Date().toISOString() });
    addEvent(id, action);
    return { ...lock, isLocked };
  }

  throw new Error('Lock not paired - no token available');
}

export async function addLock(payload: AddLockPayload): Promise<Lock> {
  const { addLock: storeAdd } = useLockStore.getState();

  lockWsClient.connect(payload.device.ipAddress);
  await new Promise((r) => setTimeout(r, 1500));

  let token = '';
  let deviceId = payload.device.macAddress;

  if (lockWsClient.isConnected) {
    try {
      const res = await lockWsClient.pair(payload.name);
      token = res.token ?? '';
      deviceId = res.deviceId ?? deviceId;
    } catch {
      // Pairing failed, still add lock without token
    }
  }

  const statusRes = lockWsClient.isConnected
    ? await lockWsClient.send('get_status').catch(() => null)
    : null;

  const newLock: Lock = {
    id: `lock-${Date.now()}`,
    name: payload.name,
    ipAddress: payload.device.ipAddress,
    macAddress: deviceId,
    isLocked: statusRes?.isLocked ?? true,
    isOnline: lockWsClient.isConnected,
    batteryLevel: 100,
    lastSeen: new Date().toISOString(),
    addedAt: new Date().toISOString(),
    token,
  };

  storeAdd(newLock);
  return newLock;
}

export async function deleteLock(id: string): Promise<void> {
  const { removeLock } = useLockStore.getState();
  lockWsClient.disconnect();
  removeLock(id);
}

export async function renameLock(id: string, name: string): Promise<Lock> {
  const { locks, updateLock } = useLockStore.getState();
  const lock = locks.find((l) => l.id === id);
  if (!lock) throw new Error(`Lock ${id} not found`);
  updateLock(id, { name });
  return { ...lock, name };
}

export async function fetchLockEvents(lockId: string): Promise<LockEvent[]> {
  return eventLog.filter((e) => e.lockId === lockId);
}
