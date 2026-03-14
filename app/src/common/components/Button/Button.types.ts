import type { PressableProps } from 'react-native';

/** Visual style variant for the Button component. */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

/** Size options for the Button component. */
export type ButtonSize = 'sm' | 'md' | 'lg';

/** Props for the {@link Button} component. Extends PressableProps (excluding children). */
export interface ButtonProps extends Omit<PressableProps, 'children'> {
  /** Text label displayed inside the button. */
  title: string;
  /** Visual style of the button. Defaults to `'primary'`. */
  variant?: ButtonVariant;
  /** Size of the button. Defaults to `'md'`. */
  size?: ButtonSize;
  /** Whether to show a loading spinner and disable interaction. Defaults to `false`. */
  loading?: boolean;
  /** Whether the button is disabled. Defaults to `false`. */
  disabled?: boolean;
  /** Whether the button stretches to fill its container width. Defaults to `false`. */
  fullWidth?: boolean;
  /** Icon element rendered before the title. */
  leftIcon?: React.ReactNode;
  /** Icon element rendered after the title. */
  rightIcon?: React.ReactNode;
}
