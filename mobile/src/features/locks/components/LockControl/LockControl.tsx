import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';
import { Icon } from '@/common/components/Icon';
import { Text } from '@/common/components/Text';
import { styles, DIMENSIONS } from './LockControl.styles';
import type { LockControlProps } from './LockControl.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function LockControl({ isLocked, isOnline, isToggling, onToggle }: LockControlProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const progress = useSharedValue(isLocked ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(isLocked ? 1 : 0, { duration: 400 });
  }, [isLocked, progress]);

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.state.success, theme.colors.brand.primary]
    ),
  }));

  const innerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.state.success, theme.colors.brand.primary]
    ),
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  let statusText = isLocked ? t('locks.locked') : t('locks.unlocked');
  if (!isOnline) statusText = t('locks.offline');
  else if (isToggling) statusText = t('locks.toggling');

  return (
    <>
      <AnimatedPressable
        onPress={onToggle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!isOnline || isToggling}
        style={styles.wrapper}
        accessibilityRole="button"
        accessibilityLabel={
          isLocked ? t('locks.actions.unlock') : t('locks.actions.lock')
        }
        accessibilityState={{ disabled: !isOnline || isToggling }}
      >
        <Animated.View style={[styles.ring, ringAnimatedStyle]} />
        <Animated.View style={styles.outerCircle}>
          <Animated.View style={[styles.innerCircle, innerAnimatedStyle]}>
            {isToggling ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <Icon
                name={isLocked ? 'lock-closed' : 'lock-open'}
                color="#FFFFFF"
                size={DIMENSIONS.innerSize * 0.4}
              />
            )}
          </Animated.View>
        </Animated.View>
      </AnimatedPressable>
      <Text variant="body" weight="semibold" style={styles.statusLabel}>
        {statusText}
      </Text>
    </>
  );
}
