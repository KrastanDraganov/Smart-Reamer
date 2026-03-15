import { Platform } from 'react-native';
import Zeroconf from 'react-native-zeroconf';
import { DISCOVERY_TIMEOUT_MS, SERVICE_TYPE } from '../constants';
import type { DiscoveredDevice } from '../types';

type OnDeviceFound = (device: DiscoveredDevice) => void;
type OnComplete = () => void;
type OnError = (error: Error) => void;

interface ZeroconfService {
  name: string;
  host: string;
  port: number;
  addresses: string[];
  txt: Record<string, string>;
}

const zeroconf = new Zeroconf();

/**
 * Android's NsdManager is unreliable for mDNS discovery, so we use the
 * embedded Apple mDNSResponder (DNSSD) backend that react-native-zeroconf
 * ships. iOS uses its native Bonjour stack and ignores this parameter.
 */
const IMPL_TYPE = Platform.OS === 'android' ? 'DNSSD' : undefined;

/**
 * Real mDNS/Bonjour discovery using react-native-zeroconf.
 * Scans for `_smartlock._tcp.` services on the local network.
 */
export function startZeroconfDiscovery(
  onDeviceFound: OnDeviceFound,
  onComplete: OnComplete,
  onError?: OnError
): () => void {
  const seenMacs = new Set<string>();

  const resolvedHandler = (service: ZeroconfService) => {
    const address = service.addresses?.[0];
    if (!address) return;

    const macFromTxt = service.txt?.mac ?? service.txt?.macAddress ?? '';
    const mac = macFromTxt || `generated-${service.name}`;

    if (seenMacs.has(mac)) return;
    seenMacs.add(mac);

    const device: DiscoveredDevice = {
      name: service.name,
      ipAddress: address,
      macAddress: mac,
      port: service.port,
      serviceType: SERVICE_TYPE,
    };

    onDeviceFound(device);
  };

  const errorHandler = (err: Error) => {
    onError?.(err);
  };

  zeroconf.on('resolved', resolvedHandler);
  zeroconf.on('error', errorHandler);

  const [type, protocol] = SERVICE_TYPE.replace(/^_/, '')
    .replace(/\.$/, '')
    .split('._');

  zeroconf.scan(type, protocol, 'local.', IMPL_TYPE);

  const timeoutId = setTimeout(() => {
    zeroconf.stop(IMPL_TYPE);
    onComplete();
  }, DISCOVERY_TIMEOUT_MS);

  return () => {
    clearTimeout(timeoutId);
    zeroconf.stop(IMPL_TYPE);
    zeroconf.removeListener('resolved', resolvedHandler);
    zeroconf.removeListener('error', errorHandler);
  };
}
