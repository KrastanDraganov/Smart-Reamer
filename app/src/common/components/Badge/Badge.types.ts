import type { ColorScheme } from '@/common/components/shared.types';

/** Visual style variant for the Badge component. */
export type BadgeVariant = 'solid' | 'outline' | 'dot';

/** Size options for the Badge component. */
export type BadgeSize = 'sm' | 'md';

/** Props for the {@link Badge} component. */
export interface BadgeProps {
  /** Visual style of the badge. Defaults to `'solid'`. */
  variant?: BadgeVariant;
  /** Size of the badge. Defaults to `'md'`. */
  size?: BadgeSize;
  /** Color scheme applied to the badge. Defaults to `'primary'`. */
  colorScheme?: ColorScheme;
  /** Numeric value to display inside the badge. */
  count?: number;
  /** Maximum count to display before showing `{maxCount}+`. Defaults to `99`. */
  maxCount?: number;
  /** Child element wrapped by the badge when using the `'dot'` variant. */
  children?: React.ReactNode;
}
