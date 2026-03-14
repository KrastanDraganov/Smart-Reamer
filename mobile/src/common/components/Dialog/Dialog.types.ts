import type { ReactNode } from 'react';
import type { ButtonVariant } from '@/common/components/Button';
import type { ComponentSize } from '@/common/components/shared.types';

/** Describes a single action button rendered in the Dialog footer. */
export interface DialogAction {
  /** Text label displayed on the button. */
  label: string;
  /** Callback invoked when the action button is pressed. */
  onPress: () => void;
  /** Button visual variant. Defaults to `'ghost'` when rendered. */
  variant?: ButtonVariant;
}

/** Props for the {@link Dialog} component. */
export interface DialogProps {
  /** Controls whether the dialog is visible. */
  visible: boolean;
  /** Callback invoked when the dialog is dismissed. */
  onDismiss: () => void;
  /** Optional title displayed at the top of the dialog. */
  title?: string;
  /** Optional message body displayed below the title. */
  message?: string;
  /** Array of action buttons rendered in the dialog footer. Defaults to `[]`. */
  actions?: DialogAction[];
  /** Custom content rendered between the message and actions. */
  children?: ReactNode;
  /** Size of the dialog card. Defaults to `'md'`. */
  size?: ComponentSize;
  /** Whether pressing the backdrop dismisses the dialog. Defaults to `true`. */
  dismissOnBackdropPress?: boolean;
}
