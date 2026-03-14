import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.app,
  },
  padded: {
    paddingHorizontal: {
      xs: theme.metrics.spacing.p12,
      sm: theme.metrics.spacing.p16,
      md: theme.metrics.spacing.p24,
      lg: theme.metrics.spacing.p32,
    },
  },
  edgeTop: {
    paddingTop: rt.insets.top,
  },
  edgeBottom: {
    paddingBottom: rt.insets.bottom,
  },
}));

export type ScreenContainerStyleVariants = UnistylesVariants<typeof styles>;
