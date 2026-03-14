import { cloneElement, type ReactElement } from 'react';
import { Controller, type FieldValues } from 'react-hook-form';
import type { FormFieldProps } from './FormField.types';

/**
 * Appends an asterisk to the label when the field is required.
 *
 * @param label - The original label string.
 * @param required - Whether the field is required.
 * @returns The resolved label string or undefined.
 */
function resolveLabel(
  label: string | undefined,
  required: boolean | undefined
): string | undefined {
  if (!label) return undefined;
  if (required) return `${label} *`;
  return label;
}

/**
 * Connects a form input to react-hook-form via Controller, injecting value, change, blur, label, and error props.
 *
 * @example
 * ```tsx
 * <FormField name="email" control={control} label="Email" required>
 *   <Input placeholder="you@example.com" />
 * </FormField>
 * ```
 */
export function FormField<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  required,
  children,
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) =>
        cloneElement(children as ReactElement<Record<string, unknown>>, {
          label: resolveLabel(label, required),
          value,
          onChangeText: onChange,
          onBlur,
          error: error?.message,
        })
      }
    />
  );
}
