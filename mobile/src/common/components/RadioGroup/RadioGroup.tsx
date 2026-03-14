import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Text } from '@/common/components/Text';
import { styles } from './RadioGroup.styles';
import type { RadioGroupProps } from './RadioGroup.types';

/**
 * A group of radio buttons allowing single-selection from a list of options.
 *
 * @example
 * ```tsx
 * <RadioGroup
 *   value={selected}
 *   onChange={setSelected}
 *   options={[
 *     { label: 'Option A', value: 'a' },
 *     { label: 'Option B', value: 'b' },
 *   ]}
 * />
 * ```
 */
export function RadioGroup({
  value,
  onChange,
  options,
  orientation = 'vertical',
  size = 'md',
}: RadioGroupProps) {
  styles.useVariants({ orientation, size });

  return (
    <View style={styles.container} accessibilityRole="radiogroup">
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <RadioItem
            key={option.value}
            label={option.label}
            selected={isSelected}
            disabled={option.disabled}
            onPress={() => onChange(option.value)}
          />
        );
      })}
    </View>
  );
}

function RadioItem({
  label,
  selected,
  disabled,
  onPress,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const dotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(selected ? 1 : 0, { damping: 15 }) }],
    opacity: withSpring(selected ? 1 : 0),
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected, disabled }}
      style={({ pressed }) => [
        styles.option,
        disabled && styles.optionDisabled,
        pressed && { opacity: 0.7 },
      ]}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        <Animated.View style={[styles.radioDot, dotAnimatedStyle]} />
      </View>
      <Text variant="body" style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}
