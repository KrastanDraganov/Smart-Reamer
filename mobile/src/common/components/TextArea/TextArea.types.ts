import type { InputProps } from '@/common/components/Input';

/** Props for the {@link TextArea} component. Extends Input props without secureTextEntry. */
export interface TextAreaProps extends Omit<InputProps, 'secureTextEntry'> {
  /** Number of visible text lines. Defaults to `4`. */
  numberOfLines?: number;
  /** Maximum character count allowed. */
  maxLength?: number;
  /** Whether to display a character counter below the field. Defaults to `false`. */
  showCount?: boolean;
}
