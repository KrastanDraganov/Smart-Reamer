import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    borderRadius: theme.metrics.borderRadius.lg,
    overflow: 'hidden' as const,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  sectionDisabled: {
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: theme.metrics.spacingV.p12,
    paddingHorizontal: theme.metrics.spacing.p16,
  },
  title: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingBottom: theme.metrics.spacingV.p12,
    overflow: 'hidden' as const,
  },
}));

export type AccordionStyleVariants = UnistylesVariants<typeof styles>;
