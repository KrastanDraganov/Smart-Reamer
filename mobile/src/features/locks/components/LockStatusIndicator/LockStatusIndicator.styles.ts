import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.metrics.spacing.p24,
    paddingVertical: theme.metrics.spacingV.p12,
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
}));
