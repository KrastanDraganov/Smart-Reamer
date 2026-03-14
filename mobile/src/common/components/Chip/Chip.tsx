import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Icon } from '@/common/components/Icon';
import { Text } from '@/common/components/Text';
import { useAnimatedPress } from '@/hooks/useAnimatedPress';
import { styles } from './Chip.styles';
import type { ChipProps } from './Chip.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * A compact element used for selections, filters, or tags.
 *
 * @example
 * ```tsx
 * <Chip label="Featured" variant="solid" selected onPress={() => {}} />
 * ```
 */
export function Chip({
  label,
  variant = 'outline',
  size = 'md',
  selected = false,
  onPress,
  onClose,
  icon,
  disabled = false,
}: ChipProps) {
  const { animatedStyle, onPressIn, onPressOut } = useAnimatedPress();

  styles.useVariants({ variant, size, selected, disabled });

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled || !onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      style={[styles.container, animatedStyle]}
    >
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
      <Text variant={size === 'sm' ? 'caption' : 'bodySmall'} weight="medium" style={styles.label}>
        {label}
      </Text>
      {onClose && (
        <Pressable
          onPress={onClose}
          hitSlop={4}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
        >
          <Icon name="close-circle" sizeVariant={size === 'sm' ? 'xs' : 'sm'} variant="muted" />
        </Pressable>
      )}
    </AnimatedPressable>
  );
}
