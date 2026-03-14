import { create } from 'zustand';
import { getItem, setItem, STORAGE_KEYS } from '@/utils/storage';
import type { ConnectionState, Lock } from '../types';

interface LockState {
  locks: Lock[];
  connectionStates: Record<string, ConnectionState>;

  setLocks: (locks: Lock[]) => void;
  addLock: (lock: Lock) => void;
  removeLock: (id: string) => void;
  updateLock: (id: string, patch: Partial<Lock>) => void;
  toggleLock: (id: string) => void;
  setConnectionState: (id: string, state: ConnectionState) => void;
  hydrate: () => void;
}

function persistLocks(locks: Lock[]) {
  setItem(STORAGE_KEYS.locks.savedLocks, JSON.stringify(locks));
}

export const useLockStore = create<LockState>((set, get) => ({
  locks: [],
  connectionStates: {},

  setLocks: (locks) => {
    set({ locks });
    persistLocks(locks);
  },

  addLock: (lock) => {
    const updated = [...get().locks, lock];
    set({ locks: updated });
    persistLocks(updated);
  },

  removeLock: (id) => {
    const updated = get().locks.filter((l) => l.id !== id);
    set({ locks: updated });
    persistLocks(updated);
  },

  updateLock: (id, patch) => {
    const updated = get().locks.map((l) => (l.id === id ? { ...l, ...patch } : l));
    set({ locks: updated });
    persistLocks(updated);
  },

  toggleLock: (id) => {
    const updated = get().locks.map((l) =>
      l.id === id ? { ...l, isLocked: !l.isLocked } : l
    );
    set({ locks: updated });
    persistLocks(updated);
  },

  setConnectionState: (id, state) => {
    set({ connectionStates: { ...get().connectionStates, [id]: state } });
  },

  hydrate: () => {
    const result = getItem<string>(STORAGE_KEYS.locks.savedLocks);
    if (result.success && result.data) {
      const parsed: unknown = JSON.parse(result.data);
      if (Array.isArray(parsed)) {
        set({ locks: parsed as Lock[] });
      }
    }
  },
}));
