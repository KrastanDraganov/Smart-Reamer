import { UniIonicons } from '@/common/components/uni';
import type { IconProps } from './Icon.types';

/**
 * Renders an Ionicons vector icon with theme-aware color and sizing.
 *
 * @example
 * ```tsx
 * <Icon name="checkmark-circle" variant="accent" sizeVariant="lg" />
 * ```
 */
export function Icon({
  name,
  variant = 'primary',
  size = 24,
  sizeVariant,
  color,
  destructive,
  accessibilityLabel,
}: IconProps) {
  return (
    <UniIonicons
      name={name}
      size={size}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      uniProps={(theme) => ({
        color: destructive ? theme.colors.state.error : (color ?? theme.colors.icon[variant]),
        ...(sizeVariant !== undefined && { size: theme.metrics.iconSize[sizeVariant] }),
      })}
    />
  );
}
