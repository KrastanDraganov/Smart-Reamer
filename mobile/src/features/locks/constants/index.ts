import type { DiscoveredDevice, Lock, LockEvent } from '../types';

export const DISCOVERY_TIMEOUT_MS = 10_000;
export const LOCK_COMMAND_TIMEOUT_MS = 5_000;
export const STATUS_POLL_INTERVAL_MS = 30_000;
export const SERVICE_TYPE = '_smartlock._tcp.';

export const MOCK_LOCKS: Lock[] = [
  {
    id: 'lock-001',
    name: 'Front Door',
    ipAddress: '192.168.1.40',
    macAddress: 'AA:BB:CC:DD:EE:01',
    isLocked: true,
    isOnline: true,
    batteryLevel: 87,
    lastSeen: new Date().toISOString(),
    addedAt: '2026-01-15T10:30:00.000Z',
  },
  {
    id: 'lock-002',
    name: 'Back Door',
    ipAddress: '192.168.1.41',
    macAddress: 'AA:BB:CC:DD:EE:02',
    isLocked: false,
    isOnline: true,
    batteryLevel: 62,
    lastSeen: new Date().toISOString(),
    addedAt: '2026-02-20T14:00:00.000Z',
  },
  {
    id: 'lock-003',
    name: 'Garage',
    ipAddress: '192.168.1.42',
    macAddress: 'AA:BB:CC:DD:EE:03',
    isLocked: true,
    isOnline: false,
    batteryLevel: 23,
    lastSeen: '2026-03-10T08:15:00.000Z',
    addedAt: '2026-01-28T09:45:00.000Z',
  },
];

export const MOCK_EVENTS: LockEvent[] = [
  {
    id: 'evt-001',
    lockId: 'lock-001',
    action: 'lock',
    timestamp: '2026-03-14T09:30:00.000Z',
    source: 'app',
  },
  {
    id: 'evt-002',
    lockId: 'lock-001',
    action: 'unlock',
    timestamp: '2026-03-14T08:15:00.000Z',
    source: 'app',
  },
  {
    id: 'evt-003',
    lockId: 'lock-001',
    action: 'lock',
    timestamp: '2026-03-13T22:00:00.000Z',
    source: 'auto',
  },
  {
    id: 'evt-004',
    lockId: 'lock-002',
    action: 'unlock',
    timestamp: '2026-03-14T07:45:00.000Z',
    source: 'manual',
  },
  {
    id: 'evt-005',
    lockId: 'lock-002',
    action: 'lock',
    timestamp: '2026-03-13T23:30:00.000Z',
    source: 'app',
  },
];

export const MOCK_DISCOVERED_DEVICES: DiscoveredDevice[] = [
  {
    name: 'SmartLock-A1B2',
    ipAddress: '192.168.1.50',
    macAddress: 'AA:BB:CC:DD:EE:10',
    port: 8080,
    serviceType: SERVICE_TYPE,
  },
  {
    name: 'SmartLock-C3D4',
    ipAddress: '192.168.1.51',
    macAddress: 'AA:BB:CC:DD:EE:11',
    port: 8080,
    serviceType: SERVICE_TYPE,
  },
  {
    name: 'SmartLock-E5F6',
    ipAddress: '192.168.1.52',
    macAddress: 'AA:BB:CC:DD:EE:12',
    port: 8080,
    serviceType: SERVICE_TYPE,
  },
];
