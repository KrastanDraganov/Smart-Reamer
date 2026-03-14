import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Icon } from '@/common/components/Icon';
import { ScreenContainer } from '@/common/components/ScreenContainer';
import { Text } from '@/common/components/Text';
import { useAddLockFlowStore } from '@/features/locks/stores/addLockFlowStore';
import type { DiscoveredDevice } from '@/features/locks/types';

export default function SelectScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const devices = useAddLockFlowStore((s) => s.discoveredDevices);
  const selectDevice = useAddLockFlowStore((s) => s.selectDevice);

  const handleSelect = (device: DiscoveredDevice) => {
    selectDevice(device);
    router.push('/add-lock/name');
  };

  return (
    <ScreenContainer scrollable padded>
      <Text variant="body" color="tertiary" style={styles.subtitle}>
        {t('discovery.select.subtitle')}
      </Text>
      {devices.map((device) => (
        <Pressable
          key={device.macAddress}
          style={styles.deviceCard}
          onPress={() => handleSelect(device)}
          accessibilityRole="button"
          accessibilityLabel={device.name}
        >
          <View style={styles.deviceIcon}>
            <Icon name="hardware-chip-outline" variant="primary" size={24} />
          </View>
          <View style={styles.deviceInfo}>
            <Text variant="body" weight="semibold">{device.name}</Text>
            <Text variant="caption" color="muted">{device.ipAddress}</Text>
          </View>
          <Icon name="chevron-forward" variant="muted" size={20} />
        </Pressable>
      ))}
      {devices.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text variant="body" color="muted" align="center">
            {t('discovery.select.noDevices')}
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create((theme) => ({
  subtitle: {
    marginBottom: theme.metrics.spacingV.p16,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.metrics.spacing.p16,
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.metrics.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    marginBottom: theme.metrics.spacingV.p12,
    gap: theme.metrics.spacing.p12,
  },
  deviceIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.metrics.borderRadius.xl,
    backgroundColor: theme.colors.background.section,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceInfo: {
    flex: 1,
  },
  emptyContainer: {
    paddingVertical: theme.metrics.spacingV.p32,
  },
}));
