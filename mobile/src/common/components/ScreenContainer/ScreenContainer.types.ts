import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

/** Props for the {@link ScreenContainer} component. */
export interface ScreenContainerProps {
  /** Content to render inside the screen container. */
  children: ReactNode;
  /** Whether the container should be scrollable via a ScrollView. Defaults to `false`. */
  scrollable?: boolean;
  /** Whether to apply horizontal and vertical padding. Defaults to `true`. */
  padded?: boolean;
  /** Safe area edges to respect. Defaults to `['top']`. */
  edges?: ('top' | 'bottom')[];
  /** Additional styles applied to the container or scroll content. */
  style?: ViewStyle;
}
