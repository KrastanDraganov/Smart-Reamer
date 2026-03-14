/* eslint-disable @typescript-eslint/no-require-imports */
import { jest } from '@jest/globals';

// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => ({
  createMMKV: () => ({
    set: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    getBoolean: jest.fn(),
    contains: jest.fn(() => false),
    remove: jest.fn(),
    clearAll: jest.fn(),
    getAllKeys: jest.fn(() => []),
  }),
  MMKV: jest.fn(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSegments: () => [],
  useLocalSearchParams: () => ({}),
  Link: ({ children }: { children: React.ReactNode }) => children,
  Stack: { Screen: () => null },
  Tabs: { Screen: () => null },
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: { extra: {} },
}));

// Silence noisy warnings in test output
const originalWarn = console.warn;
jest.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
  const message = typeof args[0] === 'string' ? args[0] : '';
  if (message.includes('Animated') || message.includes('NativeModule')) return;
  originalWarn(...args);
});
