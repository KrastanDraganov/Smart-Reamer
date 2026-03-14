import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Button } from '@/common/components/Button';
import { ScreenContainer } from '@/common/components/ScreenContainer';
import { Text } from '@/common/components/Text';
import { ScanningAnimation } from '@/features/locks/components/ScanningAnimation';
import { startDiscovery } from '@/features/locks/services/discoveryService';
import { useAddLockFlowStore } from '@/features/locks/stores/addLockFlowStore';

export default function ScanScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);
  const addDevice = useAddLockFlowStore((s) => s.addDiscoveredDevice);
  const devices = useAddLockFlowStore((s) => s.discoveredDevices);
  const reset = useAddLockFlowStore((s) => s.reset);

  const runScan = useCallback(() => {
    reset();
    setIsScanning(true);
    cancelRef.current = startDiscovery(
      (device) => addDevice(device),
      () => setIsScanning(false)
    );
  }, [addDevice, reset]);

  useEffect(() => {
    runScan();
    return () => cancelRef.current?.();
  }, [runScan]);

  useEffect(() => {
    if (!isScanning && devices.length > 0) {
      router.push('/add-lock/select');
    }
  }, [isScanning, devices.length, router]);

  return (
    <ScreenContainer padded>
      <View style={styles.container}>
        <ScanningAnimation />
        <Text variant="h2" align="center" style={styles.title}>
          {isScanning ? t('discovery.scan.searching') : t('discovery.scan.done')}
        </Text>
        <ScanHintText isScanning={isScanning} deviceCount={devices.length} />
        {!isScanning && devices.length === 0 && (
          <Button
            title={t('discovery.scan.retry')}
            variant="primary"
            onPress={runScan}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

function ScanHintText({ isScanning, deviceCount }: { isScanning: boolean; deviceCount: number }) {
  const { t } = useTranslation();
  if (isScanning) {
    return <Text variant="body" align="center" color="tertiary">{t('discovery.scan.hint')}</Text>;
  }
  if (deviceCount === 0) {
    return <Text variant="body" align="center" color="tertiary">{t('discovery.scan.noDevices')}</Text>;
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
}));
