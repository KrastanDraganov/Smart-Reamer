import type { ReactNode } from 'react';
import type { IconProps } from '@/common/components/Icon';

/** Represents a single item within a {@link Menu}. */
export interface MenuItem {
  /** Display text for the menu item. */
  label: string;
  /** Callback fired when the menu item is pressed. */
  onPress: () => void;
  /** Optional icon name rendered to the left of the label. */
  icon?: IconProps['name'];
  /** Whether the menu item is disabled. Defaults to `false`. */
  disabled?: boolean;
  /** Whether the menu item represents a destructive action, applying warning styles. Defaults to `false`. */
  destructive?: boolean;
}

/** Props for the {@link Menu} component. */
export interface MenuProps {
  /** Whether the menu dropdown is currently visible. */
  visible: boolean;
  /** Callback fired when the menu is dismissed (e.g. backdrop press or back button). */
  onDismiss: () => void;
  /** The element that triggers the menu, used for positioning. */
  anchor: ReactNode;
  /** Array of menu items to display. */
  items: MenuItem[];
}
