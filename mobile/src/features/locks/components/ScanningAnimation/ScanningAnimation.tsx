import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Icon } from '@/common/components/Icon';
import { styles, SCANNING_DIMENSIONS } from './ScanningAnimation.styles';

function PulsingRing({ size, delayMs }: { size: number; delayMs: number }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withDelay(
      delayMs,
      withRepeat(
        withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      )
    );
    scale.value = withDelay(
      delayMs,
      withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      )
    );

    const resetTimeout = setTimeout(() => {
      opacity.value = withDelay(
        delayMs,
        withRepeat(
          withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
          -1,
          false
        )
      );
    }, 0);

    opacity.value = withDelay(
      delayMs,
      withRepeat(
        withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      )
    );

    return () => clearTimeout(resetTimeout);
  }, [delayMs, opacity, scale]);

  useEffect(() => {
    opacity.value = 0.6;
    scale.value = 0.6;
    opacity.value = withDelay(
      delayMs,
      withRepeat(
        withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      )
    );
    scale.value = withDelay(
      delayMs,
      withRepeat(
        withTiming(1.1, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      )
    );
  }, [delayMs, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: size,
    height: size,
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[styles.ring, animatedStyle]} />;
}

export function ScanningAnimation() {
  return (
    <View style={styles.container}>
      <PulsingRing size={SCANNING_DIMENSIONS.ring3} delayMs={0} />
      <PulsingRing size={SCANNING_DIMENSIONS.ring2} delayMs={400} />
      <PulsingRing size={SCANNING_DIMENSIONS.ring1} delayMs={800} />
      <View style={styles.centerIcon}>
        <Icon name="wifi" color="#FFFFFF" size={28} />
      </View>
    </View>
  );
}
