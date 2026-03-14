import type { WsRequest, WsResponse } from '../types';

type EventHandler = (data: WsResponse) => void;

const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;
const REQUEST_TIMEOUT_MS = 10000;

interface PendingRequest {
  resolve: (value: WsResponse) => void;
  reject: (reason: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

class LockWebSocketClient {
  private ws: WebSocket | null = null;
  private url = '';
  private token = '';
  private nextId = 1;
  private pending = new Map<number, PendingRequest>();
  private eventHandlers = new Map<string, Set<EventHandler>>();
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = false;
  private _isConnected = false;
  private onConnectionChange: ((connected: boolean) => void) | null = null;

  get isConnected(): boolean {
    return this._isConnected;
  }

  setConnectionChangeHandler(handler: ((connected: boolean) => void) | null) {
    this.onConnectionChange = handler;
  }

  connect(ipAddress: string, token?: string): void {
    this.url = `wss://${ipAddress}/ws`;
    this.token = token ?? '';
    this.shouldReconnect = true;
    this.reconnectAttempt = 0;
    this.openConnection();
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.cleanupPending();
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    this.setConnected(false);
  }

  on(event: string, handler: EventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    const handlers = this.eventHandlers.get(event);
    handlers?.add(handler);
    return () => {
      this.eventHandlers.get(event)?.delete(handler);
    };
  }

  async send(action: string, params: Record<string, unknown> = {}): Promise<WsResponse> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    const id = this.nextId++;
    const request: WsRequest = {
      id,
      action,
      ...(this.token ? { token: this.token } : {}),
      ...params,
    };

    return new Promise<WsResponse>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Request ${action} timed out`));
      }, REQUEST_TIMEOUT_MS);

      this.pending.set(id, { resolve, reject, timer });
      this.ws?.send(JSON.stringify(request));
    });
  }

  async pair(deviceName: string): Promise<WsResponse> {
    return this.send('pair', { deviceName });
  }

  setToken(token: string): void {
    this.token = token;
  }

  private openConnection(): void {
    if (this.ws) {
      // Existing connection is being replaced: mark disconnected and reject pending requests.
      this.setConnected(false);
      this.cleanupPending();

      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.reconnectAttempt = 0;
      this.setConnected(true);
    };

    this.ws.onmessage = (event: WebSocketMessageEvent) => {
      try {
        const data = JSON.parse(event.data as string) as WsResponse;
        if (data.id !== undefined && data.id !== null && this.pending.has(data.id)) {
          const req = this.pending.get(data.id);
          if (req) {
            clearTimeout(req.timer);
            this.pending.delete(data.id);
            if (data.status === 'error') {
              req.reject(new Error(data.message ?? 'Unknown error'));
            } else {
              req.resolve(data);
            }
          }
        } else if (data.event) {
          const handlers = this.eventHandlers.get(data.event);
          handlers?.forEach((handler) => handler(data));
          const allHandlers = this.eventHandlers.get('*');
          allHandlers?.forEach((handler) => handler(data));
        }
      } catch {
        // Ignore non-JSON messages
      }
    };

    this.ws.onerror = () => {
      this.setConnected(false);
    };

    this.ws.onclose = () => {
      this.setConnected(false);
      this.cleanupPending();
      this.scheduleReconnect();
    };
  }

  private setConnected(connected: boolean): void {
    if (this._isConnected !== connected) {
      this._isConnected = connected;
      this.onConnectionChange?.(connected);
    }
  }

  private cleanupPending(): void {
    for (const [id, req] of this.pending) {
      clearTimeout(req.timer);
      req.reject(new Error('Connection closed'));
      this.pending.delete(id);
    }
  }

  private scheduleReconnect(): void {
    if (!this.shouldReconnect) return;

    const delay = Math.min(
      RECONNECT_BASE_MS * Math.pow(2, this.reconnectAttempt),
      RECONNECT_MAX_MS
    );
    this.reconnectAttempt++;

    this.reconnectTimer = setTimeout(() => {
      if (this.shouldReconnect) {
        this.openConnection();
      }
    }, delay);
  }
}

export const lockWsClient = new LockWebSocketClient();
