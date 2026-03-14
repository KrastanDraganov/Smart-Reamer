import { env } from '@/config/env';
import { DISCOVERY_TIMEOUT_MS, MOCK_DISCOVERED_DEVICES } from '../constants';
import type { DiscoveredDevice } from '../types';
import { startZeroconfDiscovery } from './zeroconfDiscoveryService';

type OnDeviceFound = (device: DiscoveredDevice) => void;
type OnComplete = () => void;

/**
 * Mock implementation of mDNS device discovery.
 * Used when the native Zeroconf module isn't available (dev/simulator).
 */
function startMockDiscovery(
  onDeviceFound: OnDeviceFound,
  onComplete: OnComplete
): () => void {
  let cancelled = false;
  const timeouts: ReturnType<typeof setTimeout>[] = [];

  MOCK_DISCOVERED_DEVICES.forEach((device, i) => {
    const timeout = setTimeout(() => {
      if (!cancelled) onDeviceFound(device);
    }, 1200 * (i + 1));
    timeouts.push(timeout);
  });

  const doneTimeout = setTimeout(() => {
    if (!cancelled) onComplete();
  }, DISCOVERY_TIMEOUT_MS);
  timeouts.push(doneTimeout);

  return () => {
    cancelled = true;
    timeouts.forEach(clearTimeout);
  };
}

/**
 * Unified discovery entry point.
 * Uses Zeroconf on real devices, falls back to mock on dev/simulator.
 */
export function startDiscovery(
  onDeviceFound: OnDeviceFound,
  onComplete: OnComplete
): () => void {
  if (!env.isDev) {
    try {
      return startZeroconfDiscovery(onDeviceFound, onComplete);
    } catch {
      // Native module not available, fall through to mock
    }
  }

  return startMockDiscovery(onDeviceFound, onComplete);
}
