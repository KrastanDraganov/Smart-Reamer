/** Visual style variant for the Chip component. */
export type ChipVariant = 'solid' | 'outline';

/** Size variant for the Chip component. */
export type ChipSize = 'sm' | 'md';

/** Props for the {@link Chip} component. */
export interface ChipProps {
  /** Text content displayed inside the chip. */
  label: string;
  /** Visual style variant. Defaults to `'outline'`. */
  variant?: ChipVariant;
  /** Size of the chip. Defaults to `'md'`. */
  size?: ChipSize;
  /** Whether the chip is in a selected state. Defaults to `false`. */
  selected?: boolean;
  /** Callback invoked when the chip is pressed. */
  onPress?: () => void;
  /** Callback invoked when the close button is pressed. Renders a close icon when provided. */
  onClose?: () => void;
  /** Optional icon element rendered before the label. */
  icon?: React.ReactNode;
  /** Whether the chip is disabled. Defaults to `false`. */
  disabled?: boolean;
}
