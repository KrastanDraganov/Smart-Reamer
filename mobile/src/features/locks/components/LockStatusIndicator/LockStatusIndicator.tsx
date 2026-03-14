import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Icon } from '@/common/components/Icon';
import { Text } from '@/common/components/Text';
import { styles } from './LockStatusIndicator.styles';
import type { LockStatusIndicatorProps } from './LockStatusIndicator.types';

function getBatteryIcon(level: number) {
  if (level > 60) return 'battery-full' as const;
  if (level > 20) return 'battery-half' as const;
  return 'battery-dead' as const;
}

export function LockStatusIndicator({
  isOnline,
  batteryLevel,
  isLocked,
}: LockStatusIndicatorProps) {
  const { t } = useTranslation();

  const batteryIconName = getBatteryIcon(batteryLevel);

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Icon
          name={isOnline ? 'wifi' : 'wifi-outline'}
          variant={isOnline ? 'accent' : 'muted'}
          size={20}
        />
        <Text variant="caption" color="tertiary">
          {isOnline ? t('locks.online') : t('locks.offline')}
        </Text>
      </View>

      <View style={styles.item}>
        <Icon name={batteryIconName} variant="tertiary" size={20} />
        <Text variant="caption" color="tertiary">{batteryLevel}%</Text>
      </View>

      <View style={styles.item}>
        <Icon
          name={isLocked ? 'lock-closed' : 'lock-open'}
          variant="primary"
          size={20}
        />
        <Text variant="caption" color="tertiary">
          {isLocked ? t('locks.locked') : t('locks.unlocked')}
        </Text>
      </View>
    </View>
  );
}
