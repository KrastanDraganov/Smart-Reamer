import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  text: {
    color: theme.colors.text.primary,
    variants: {
      variant: {
        h1: {
          fontSize: theme.fonts.size['3xl'],
          fontWeight: 'bold',
        },
        h2: {
          fontSize: theme.fonts.size['2xl'],
          fontWeight: 'bold',
        },
        h3: {
          fontSize: theme.fonts.size.xl,
          fontWeight: '600',
        },
        body: {
          fontSize: theme.fonts.size.md,
          fontWeight: '400',
        },
        bodySmall: {
          fontSize: theme.fonts.size.sm,
          fontWeight: '400',
        },
        caption: {
          fontSize: theme.fonts.size.xs,
          fontWeight: '400',
        },
        label: {
          fontSize: theme.fonts.size.sm,
          fontWeight: '600',
        },
        overline: {
          fontSize: theme.fonts.size.xxs,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: hs(1),
        },
      },
      weight: {
        regular: { fontWeight: '400' },
        medium: { fontWeight: '500' },
        semibold: { fontWeight: '600' },
        bold: { fontWeight: 'bold' },
      },
      align: {
        left: { textAlign: 'left' },
        center: { textAlign: 'center' },
        right: { textAlign: 'right' },
      },
      color: {
        primary: { color: theme.colors.text.primary },
        secondary: { color: theme.colors.text.secondary },
        tertiary: { color: theme.colors.text.tertiary },
        muted: { color: theme.colors.text.muted },
        inverse: { color: theme.colors.text.inverse },
        accent: { color: theme.colors.text.accent },
        link: { color: theme.colors.text.link },
      },
    },
  },
}));

export type TextStyleVariants = UnistylesVariants<typeof styles>;
