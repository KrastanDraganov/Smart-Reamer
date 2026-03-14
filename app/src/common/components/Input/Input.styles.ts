import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  wrapper: {
    gap: theme.metrics.spacingV.p4,
  },
  label: {
    color: theme.colors.text.secondary,
  },
  inputContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.background.input,
    borderRadius: theme.metrics.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    gap: theme.metrics.spacing.p8,
    variants: {
      size: {
        sm: {
          paddingHorizontal: theme.metrics.spacing.p8,
        },
        md: {
          paddingHorizontal: theme.metrics.spacing.p12,
        },
        lg: {
          paddingHorizontal: theme.metrics.spacing.p16,
        },
      },
      focused: {
        true: {
          borderColor: theme.colors.border.focus,
        },
      },
      error: {
        true: {
          borderColor: theme.colors.state.error,
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
        },
      },
    },
  },
  input: {
    flex: 1,
    color: theme.colors.text.primary,
    variants: {
      size: {
        sm: {
          paddingVertical: theme.metrics.spacingV.p8,
          fontSize: theme.fonts.size.sm,
        },
        md: {
          paddingVertical: theme.metrics.spacingV.p12,
          fontSize: theme.fonts.size.md,
        },
        lg: {
          paddingVertical: theme.metrics.spacingV.p16,
          fontSize: theme.fonts.size.lg,
        },
      },
      disabled: {
        true: {
          color: theme.colors.text.muted,
        },
      },
    },
  },
  errorText: {
    color: theme.colors.state.error,
  },
  helperText: {
    color: theme.colors.text.muted,
  },
}));

export type InputStyleVariants = UnistylesVariants<typeof styles>;
