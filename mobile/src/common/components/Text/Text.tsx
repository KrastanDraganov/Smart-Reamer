import { Text as RNText } from 'react-native';
import { styles } from './Text.styles';
import type { TextProps } from './Text.types';

/**
 * Themed text component with typography variants, weights, and semantic colors.
 *
 * @example
 * ```tsx
 * <Text variant="h2" weight="bold" color="primary">
 *   Hello World
 * </Text>
 * ```
 */
export function Text({
  variant = 'body',
  weight,
  color,
  align,
  style,
  children,
  ...rest
}: TextProps) {
  styles.useVariants({ variant, weight, align, color });

  return (
    <RNText style={[styles.text, style]} {...rest}>
      {children}
    </RNText>
  );
}
