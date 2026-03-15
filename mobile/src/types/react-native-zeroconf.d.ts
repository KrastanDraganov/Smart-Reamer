declare module 'react-native-zeroconf' {
  import { EventEmitter } from 'events';

  type ImplType = 'NSD' | 'DNSSD';

  interface ZeroconfService {
    name: string;
    fullName: string;
    host: string;
    port: number;
    addresses: string[];
    txt: Record<string, string>;
  }

  class Zeroconf extends EventEmitter {
    constructor();
    scan(type?: string, protocol?: string, domain?: string, implType?: ImplType): void;
    stop(implType?: ImplType): void;
    getServices(): Record<string, ZeroconfService>;
    removeDeviceListeners(): void;
    addDeviceListeners(): void;
    publishService(
      type: string,
      protocol: string,
      domain: string,
      name: string,
      port: number,
      txt?: Record<string, string>
    ): void;
    unpublishService(name: string): void;

    on(event: 'start', listener: () => void): this;
    on(event: 'stop', listener: () => void): this;
    on(event: 'found', listener: (name: string) => void): this;
    on(event: 'resolved', listener: (service: ZeroconfService) => void): this;
    on(event: 'remove', listener: (name: string) => void): this;
    on(event: 'update', listener: () => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'published', listener: (service: ZeroconfService) => void): this;
    on(event: 'unpublished', listener: (service: ZeroconfService) => void): this;
  }

  export default Zeroconf;
}
