import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: theme.metrics.spacing.p12,
    paddingHorizontal: {
      xs: theme.metrics.spacing.p12,
      sm: theme.metrics.spacing.p16,
      lg: theme.metrics.spacing.p24,
    },
    variants: {
      size: {
        sm: {
          paddingVertical: theme.metrics.spacingV.p8,
        },
        md: {
          paddingVertical: theme.metrics.spacingV.p12,
        },
        lg: {
          paddingVertical: theme.metrics.spacingV.p24,
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
        },
      },
    },
  },
  left: {
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: theme.metrics.spacingV.p4,
  },
  subtitle: {
    color: theme.colors.text.secondary,
  },
  right: {
    flexShrink: 0,
  },
}));

export type ListItemStyleVariants = UnistylesVariants<typeof styles>;
