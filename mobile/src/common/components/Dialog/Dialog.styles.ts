import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  backdrop: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.overlay.modal,
    padding: theme.metrics.spacing.p16,
  },
  card: {
    backgroundColor: theme.colors.background.modal,
    borderRadius: theme.metrics.borderRadius.xl,
    padding: theme.metrics.spacing.p24,
    gap: theme.metrics.spacingV.p12,
    variants: {
      size: {
        sm: {
          width: '75%',
          padding: theme.metrics.spacing.p16,
        },
        md: {
          width: '85%',
          padding: theme.metrics.spacing.p24,
        },
        lg: {
          width: '95%',
          padding: theme.metrics.spacing.p32,
        },
      },
    },
  },
  title: {
    color: theme.colors.text.primary,
  },
  message: {
    color: theme.colors.text.secondary,
  },
  actions: {
    flexDirection: 'row' as const,
    justifyContent: 'flex-end' as const,
    gap: theme.metrics.spacing.p8,
    marginTop: theme.metrics.spacingV.p8,
  },
}));

export type DialogStyleVariants = UnistylesVariants<typeof styles>;
