import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: theme.metrics.spacing.p32,
    backgroundColor: theme.colors.background.app,
  },
  icon: {
    color: theme.colors.state.error,
    marginBottom: theme.metrics.spacingV.p16,
  },
  title: {
    marginBottom: theme.metrics.spacingV.p8,
  },
  message: {
    color: theme.colors.text.secondary,
    marginBottom: theme.metrics.spacingV.p24,
  },
  errorDetail: {
    color: theme.colors.text.muted,
    marginBottom: theme.metrics.spacingV.p24,
  },
  button: {
    backgroundColor: theme.colors.brand.primary,
    paddingHorizontal: theme.metrics.spacing.p24,
    paddingVertical: theme.metrics.spacingV.p12,
    borderRadius: theme.metrics.borderRadius.lg,
  },
  buttonText: {
    color: theme.colors.text.inverse,
  },
}));
