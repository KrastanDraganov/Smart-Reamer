import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { UniActivityIndicator, UniIonicons } from '@/common/components/uni';
import { useAnimatedPress } from '@/hooks/useAnimatedPress';
import { ICON_SIZES, styles } from './IconButton.styles';
import type { IconButtonProps } from './IconButton.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * A pressable button that displays a single icon with animated press feedback.
 *
 * @example
 * ```tsx
 * <IconButton icon="trash-outline" variant="ghost" onPress={handleDelete} accessibilityLabel="Delete item" />
 * ```
 */
export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  loading = false,
  onPress,
  accessibilityLabel,
}: IconButtonProps) {
  const { animatedStyle, onPressIn, onPressOut } = useAnimatedPress();

  styles.useVariants({ variant, size, disabled: disabled || loading });

  const iconSize = ICON_SIZES[size] ?? ICON_SIZES.md;

  const resolveColor = (theme: {
    colors: {
      text: { inverse: string; primary: string };
      brand: { primary: string };
      icon: { primary: string };
    };
  }) => {
    const colorMap = {
      primary: theme.colors.text.inverse,
      secondary: theme.colors.text.primary,
      outline: theme.colors.brand.primary,
      ghost: theme.colors.icon.primary,
    };
    return colorMap[variant];
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={[styles.container, animatedStyle]}
    >
      {loading ? (
        <UniActivityIndicator size="small" uniProps={(theme) => ({ color: resolveColor(theme) })} />
      ) : (
        <UniIonicons
          name={icon}
          size={iconSize}
          accessibilityRole="image"
          uniProps={(theme) => ({ color: resolveColor(theme) })}
        />
      )}
    </AnimatedPressable>
  );
}
