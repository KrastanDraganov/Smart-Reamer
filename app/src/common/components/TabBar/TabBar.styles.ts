import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    position: 'absolute',
    bottom: 0,
    left: theme.metrics.spacing.p24,
    right: theme.metrics.spacing.p24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.metrics.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    paddingVertical: theme.metrics.spacingV.p8,
    paddingHorizontal: theme.metrics.spacing.p8,
    shadowColor: theme.colors.shadow.color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: theme.colors.shadow.elevationMedium,
  },
  indicator: {
    position: 'absolute',
    top: theme.metrics.spacingV.p4,
    bottom: theme.metrics.spacingV.p4,
    borderRadius: theme.metrics.borderRadius.full,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.metrics.spacingV.p8,
    borderRadius: theme.metrics.borderRadius.full,
    gap: theme.metrics.spacingV.p4,
    zIndex: 1,
  },
  label: {
    fontSize: theme.metrics.fontSize.xxs,
    fontWeight: '600',
  },
  labelActive: {
    color: theme.colors.text.inverse,
  },
  labelInactive: {
    color: theme.colors.icon.tertiary,
  },
}));
