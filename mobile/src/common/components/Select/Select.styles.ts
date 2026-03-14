import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  wrapper: {
    gap: theme.metrics.spacingV.p4,
  },
  label: {
    color: theme.colors.text.secondary,
  },
  trigger: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    backgroundColor: theme.colors.background.input,
    borderRadius: theme.metrics.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    variants: {
      size: {
        sm: {
          paddingHorizontal: theme.metrics.spacing.p8,
          paddingVertical: theme.metrics.spacingV.p8,
        },
        md: {
          paddingHorizontal: theme.metrics.spacing.p12,
          paddingVertical: theme.metrics.spacingV.p12,
        },
        lg: {
          paddingHorizontal: theme.metrics.spacing.p16,
          paddingVertical: theme.metrics.spacingV.p16,
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
  selectedText: {
    color: theme.colors.text.primary,
  },
  placeholderText: {
    color: theme.colors.text.muted,
  },
  errorText: {
    color: theme.colors.state.error,
  },
  sheetBackground: {
    backgroundColor: theme.colors.background.surface,
  },
  sheetHandle: {
    backgroundColor: theme.colors.border.default,
  },
  listContent: {
    paddingVertical: theme.metrics.spacingV.p8,
  },
  option: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: theme.metrics.spacingV.p12,
    paddingHorizontal: theme.metrics.spacing.p16,
    variants: {
      disabled: {
        true: {
          opacity: 0.5,
        },
      },
    },
  },
  optionText: {
    color: theme.colors.text.primary,
  },
  optionTextSelected: {
    color: theme.colors.brand.primary,
  },
}));

export type SelectStyleVariants = UnistylesVariants<typeof styles>;
