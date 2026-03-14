import type { ComponentSize } from '@/common/components/shared.types';

/** Represents a single option within a {@link Select} dropdown. */
export interface SelectOption {
  /** Display text for this option. */
  label: string;
  /** Unique value associated with this option. */
  value: string;
  /** Whether this option is disabled. Defaults to `false`. */
  disabled?: boolean;
}

/** Props for the {@link Select} component. */
export interface SelectProps {
  /** The currently selected option value. */
  value: string;
  /** Callback fired with the new value when an option is selected. */
  onChange: (value: string) => void;
  /** Array of selectable options. */
  options: SelectOption[];
  /** Placeholder text displayed when no option is selected. */
  placeholder?: string;
  /** Label text displayed above the select trigger. */
  label?: string;
  /** Error message displayed below the select trigger. */
  error?: string;
  /** Whether the select is disabled. Defaults to `false`. */
  disabled?: boolean;
  /** Size variant controlling the select dimensions. Defaults to `'md'`. */
  size?: ComponentSize;
}
