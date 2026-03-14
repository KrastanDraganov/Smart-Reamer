import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { styles } from './ProgressBar.styles';
import type { ProgressBarProps } from './ProgressBar.types';

/**
 * A horizontal progress bar supporting determinate and indeterminate modes with animated transitions.
 *
 * @example
 * ```tsx
 * <ProgressBar value={65} colorScheme="success" size="lg" />
 * ```
 */
export function ProgressBar({
  value = 0,
  size = 'md',
  colorScheme = 'primary',
  indeterminate = false,
  accessibilityLabel,
}: ProgressBarProps) {
  const translateX = useSharedValue(-1);

  styles.useVariants({ size, colorScheme });

  useEffect(() => {
    if (indeterminate) {
      translateX.value = withRepeat(
        withSequence(withTiming(0, { duration: 600 }), withTiming(1, { duration: 600 })),
        -1,
        false
      );
    }
  }, [indeterminate, translateX]);

  const indeterminateStyle = useAnimatedStyle(() => ({
    width: '30%',
    left: `${translateX.value * 70}%`,
  }));

  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? 'Progress'}
      accessibilityValue={{ min: 0, max: 100, now: indeterminate ? undefined : clampedValue }}
    >
      {indeterminate ? (
        <Animated.View style={[styles.fill, indeterminateStyle]} />
      ) : (
        <View style={[styles.fill, { width: `${clampedValue}%` }]} />
      )}
    </View>
  );
}
