import type { ImageSource } from 'expo-image';
import { hs } from '@/theme/metrics';

/** Available avatar size options, ranging from extra-small to extra-large. */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Props for the {@link Avatar} component. */
export interface AvatarProps {
  /** Image source to display. Takes priority over initials and icon. */
  source?: ImageSource;
  /** One or two character string rendered as initials fallback. */
  initials?: string;
  /** Custom icon node rendered as a fallback when no source or initials are provided. */
  icon?: React.ReactNode;
  /** Size of the avatar. Defaults to `'md'`. */
  size?: AvatarSize;
  /** Accessibility label for screen readers. */
  accessibilityLabel?: string;
}

/** Mapping of avatar size tokens to their pixel dimensions (horizontally scaled). */
export const AVATAR_SIZES: Record<AvatarSize, number> = {
  xs: hs(24),
  sm: hs(32),
  md: hs(40),
  lg: hs(56),
  xl: hs(80),
};
