import { useCallback, useState } from 'react';
import { Pressable, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  cancelAnimation,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';
import { styles } from './SegmentedControl.styles';
import type { SegmentedControlProps, SegmentOption } from './SegmentedControl.types';

/**
 * Tabbed segmented control with an animated sliding indicator.
 *
 * @example
 * ```tsx
 * <SegmentedControl
 *   value={selected}
 *   onChange={setSelected}
 *   options={[
 *     { label: 'Day', value: 'day' },
 *     { label: 'Week', value: 'week' },
 *   ]}
 * />
 * ```
 */
export function SegmentedControl({
  value,
  onChange,
  options,
  size = 'md',
  disabled = false,
}: SegmentedControlProps) {
  const selectedIndex = options.findIndex((o) => o.value === value);
  const indicatorPosition = useSharedValue(selectedIndex >= 0 ? selectedIndex : 0);
  const [containerWidth, setContainerWidth] = useState(0);
  const { theme } = useUnistyles();

  styles.useVariants({ size, disabled });

  const handleSelect = (optionValue: string, index: number) => {
    if (disabled) return;
    cancelAnimation(indicatorPosition);
    indicatorPosition.value = withTiming(index, { duration: 200 });
    onChange(optionValue);
  };

  const segmentWidth = containerWidth > 0 ? containerWidth / options.length : 0;

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value * segmentWidth }],
    width: segmentWidth,
    opacity: containerWidth > 0 ? 1 : 0,
  }));

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  return (
    <View style={styles.container} accessibilityRole="tablist" onLayout={handleLayout}>
      <Animated.View style={[styles.indicator, indicatorStyle]} />
      {options.map((option, index) => {
        const isSelected = option.value === value;
        return (
          <SegmentItem
            key={option.value}
            option={option}
            index={index}
            isSelected={isSelected}
            disabled={disabled}
            indicatorPosition={indicatorPosition}
            inverseColor={theme.colors.text.inverse}
            secondaryColor={theme.colors.text.secondary}
            onPress={() => handleSelect(option.value, index)}
          />
        );
      })}
    </View>
  );
}

function SegmentItem({
  option,
  index,
  isSelected,
  disabled,
  indicatorPosition,
  inverseColor,
  secondaryColor,
  onPress,
}: {
  option: SegmentOption;
  index: number;
  isSelected: boolean;
  disabled: boolean;
  indicatorPosition: SharedValue<number>;
  inverseColor: string;
  secondaryColor: string;
  onPress: () => void;
}) {
  const textColorStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      indicatorPosition.value,
      [index - 1, index, index + 1],
      [secondaryColor, inverseColor, secondaryColor]
    );
    return { color };
  });

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected }}
      style={styles.segment}
    >
      {option.icon && <View style={styles.segmentIcon}>{option.icon}</View>}
      <Animated.Text
        style={[styles.segmentText, isSelected && styles.segmentTextSelected, textColorStyle]}
      >
        {option.label}
      </Animated.Text>
    </Pressable>
  );
}
