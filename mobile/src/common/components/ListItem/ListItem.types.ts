import type { ReactNode } from 'react';
import type { ComponentSize } from '@/common/components/shared.types';

/** Props for the {@link ListItem} component. */
export interface ListItemProps {
  /** Primary text displayed in the list item. */
  title: string;
  /** Optional secondary text displayed below the title. */
  subtitle?: string;
  /** Optional content rendered on the left side (e.g. an icon or avatar). */
  left?: ReactNode;
  /** Optional content rendered on the right side (e.g. a badge or switch). */
  right?: ReactNode;
  /** Callback fired when the list item is pressed. Makes the item pressable when provided. */
  onPress?: () => void;
  /** Whether to render a divider below the list item. Defaults to `false`. */
  divider?: boolean;
  /** Whether the list item is disabled. Defaults to `false`. */
  disabled?: boolean;
  /** Size variant controlling the list item dimensions. Defaults to `'md'`. */
  size?: ComponentSize;
}
