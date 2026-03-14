import { z } from 'zod/v4';

export const lockNameSchema = z.object({
  name: z
    .string()
    .min(1, 'locks.validation.nameRequired')
    .max(30, 'locks.validation.nameTooLong')
    .trim(),
});

export type LockNameFormData = z.infer<typeof lockNameSchema>;
