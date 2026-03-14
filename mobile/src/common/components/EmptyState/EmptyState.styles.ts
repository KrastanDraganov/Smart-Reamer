import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: theme.metrics.spacingV.p12,
    variants: {
      size: {
        sm: {
          padding: theme.metrics.spacing.p16,
        },
        md: {
          padding: theme.metrics.spacing.p32,
        },
        lg: {
          padding: theme.metrics.spacing.p48,
        },
      },
    },
  },
  iconContainer: {
    marginBottom: theme.metrics.spacingV.p4,
  },
  message: {
    color: theme.colors.text.secondary,
  },
}));

export type EmptyStateStyleVariants = UnistylesVariants<typeof styles>;
