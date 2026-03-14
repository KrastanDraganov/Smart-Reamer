export interface Lock {
  id: string;
  name: string;
  ipAddress: string;
  macAddress: string;
  isLocked: boolean;
  isOnline: boolean;
  batteryLevel: number;
  lastSeen: string;
  addedAt: string;
}

export interface LockEvent {
  id: string;
  lockId: string;
  action: 'lock' | 'unlock';
  timestamp: string;
  source: 'app' | 'manual' | 'auto';
}

export interface DiscoveredDevice {
  name: string;
  ipAddress: string;
  macAddress: string;
  port: number;
  serviceType: string;
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface AddLockPayload {
  name: string;
  device: DiscoveredDevice;
}
