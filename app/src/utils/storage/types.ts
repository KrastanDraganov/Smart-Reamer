import type { STORAGE_KEYS } from './constants';

export type StorageValue = string | number | boolean | object | null;

export interface StorageResult<T = StorageValue> {
  success: boolean;
  data?: T;
  error?: Error;
}

export type StorageListener<T = StorageValue> = (value: T | null) => void;

export interface StorageOptions {
  id?: string;
  encryptionKey?: string;
}

type ExtractStorageKeys<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends string
        ? T[K]
        : T[K] extends object
          ? ExtractStorageKeys<T[K]>
          : never;
    }[keyof T]
  : never;

export type StorageKey = ExtractStorageKeys<typeof STORAGE_KEYS>;
