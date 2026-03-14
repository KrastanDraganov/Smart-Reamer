import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: theme.metrics.borderRadius.lg,
    gap: theme.metrics.spacing.p8,
    variants: {
      variant: {
        primary: {
          backgroundColor: theme.colors.brand.primary,
        },
        secondary: {
          backgroundColor: theme.colors.background.surfaceAlt,
        },
        outline: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border.default,
        },
        ghost: {
          backgroundColor: 'transparent',
        },
      },
      size: {
        sm: {
          paddingHorizontal: theme.metrics.spacing.p12,
          paddingVertical: theme.metrics.spacingV.p8,
        },
        md: {
          paddingHorizontal: theme.metrics.spacing.p16,
          paddingVertical: theme.metrics.spacingV.p12,
        },
        lg: {
          paddingHorizontal: theme.metrics.spacing.p24,
          paddingVertical: theme.metrics.spacingV.p16,
        },
      },
      fullWidth: {
        true: {
          width: '100%',
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
        },
      },
    },
  },
  label: {
    fontWeight: '600',
    variants: {
      variant: {
        primary: {
          color: theme.colors.text.inverse,
        },
        secondary: {
          color: theme.colors.text.primary,
        },
        outline: {
          color: theme.colors.brand.primary,
        },
        ghost: {
          color: theme.colors.brand.primary,
        },
      },
      size: {
        sm: {
          fontSize: theme.fonts.size.sm,
        },
        md: {
          fontSize: theme.fonts.size.md,
        },
        lg: {
          fontSize: theme.fonts.size.lg,
        },
      },
    },
  },
}));

export type ButtonStyleVariants = UnistylesVariants<typeof styles>;
