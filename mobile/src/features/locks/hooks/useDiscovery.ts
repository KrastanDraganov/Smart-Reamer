import { useCallback, useEffect, useRef, useState } from 'react';
import { startDiscovery } from '../services/discoveryService';
import type { DiscoveredDevice } from '../types';

interface DiscoveryState {
  devices: DiscoveredDevice[];
  isScanning: boolean;
  scan: () => void;
  stop: () => void;
}

export function useDiscovery(autoStart = false): DiscoveryState {
  const [devices, setDevices] = useState<DiscoveredDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);

  const stop = useCallback(() => {
    cancelRef.current?.();
    cancelRef.current = null;
    setIsScanning(false);
  }, []);

  const scan = useCallback(() => {
    stop();
    setDevices([]);
    setIsScanning(true);

    const cancel = startDiscovery(
      (device) => {
        setDevices((prev) => {
          if (prev.some((d) => d.macAddress === device.macAddress)) return prev;
          return [...prev, device];
        });
      },
      () => {
        setIsScanning(false);
      }
    );

    cancelRef.current = cancel;
  }, [stop]);

  useEffect(() => {
    if (autoStart) scan();
    return () => stop();
  }, [autoStart, scan, stop]);

  return { devices, isScanning, scan, stop };
}
