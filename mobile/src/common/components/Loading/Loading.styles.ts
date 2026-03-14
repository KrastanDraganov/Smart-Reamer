import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    variants: {
      fullScreen: {
        true: {
          flex: 1,
          backgroundColor: theme.colors.background.app,
        },
        false: {
          padding: theme.metrics.spacing.p16,
        },
      },
    },
  },
  message: {
    marginTop: theme.metrics.spacingV.p12,
    color: theme.colors.text.secondary,
  },
}));

export type LoadingStyleVariants = UnistylesVariants<typeof styles>;
