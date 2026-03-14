import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: theme.metrics.spacing.p8,
    paddingVertical: theme.metrics.spacingV.p4,
    variants: {
      disabled: {
        true: {
          opacity: 0.5,
        },
      },
    },
  },
  box: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 2,
    borderColor: theme.colors.border.default,
    variants: {
      size: {
        sm: {
          width: hs(18),
          height: hs(18),
          borderRadius: theme.metrics.borderRadius.xs,
        },
        md: {
          width: hs(22),
          height: hs(22),
          borderRadius: theme.metrics.borderRadius.sm,
        },
        lg: {
          width: hs(26),
          height: hs(26),
          borderRadius: theme.metrics.borderRadius.sm,
        },
      },
      checked: {
        true: {
          backgroundColor: theme.colors.brand.primary,
          borderColor: theme.colors.brand.primary,
        },
      },
      indeterminate: {
        true: {
          backgroundColor: theme.colors.brand.primary,
          borderColor: theme.colors.brand.primary,
        },
      },
    },
  },
  label: {
    flex: 1,
  },
  indeterminateDash: {
    backgroundColor: theme.colors.text.inverse,
    borderRadius: 1,
    variants: {
      size: {
        sm: {
          width: hs(8),
          height: 2,
        },
        md: {
          width: hs(10),
          height: 2,
        },
        lg: {
          width: hs(12),
          height: 2,
        },
      },
    },
  },
}));

export type CheckboxStyleVariants = UnistylesVariants<typeof styles>;
