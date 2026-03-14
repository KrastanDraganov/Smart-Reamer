import type { ComponentSize } from '@/common/components/shared.types';

/** Represents a single option within a {@link RadioGroup}. */
export interface RadioOption {
  /** Unique value associated with this option. */
  value: string;
  /** Display text for this option. */
  label: string;
  /** Whether this option is disabled. Defaults to `false`. */
  disabled?: boolean;
}

/** Props for the {@link RadioGroup} component. */
export interface RadioGroupProps {
  /** The currently selected option value. */
  value: string;
  /** Callback fired with the new value when a different option is selected. */
  onChange: (value: string) => void;
  /** Array of radio options to render. */
  options: RadioOption[];
  /** Layout direction for the radio options. Defaults to `'vertical'`. */
  orientation?: 'vertical' | 'horizontal';
  /** Size variant controlling radio button and text dimensions. Defaults to `'md'`. */
  size?: ComponentSize;
}
