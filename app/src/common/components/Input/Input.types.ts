import type { TextInputProps } from 'react-native';
import type { ComponentSize } from '@/common/components/shared.types';

/** Props for the {@link Input} component. Extends React Native's TextInputProps. */
export interface InputProps extends TextInputProps {
  /** Optional label displayed above the input. */
  label?: string;
  /** Error message displayed below the input. Takes precedence over `helperText`. */
  error?: string;
  /** Helper text displayed below the input when no error is present. */
  helperText?: string;
  /** Whether the input is disabled. Defaults to `false`. */
  disabled?: boolean;
  /** Size variant controlling height and padding. Defaults to `'md'`. */
  size?: ComponentSize;
  /** Optional icon element rendered on the left side of the input. */
  leftIcon?: React.ReactNode;
  /** Optional icon element rendered on the right side of the input. Replaced by password toggle when `secureTextEntry` is set. */
  rightIcon?: React.ReactNode;
}
