import type { ReactElement } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

/** Props for the {@link FormField} component. */
export interface FormFieldProps<T extends FieldValues = FieldValues> {
  /** Field path within the form values object. */
  name: FieldPath<T>;
  /** React Hook Form control object. */
  control: Control<T>;
  /** Optional label prepended to the child input. Appends ` *` when required is true. */
  label?: string;
  /** Whether the field is required. Appends an asterisk to the label when true. */
  required?: boolean;
  /** Input element that will receive `value`, `onChangeText`, `onBlur`, `label`, and `error` props via cloneElement. */
  children: ReactElement;
}
