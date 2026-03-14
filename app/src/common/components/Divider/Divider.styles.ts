import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  divider: {
    backgroundColor: theme.colors.border.default,
    variants: {
      orientation: {
        horizontal: {
          height: 1,
          width: '100%',
        },
        vertical: {
          width: 1,
          alignSelf: 'stretch',
        },
      },
      bold: {
        true: {
          opacity: 1,
        },
        false: {
          opacity: 1,
        },
      },
      inset: {
        true: {
          marginHorizontal: theme.metrics.spacing.p16,
        },
      },
    },
    compoundVariants: [
      {
        orientation: 'horizontal',
        bold: true,
        styles: {
          height: 2,
        },
      },
      {
        orientation: 'vertical',
        bold: true,
        styles: {
          width: 2,
        },
      },
    ],
  },
}));

export type DividerStyleVariants = UnistylesVariants<typeof styles>;
