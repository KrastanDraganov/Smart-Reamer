import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: theme.metrics.spacingV.p8,
    variants: {
      size: {
        sm: {
          paddingVertical: theme.metrics.spacingV.p4,
        },
        md: {
          paddingVertical: theme.metrics.spacingV.p8,
        },
        lg: {
          paddingVertical: theme.metrics.spacingV.p12,
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
        },
      },
    },
  },
  label: {
    flex: 1,
    marginRight: theme.metrics.spacing.p12,
  },
  switchWrapper: {
    variants: {
      size: {
        sm: {
          transform: [{ scale: 0.8 }],
        },
        md: {
          transform: [{ scale: 1.0 }],
        },
        lg: {
          transform: [{ scale: 1.2 }],
        },
      },
    },
  },
}));

export type SwitchStyleVariants = UnistylesVariants<typeof styles>;
