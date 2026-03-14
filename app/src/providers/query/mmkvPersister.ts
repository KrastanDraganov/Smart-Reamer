import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import type { MMKV } from 'react-native-mmkv';
import { createMMKV } from 'react-native-mmkv';

const QUERY_CACHE_KEY = 'react-query-cache';

let queryStorage: MMKV | undefined;

function getQueryStorage(): MMKV {
  queryStorage ??= createMMKV({
    id: 'react-query-storage',
  });
  return queryStorage;
}

const mmkvStorageAdapter = {
  getItem: (key: string): string | null => {
    const storage = getQueryStorage();
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: (key: string, value: string): void => {
    const storage = getQueryStorage();
    storage.set(key, value);
  },
  removeItem: (key: string): void => {
    const storage = getQueryStorage();
    storage.remove(key);
  },
};

export const mmkvPersister = createAsyncStoragePersister({
  storage: mmkvStorageAdapter,
  key: QUERY_CACHE_KEY,
});
