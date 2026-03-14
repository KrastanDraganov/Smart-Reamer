import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

interface UseAnimatedPressOptions {
  scale?: number;
  duration?: number;
}

interface UseAnimatedPressReturn {
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
  pressed: SharedValue<boolean>;
  onPressIn: () => void;
  onPressOut: () => void;
}

export function useAnimatedPress({
  scale = 0.97,
  duration = 100,
}: UseAnimatedPressOptions = {}): UseAnimatedPressReturn {
  const pressed = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pressed.value ? scale : 1, { duration }) }],
  }));

  const onPressIn = useCallback(() => {
    pressed.value = true;
  }, [pressed]);

  const onPressOut = useCallback(() => {
    pressed.value = false;
  }, [pressed]);

  return { animatedStyle, pressed, onPressIn, onPressOut };
}
