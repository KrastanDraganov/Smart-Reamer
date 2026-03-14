import { useEffect, useState, useCallback } from 'react';
import { getItem, setItem, removeItem, addListener } from './storage';
import type { StorageKey, StorageValue } from './types';

export interface UseStorageOptions<T extends StorageValue> {
  defaultValue?: T;
  initializeWithDefault?: boolean;
}

export interface UseStorageReturn<T extends StorageValue> {
  value: T | null;
  setValue: (newValue: T | null) => void;
  removeValue: () => void;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

export function useStorage<T extends StorageValue = StorageValue>(
  key: StorageKey,
  options?: UseStorageOptions<T>
): UseStorageReturn<T> {
  const { defaultValue, initializeWithDefault = false } = options || {};

  const [value, setStateValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadValue = useCallback(() => {
    setLoading(true);
    setError(null);

    const result = getItem<T>(key);

    if (!result.success) {
      setError(result.error || new Error('Failed to get item'));
      setStateValue(defaultValue ?? null);
      setLoading(false);
      return;
    }

    if (result.data === null && defaultValue !== undefined && initializeWithDefault) {
      const setResult = setItem(key, defaultValue);
      if (setResult.success) {
        setStateValue(defaultValue);
      } else {
        setError(setResult.error || new Error('Failed to set default value'));
        setStateValue(defaultValue);
      }
    } else {
      setStateValue(result.data ?? defaultValue ?? null);
    }

    setLoading(false);
  }, [key, defaultValue, initializeWithDefault]);

  useEffect(() => {
    loadValue();
  }, [loadValue]);

  useEffect(() => {
    const unsubscribe = addListener<T>(key, (newValue) => {
      setStateValue(newValue ?? defaultValue ?? null);
    });

    return unsubscribe;
  }, [key, defaultValue]);

  const setValue = useCallback(
    (newValue: T | null) => {
      const result = setItem(key, newValue);
      if (!result.success) {
        setError(result.error || new Error('Failed to set item'));
      } else {
        setError(null);
        setStateValue(newValue ?? defaultValue ?? null);
      }
    },
    [key, defaultValue]
  );

  const removeValue = useCallback(() => {
    const result = removeItem(key);
    if (!result.success) {
      setError(result.error || new Error('Failed to remove item'));
    } else {
      setError(null);
      setStateValue(defaultValue ?? null);
    }
  }, [key, defaultValue]);

  const refresh = useCallback(() => {
    loadValue();
  }, [loadValue]);

  return { value, setValue, removeValue, loading, error, refresh };
}

export function useStorageBoolean(
  key: StorageKey,
  options?: UseStorageOptions<boolean>
): UseStorageReturn<boolean> & { toggle: () => void } {
  const storageReturn = useStorage<boolean>(key, options);

  const toggle = useCallback(() => {
    storageReturn.setValue(!storageReturn.value);
  }, [storageReturn]);

  return { ...storageReturn, toggle };
}
