export {
  initializeStorage,
  setItem,
  getItem,
  removeItem,
  clear,
  getAllKeys,
  hasItem,
  addListener,
  getStorageSize,
} from './storage';

export { useStorage, useStorageBoolean } from './useStorage';

export type {
  StorageValue,
  StorageResult,
  StorageListener,
  StorageOptions,
  StorageKey,
} from './types';

export type { UseStorageOptions, UseStorageReturn } from './useStorage';

export { STORAGE_KEYS } from './constants';
