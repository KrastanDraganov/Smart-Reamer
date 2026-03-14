import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Text } from '@/common/components/Text';
import { styles } from './Snackbar.styles';
import type { SnackbarProps } from './Snackbar.types';

/**
 * Animated snackbar notification that auto-dismisses after a configurable duration.
 *
 * @example
 * ```tsx
 * <Snackbar
 *   visible={show}
 *   message="Item saved"
 *   variant="success"
 *   onDismiss={() => setShow(false)}
 * />
 * ```
 */
export function Snackbar({
  visible,
  message,
  action,
  duration = 4000,
  onDismiss,
  variant = 'neutral',
}: SnackbarProps) {
  const translateY = useSharedValue(100);
  const [mounted, setMounted] = useState(false);

  styles.useVariants({ variant });

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateY.value = withTiming(0, { duration: 250 });
      const timer = setTimeout(() => {
        translateY.value = withTiming(100, { duration: 250 }, (finished) => {
          if (finished) {
            runOnJS(setMounted)(false);
            runOnJS(onDismiss)();
          }
        });
      }, duration);
      return () => clearTimeout(timer);
    }
    translateY.value = withTiming(100, { duration: 250 }, (finished) => {
      if (finished) runOnJS(setMounted)(false);
    });
    return undefined;
  }, [visible, duration, onDismiss, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!mounted) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text variant="bodySmall" weight="medium" style={styles.messageText}>
        {message}
      </Text>
      {action && (
        <Pressable onPress={action.onPress} accessibilityRole="button">
          <Text variant="bodySmall" weight="bold" style={styles.actionText}>
            {action.label}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
