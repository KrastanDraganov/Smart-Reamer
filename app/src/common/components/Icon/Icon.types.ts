import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

/** Semantic color variant for the Icon, mapped to theme icon tokens. */
export type IconVariant = 'primary' | 'secondary' | 'tertiary' | 'muted' | 'inverse' | 'accent';

/** Named size variant for the Icon, mapped to theme metric values. */
export type IconSizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Props for the {@link Icon} component. */
export interface IconProps {
  /** Ionicons icon name. */
  name: ComponentProps<typeof Ionicons>['name'];
  /** Semantic color variant. Defaults to `'primary'`. */
  variant?: IconVariant;
  /** Explicit icon size in pixels. Defaults to `24`. Overridden by `sizeVariant` when provided. */
  size?: number;
  /** Named size variant from the theme metrics. Takes precedence over `size`. */
  sizeVariant?: IconSizeVariant;
  /** Custom color override. Takes precedence over `variant` but not `destructive`. */
  color?: string;
  /** When true, renders the icon in the error/destructive color. */
  destructive?: boolean;
  /** Accessibility label for screen readers. */
  accessibilityLabel?: string;
}
