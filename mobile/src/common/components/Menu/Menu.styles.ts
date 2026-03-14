import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.overlay.modal,
  },
  menu: {
    position: 'absolute' as const,
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.metrics.borderRadius.lg,
    paddingVertical: theme.metrics.spacingV.p4,
    minWidth: hs(180),
    maxWidth: hs(280),
    elevation: theme.colors.shadow.elevationLarge,
    shadowColor: theme.colors.shadow.color,
    shadowOffset: { width: 0, height: hs(4) },
    shadowOpacity: 0.15,
    shadowRadius: hs(12),
  },
  item: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: theme.metrics.spacingV.p12,
    paddingHorizontal: theme.metrics.spacing.p16,
    gap: theme.metrics.spacing.p12,
  },
  itemDisabled: {
    opacity: 0.5,
  },
  itemText: {
    color: theme.colors.text.primary,
  },
  destructiveText: {
    color: theme.colors.state.error,
  },
}));

export type MenuStyleVariants = UnistylesVariants<typeof styles>;
