import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  textArea: {
    paddingTop: theme.metrics.spacingV.p12,
  },
  counter: {
    textAlign: 'right' as const,
    color: theme.colors.text.muted,
    marginTop: theme.metrics.spacingV.p4,
  },
}));

export type TextAreaStyleVariants = UnistylesVariants<typeof styles>;
