import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { styles } from './Skeleton.styles';
import type { SkeletonProps } from './Skeleton.types';

/**
 * Animated placeholder skeleton used to indicate loading content.
 *
 * @example
 * ```tsx
 * <Skeleton variant="text" width={200} height={16} />
 * ```
 */
export function Skeleton({ variant = 'rect', width, height, animated = true }: SkeletonProps) {
  const opacity = useSharedValue(1);

  styles.useVariants({ variant });

  useEffect(() => {
    if (animated) {
      opacity.value = withRepeat(withTiming(0.4, { duration: 800 }), -1, true);
    }
  }, [animated, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        width !== undefined ? { width } : undefined,
        height !== undefined ? { height } : undefined,
        animated && animatedStyle,
      ]}
    />
  );
}
