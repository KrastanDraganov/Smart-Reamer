import NetInfo from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, View } from 'react-native';
import * as ExpoLinking from 'expo-linking';
import { StyleSheet } from 'react-native-unistyles';
import { Button } from '@/common/components/Button';
import { ScreenContainer } from '@/common/components/ScreenContainer';
import { Text } from '@/common/components/Text';
import { ScanningAnimation } from '@/features/locks/components/ScanningAnimation';
import { startDiscovery } from '@/features/locks/services/discoveryService';
import { useAddLockFlowStore } from '@/features/locks/stores/addLockFlowStore';
const AP_SSID_PREFIX = 'Smart-Reamer';
const AP_DEFAULT_IP = '192.168.4.1';

export default function ScanScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [apDetected, setApDetected] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);
  const addDevice = useAddLockFlowStore((s) => s.addDiscoveredDevice);
  const devices = useAddLockFlowStore((s) => s.discoveredDevices);
  const reset = useAddLockFlowStore((s) => s.reset);

  const checkApMode = useCallback(async () => {
    const state = await NetInfo.fetch();
    const details = state.details as { ssid?: string } | null;
    const ssid = details?.ssid ?? '';
    if (ssid.startsWith(AP_SSID_PREFIX)) {
      setApDetected(true);
      addDevice({
        name: ssid,
        ipAddress: AP_DEFAULT_IP,
        macAddress: `ap-${ssid}`,
        port: 443,
        serviceType: '_smartlock._tcp.',
      });
    }
  }, [addDevice]);

  const runScan = useCallback(() => {
    reset();
    setIsScanning(true);
    setApDetected(false);

    checkApMode();

    cancelRef.current = startDiscovery(
      (device) => addDevice(device),
      () => setIsScanning(false)
    );
  }, [addDevice, reset, checkApMode]);

  useEffect(() => {
    runScan();
    return () => cancelRef.current?.();
  }, [runScan]);

  useEffect(() => {
    if (!isScanning && devices.length > 0) {
      router.push('/add-lock/select');
    }
  }, [isScanning, devices.length, router]);

  const openWifiSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:WIFI');
    } else {
      ExpoLinking.sendIntent('android.settings.WIFI_SETTINGS');
    }
  };

  return (
    <ScreenContainer padded>
      <View style={styles.container}>
        <ScanningAnimation />
        <Text variant="h2" align="center" style={styles.title}>
          {isScanning ? t('discovery.scan.searching') : t('discovery.scan.done')}
        </Text>
        <ScanHintText
          isScanning={isScanning}
          deviceCount={devices.length}
          apDetected={apDetected}
        />
        {!isScanning && devices.length === 0 && (
          <View style={styles.actions}>
            <Button
              title={t('discovery.scan.retry')}
              variant="primary"
              onPress={runScan}
            />
            <Button
              title={t('discovery.scan.connectAp')}
              variant="outline"
              onPress={openWifiSettings}
            />
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

function ScanHintText({
  isScanning,
  deviceCount,
  apDetected,
}: {
  isScanning: boolean;
  deviceCount: number;
  apDetected: boolean;
}) {
  const { t } = useTranslation();
  if (apDetected) {
    return (
      <Text variant="body" align="center" color="tertiary">
        {t('discovery.scan.apDetected')}
      </Text>
    );
  }
  if (isScanning) {
    return (
      <Text variant="body" align="center" color="tertiary">
        {t('discovery.scan.hint')}
      </Text>
    );
  }
  if (deviceCount === 0) {
    return (
      <Text variant="body" align="center" color="tertiary">
        {t('discovery.scan.noDevicesAp')}
      </Text>
    );
  }
  return (
    <Text variant="body" align="center" color="tertiary">
      {t('discovery.scan.foundDevices', { count: deviceCount })}
    </Text>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.metrics.spacingV.p24,
    padding: theme.metrics.spacing.p16,
  },
  title: {
    marginTop: theme.metrics.spacingV.p16,
  },
  actions: {
    gap: theme.metrics.spacingV.p12,
    width: '100%',
  },
}));
