/** Visual variant controlling the snackbar color scheme. */
export type SnackbarVariant = 'neutral' | 'success' | 'error';

/** An optional action button displayed within the snackbar. */
export interface SnackbarAction {
  /** Label text for the action button. */
  label: string;
  /** Callback invoked when the action button is pressed. */
  onPress: () => void;
}

/** Props for the {@link Snackbar} component. */
export interface SnackbarProps {
  /** Whether the snackbar is visible. */
  visible: boolean;
  /** Message text displayed in the snackbar. */
  message: string;
  /** Optional action button configuration. */
  action?: SnackbarAction;
  /** Duration in milliseconds before auto-dismiss. Defaults to `4000`. */
  duration?: number;
  /** Callback invoked when the snackbar is dismissed. */
  onDismiss: () => void;
  /** Visual variant of the snackbar. Defaults to `'neutral'`. */
  variant?: SnackbarVariant;
}
