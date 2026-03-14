import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Text } from '@/common/components/Text';
import { UniActivityIndicator } from '@/common/components/uni';
import { useAnimatedPress } from '@/hooks/useAnimatedPress';
import { styles } from './Button.styles';
import type { ButtonProps } from './Button.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function getSpinnerColor(
  variant: string,
  theme: { colors: { text: { inverse: string; primary: string }; brand: { primary: string } } }
) {
  if (variant === 'primary') return theme.colors.text.inverse;
  if (variant === 'secondary') return theme.colors.text.primary;
  return theme.colors.brand.primary;
}

/**
 * Pressable button with multiple variants, sizes, loading state, and optional icons.
 *
 * @example
 * ```tsx
 * <Button title="Submit" variant="primary" onPress={handleSubmit} />
 * <Button title="Loading" loading />
 * ```
 */
export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  ...rest
}: ButtonProps) {
  const { animatedStyle, onPressIn, onPressOut } = useAnimatedPress();

  styles.useVariants({
    variant,
    size,
    fullWidth,
    disabled: disabled || loading,
  });

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle, style as object]}
      disabled={disabled || loading}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      {...rest}
    >
      {loading ? (
        <UniActivityIndicator
          uniProps={(theme) => ({
            color: getSpinnerColor(variant, theme),
          })}
        />
      ) : (
        <>
          {leftIcon}
          <Text style={styles.label}>{title}</Text>
          {rightIcon}
        </>
      )}
    </AnimatedPressable>
  );
}
