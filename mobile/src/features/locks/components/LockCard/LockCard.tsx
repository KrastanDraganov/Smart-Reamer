import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Icon } from '@/common/components/Icon';
import { Text } from '@/common/components/Text';
import { useAnimatedPress } from '@/hooks/useAnimatedPress';
import { styles } from './LockCard.styles';
import type { LockCardProps } from './LockCard.types';

function getBatteryIcon(level: number) {
  if (level > 60) return 'battery-full' as const;
  if (level > 20) return 'battery-half' as const;
  return 'battery-dead' as const;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function LockCard({ lock, onPress, onToggle, isToggling }: LockCardProps) {
  const { t } = useTranslation();
  const { animatedStyle, onPressIn, onPressOut } = useAnimatedPress({ scale: 0.98 });

  styles.useVariants({
    locked: lock.isLocked,
    online: lock.isOnline,
    offline: !lock.isOnline,
  });

  const batteryIconName = getBatteryIcon(lock.batteryLevel);

  return (
    <AnimatedPressable
      onPress={() => onPress(lock)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.card, animatedStyle]}
      accessibilityRole="button"
      accessibilityLabel={t('locks.cardAccessibility', { name: lock.name })}
    >
      <View style={styles.iconContainer}>
        <Icon
          name={lock.isLocked ? 'lock-closed' : 'lock-open'}
          variant={lock.isOnline ? 'primary' : 'muted'}
          size={24}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text variant="body" weight="semibold">{lock.name}</Text>
        </View>
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text variant="caption" color="tertiary">
            {lock.isOnline ? t('locks.online') : t('locks.offline')}
          </Text>
          <View style={styles.batteryRow}>
            <Icon name={batteryIconName} size={14} variant="tertiary" />
            <Text variant="caption" color="tertiary">{lock.batteryLevel}%</Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => onToggle(lock)}
        style={styles.toggleButton}
        disabled={!lock.isOnline || isToggling}
        accessibilityRole="button"
        accessibilityLabel={
          lock.isLocked ? t('locks.actions.unlock') : t('locks.actions.lock')
        }
      >
        {isToggling ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Icon
            name={lock.isLocked ? 'lock-open-outline' : 'lock-closed-outline'}
            color="#FFFFFF"
            size={20}
          />
        )}
      </Pressable>
    </AnimatedPressable>
  );
}
