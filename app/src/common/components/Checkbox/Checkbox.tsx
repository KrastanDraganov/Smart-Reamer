import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Icon } from '@/common/components/Icon';
import { Text } from '@/common/components/Text';
import { styles } from './Checkbox.styles';
import type { CheckboxProps } from './Checkbox.types';

const ICON_SIZES: Record<string, number> = {
  sm: 12,
  md: 16,
  lg: 20,
};

/**
 * Animated checkbox with checked, unchecked, and indeterminate states.
 *
 * @example
 * ```tsx
 * <Checkbox checked={isChecked} onChange={setIsChecked} label="Accept terms" />
 * <Checkbox checked indeterminate size="lg" onChange={handleChange} />
 * ```
 */
export function Checkbox({
  checked,
  onChange,
  disabled = false,
  indeterminate = false,
  size = 'md',
  label,
}: CheckboxProps) {
  styles.useVariants({
    size,
    checked: checked && !indeterminate,
    indeterminate,
    disabled,
  });

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(checked || indeterminate ? 1 : 0, { damping: 15 }) }],
    opacity: withSpring(checked || indeterminate ? 1 : 0),
  }));

  return (
    <Pressable
      onPress={() => onChange(!checked)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: indeterminate ? 'mixed' : checked, disabled }}
      style={styles.container}
    >
      <View style={styles.box}>
        <Animated.View style={checkAnimatedStyle}>
          {indeterminate ? (
            <View style={styles.indeterminateDash} />
          ) : (
            checked && <Icon name="checkmark" size={ICON_SIZES[size] ?? 14} variant="inverse" />
          )}
        </Animated.View>
      </View>
      {label && (
        <Text variant="body" style={styles.label}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
