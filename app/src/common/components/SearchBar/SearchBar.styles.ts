import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
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
    },
  },
}));

export type SearchBarStyleVariants = UnistylesVariants<typeof styles>;
