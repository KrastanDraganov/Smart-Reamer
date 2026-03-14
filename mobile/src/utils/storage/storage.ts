import type { MMKV } from 'react-native-mmkv';
import { createMMKV } from 'react-native-mmkv';
import type { STORAGE_KEYS } from './constants';
import type {
  StorageKey,
  StorageListener,
  StorageOptions,
  StorageResult,
  StorageValue,
} from './types';

type StorageExportShape<T> = {
  [K in keyof T]?: T[K] extends string
    ? StorageValue
    : T[K] extends object
      ? StorageExportShape<T[K]>
      : never;
};

export type ExportedStorageData = StorageExportShape<typeof STORAGE_KEYS>;

let storageInstance: MMKV | undefined;

const listeners = new Map<StorageKey, Set<StorageListener>>();

export function initializeStorage(options?: StorageOptions): void {
  storageInstance = createMMKV({
    id: options?.id ?? 'default',
    encryptionKey: options?.encryptionKey,
  });
}

function getStorage(): MMKV {
  if (!storageInstance) {
    initializeStorage();
  }
  // Safe: initializeStorage() is called above if null
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return storageInstance!;
}

export function setItem<T extends StorageValue>(key: StorageKey, value: T): StorageResult<T> {
  try {
    const storage = getStorage();

    if (value === null || value === undefined) {
      storage.remove(key);
      notifyListeners(key, null);
      return { success: true, data: value };
    }

    switch (typeof value) {
      case 'string':
      case 'number':
      case 'boolean':
        storage.set(key, value);
        break;
      case 'object':
        storage.set(key, JSON.stringify(value));
        break;
    }

    notifyListeners(key, value);
    return { success: true, data: value };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export function getItem<T extends StorageValue = StorageValue>(
  key: StorageKey
): StorageResult<T | null> {
  try {
    const storage = getStorage();

    if (!storage.contains(key)) {
      return { success: true, data: null };
    }

    const stringValue = storage.getString(key);
    if (stringValue !== undefined) {
      try {
        return { success: true, data: JSON.parse(stringValue) as T };
      } catch {
        return { success: true, data: stringValue as T };
      }
    }

    const numberValue = storage.getNumber(key);
    if (numberValue !== undefined) {
      return { success: true, data: numberValue as T };
    }

    const booleanValue = storage.getBoolean(key);
    if (booleanValue !== undefined) {
      return { success: true, data: booleanValue as T };
    }

    return { success: true, data: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export function removeItem(key: StorageKey): StorageResult<void> {
  try {
    const storage = getStorage();
    storage.remove(key);
    notifyListeners(key, null);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export function clear(): StorageResult<void> {
  try {
    const storage = getStorage();
    storage.clearAll();
    listeners.forEach((_, key) => notifyListeners(key, null));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export function getAllKeys(): StorageResult<StorageKey[]> {
  try {
    return {
      success: true,
      data: getStorage().getAllKeys() as StorageKey[],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export function hasItem(key: StorageKey): boolean {
  try {
    return getStorage().contains(key);
  } catch {
    return false;
  }
}

export function addListener<T extends StorageValue>(
  key: StorageKey,
  callback: StorageListener<T>
): () => void {
  if (!listeners.has(key)) {
    listeners.set(key, new Set());
  }

  // Safe: Set is created on the line above if missing
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const set = listeners.get(key)!;
  set.add(callback as StorageListener);

  return () => {
    set.delete(callback as StorageListener);
    if (set.size === 0) listeners.delete(key);
  };
}

function notifyListeners(key: StorageKey, value: StorageValue | null): void {
  listeners.get(key)?.forEach((listener) => listener(value));
}

export function getStorageSize(): number {
  try {
    const storage = getStorage();
    let totalSize = 0;
    const keys = storage.getAllKeys();

    for (const key of keys) {
      totalSize += key.length * 2;
      const stringValue = storage.getString(key);
      if (stringValue !== undefined) {
        totalSize += stringValue.length * 2;
        continue;
      }
      const numberValue = storage.getNumber(key);
      if (numberValue !== undefined) {
        totalSize += 8;
        continue;
      }
      const booleanValue = storage.getBoolean(key);
      if (booleanValue !== undefined) {
        totalSize += 1;
      }
    }

    return totalSize;
  } catch {
    return 0;
  }
}
