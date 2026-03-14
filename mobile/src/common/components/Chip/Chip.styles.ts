import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderRadius: theme.metrics.borderRadius.full,
    alignSelf: 'flex-start' as const,
    variants: {
      variant: {
        solid: {
          backgroundColor: theme.colors.background.surfaceAlt,
        },
        outline: {
          borderWidth: 1,
          borderColor: theme.colors.border.default,
        },
      },
      size: {
        sm: {
          paddingHorizontal: theme.metrics.spacing.p8,
          paddingVertical: theme.metrics.spacingV.p4,
          gap: theme.metrics.spacing.p4,
        },
        md: {
          paddingHorizontal: theme.metrics.spacing.p12,
          paddingVertical: theme.metrics.spacingV.p8,
          gap: theme.metrics.spacing.p4,
        },
      },
      selected: {
        true: {
          backgroundColor: theme.colors.brand.primary,
          borderColor: theme.colors.brand.primary,
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
        },
      },
    },
  },
  iconWrapper: {
    marginRight: theme.metrics.spacing.p4,
  },
  label: {
    color: theme.colors.text.primary,
    variants: {
      selected: {
        true: {
          color: theme.colors.text.inverse,
        },
      },
    },
  },
}));

export type ChipStyleVariants = UnistylesVariants<typeof styles>;
