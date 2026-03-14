import type { ComponentSize } from '@/common/components/shared.types';

/** Props for the {@link Checkbox} component. */
export interface CheckboxProps {
  /** Whether the checkbox is currently checked. */
  checked: boolean;
  /** Callback invoked when the checked state changes. Receives the new checked value. */
  onChange: (checked: boolean) => void;
  /** Whether the checkbox is disabled and cannot be toggled. Defaults to `false`. */
  disabled?: boolean;
  /** Whether to display an indeterminate (mixed) state instead of a checkmark. Defaults to `false`. */
  indeterminate?: boolean;
  /** Size of the checkbox. Defaults to `'md'`. */
  size?: ComponentSize;
  /** Text label displayed next to the checkbox. */
  label?: string;
}
