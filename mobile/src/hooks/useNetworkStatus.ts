import NetInfo from '@react-native-community/netinfo';
import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';

export function useNetworkStatus() {
  const wasOffline = useRef(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOffline = !(state.isConnected && state.isInternetReachable !== false);

      if (isOffline && !wasOffline.current) {
        wasOffline.current = true;
        Alert.alert('No Connection', 'You appear to be offline. Some features may not work.');
      } else if (!isOffline && wasOffline.current) {
        wasOffline.current = false;
        Alert.alert('Back Online', 'Your connection has been restored.');
      }
    });

    return () => unsubscribe();
  }, []);
}
