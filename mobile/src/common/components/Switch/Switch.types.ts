import type { ComponentSize } from '@/common/components/shared.types';

/** Props for the {@link Switch} component. */
export interface SwitchProps {
  /** Current on/off state. */
  value: boolean;
  /** Callback invoked when the switch is toggled. */
  onValueChange: (value: boolean) => void;
  /** Whether the switch is disabled. Defaults to `false`. */
  disabled?: boolean;
  /** Size of the switch. Defaults to `'md'`. */
  size?: ComponentSize;
  /** Optional text label displayed beside the switch. */
  label?: string;
}
