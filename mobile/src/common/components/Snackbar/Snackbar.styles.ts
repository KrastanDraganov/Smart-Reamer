import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme, rt) => ({
  container: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingTop: theme.metrics.spacingV.p12,
    paddingBottom: rt.insets.bottom + hs(8),
    gap: theme.metrics.spacing.p12,
    elevation: theme.colors.shadow.elevationLarge,
    shadowColor: theme.colors.shadow.color,
    shadowOffset: { width: 0, height: hs(-2) },
    shadowOpacity: 0.1,
    shadowRadius: hs(8),
    variants: {
      variant: {
        neutral: {
          backgroundColor: theme.colors.background.elevated,
        },
        success: {
          backgroundColor: theme.colors.state.success,
        },
        error: {
          backgroundColor: theme.colors.state.error,
        },
      },
    },
  },
  messageText: {
    flex: 1,
    variants: {
      variant: {
        neutral: {
          color: theme.colors.text.primary,
        },
        success: {
          color: theme.colors.text.inverse,
        },
        error: {
          color: theme.colors.text.inverse,
        },
      },
    },
  },
  actionText: {
    color: theme.colors.brand.secondary,
  },
}));

export type SnackbarStyleVariants = UnistylesVariants<typeof styles>;
