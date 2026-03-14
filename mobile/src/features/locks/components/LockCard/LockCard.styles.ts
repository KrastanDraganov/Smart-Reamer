import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.metrics.spacing.p16,
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.metrics.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    gap: theme.metrics.spacing.p12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.metrics.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    variants: {
      locked: {
        true: { backgroundColor: theme.colors.background.section },
        false: { backgroundColor: theme.colors.state.successBg },
      },
      offline: {
        true: { backgroundColor: theme.colors.background.disabled },
      },
    },
  },
  content: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.metrics.spacing.p8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    variants: {
      online: {
        true: { backgroundColor: theme.colors.state.success },
        false: { backgroundColor: theme.colors.state.disabled },
      },
    },
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toggleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    variants: {
      locked: {
        true: { backgroundColor: theme.colors.brand.primary },
        false: { backgroundColor: theme.colors.state.success },
      },
    },
  },
}));

export type LockCardStyleVariants = UnistylesVariants<typeof styles>;
