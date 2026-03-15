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
  token?: string;
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

export interface WsRequest {
  id: number;
  action: string;
  token?: string;
  [key: string]: unknown;
}

export interface WsResponse {
  id?: number;
  status?: string;
  message?: string;
  event?: string;
  isLocked?: boolean;
  isOnline?: boolean;
  token?: string;
  deviceId?: string;
  firmwareVersion?: string;
  name?: string;
  timestamp?: number;
  code?: string;
}

export interface PairResult {
  token: string;
  deviceId: string;
}
