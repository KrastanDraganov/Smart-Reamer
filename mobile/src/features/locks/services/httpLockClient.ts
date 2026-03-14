import axios from 'axios';
import { LOCK_COMMAND_TIMEOUT_MS } from '../constants';
import type { Lock, LockEvent } from '../types';

/**
 * HTTP client for communicating with a smart lock on the local network.
 * Each lock exposes a REST API on its local IP address.
 *
 * Expected lock firmware API:
 *   GET  /status        -> { isLocked, batteryLevel, isOnline }
 *   POST /lock          -> { isLocked: true }
 *   POST /unlock        -> { isLocked: false }
 *   GET  /events        -> LockEvent[]
 *   GET  /info          -> { name, macAddress, firmwareVersion }
 */

function lockClient(ipAddress: string, port = 8080) {
  return axios.create({
    baseURL: `http://${ipAddress}:${port}`,
    timeout: LOCK_COMMAND_TIMEOUT_MS,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function fetchLockStatus(
  ipAddress: string,
  port?: number
): Promise<Pick<Lock, 'isLocked' | 'batteryLevel' | 'isOnline'>> {
  const client = lockClient(ipAddress, port);
  const { data } = await client.get<{
    isLocked: boolean;
    batteryLevel: number;
    isOnline: boolean;
  }>('/status');
  return data;
}

export async function sendLockCommandHttp(
  ipAddress: string,
  action: 'lock' | 'unlock',
  port?: number
): Promise<{ isLocked: boolean }> {
  const client = lockClient(ipAddress, port);
  const { data } = await client.post<{ isLocked: boolean }>(`/${action}`);
  return data;
}

export async function fetchLockEventsHttp(
  ipAddress: string,
  port?: number
): Promise<LockEvent[]> {
  const client = lockClient(ipAddress, port);
  const { data } = await client.get<LockEvent[]>('/events');
  return data;
}

export async function pingLock(ipAddress: string, port?: number): Promise<boolean> {
  try {
    const client = lockClient(ipAddress, port);
    await client.get('/status');
    return true;
  } catch {
    return false;
  }
}
