import { LOCK_COMMAND_TIMEOUT_MS, MOCK_EVENTS, MOCK_LOCKS } from '../constants';
import type { AddLockPayload, Lock, LockEvent } from '../types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

let mockLockState = new Map<string, boolean>(
  MOCK_LOCKS.map((l) => [l.id, l.isLocked])
);

// --- Mock implementations (used in dev/simulator) ---

async function fetchLocksMock(): Promise<Lock[]> {
  await delay(600);
  return MOCK_LOCKS.map((l) => ({
    ...l,
    isLocked: mockLockState.get(l.id) ?? l.isLocked,
  }));
}

async function fetchLockMock(id: string): Promise<Lock> {
  await delay(400);
  const lock = MOCK_LOCKS.find((l) => l.id === id);
  if (!lock) throw new Error(`Lock ${id} not found`);
  return { ...lock, isLocked: mockLockState.get(id) ?? lock.isLocked };
}

async function sendLockCommandMock(
  id: string,
  action: 'lock' | 'unlock'
): Promise<Lock> {
  await delay(LOCK_COMMAND_TIMEOUT_MS / 3);
  const lock = MOCK_LOCKS.find((l) => l.id === id);
  if (!lock) throw new Error(`Lock ${id} not found`);
  if (!lock.isOnline) throw new Error('Lock is offline');

  const newState = action === 'lock';
  mockLockState.set(id, newState);
  return { ...lock, isLocked: newState };
}

async function fetchLockEventsMock(lockId: string): Promise<LockEvent[]> {
  await delay(300);
  return MOCK_EVENTS.filter((e) => e.lockId === lockId);
}

// --- Public API ---

export async function fetchLocks(): Promise<Lock[]> {
  return fetchLocksMock();
}

export async function fetchLock(id: string): Promise<Lock> {
  return fetchLockMock(id);
}

export async function sendLockCommand(
  id: string,
  action: 'lock' | 'unlock'
): Promise<Lock> {
  return sendLockCommandMock(id, action);
}

export async function addLock(payload: AddLockPayload): Promise<Lock> {
  await delay(800);
  const newLock: Lock = {
    id: `lock-${Date.now()}`,
    name: payload.name,
    ipAddress: payload.device.ipAddress,
    macAddress: payload.device.macAddress,
    isLocked: true,
    isOnline: true,
    batteryLevel: 100,
    lastSeen: new Date().toISOString(),
    addedAt: new Date().toISOString(),
  };
  MOCK_LOCKS.push(newLock);
  mockLockState.set(newLock.id, true);
  return newLock;
}

export async function deleteLock(id: string): Promise<void> {
  await delay(400);
  const idx = MOCK_LOCKS.findIndex((l) => l.id === id);
  if (idx !== -1) MOCK_LOCKS.splice(idx, 1);
  mockLockState.delete(id);
}

export async function renameLock(id: string, name: string): Promise<Lock> {
  await delay(300);
  const lock = MOCK_LOCKS.find((l) => l.id === id);
  if (!lock) throw new Error(`Lock ${id} not found`);
  lock.name = name;
  return { ...lock };
}

export async function fetchLockEvents(lockId: string): Promise<LockEvent[]> {
  return fetchLockEventsMock(lockId);
}

export function resetMockState() {
  mockLockState = new Map(MOCK_LOCKS.map((l) => [l.id, l.isLocked]));
}
