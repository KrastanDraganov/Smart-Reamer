import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { vs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  track: {
    width: '100%',
    backgroundColor: theme.colors.background.surfaceAlt,
    overflow: 'hidden' as const,
    variants: {
      size: {
        sm: {
          height: vs(4),
          borderRadius: vs(2),
        },
        md: {
          height: vs(8),
          borderRadius: vs(4),
        },
        lg: {
          height: vs(12),
          borderRadius: vs(6),
        },
      },
    },
  },
  fill: {
    height: '100%',
    position: 'absolute' as const,
    top: 0,
    left: 0,
    variants: {
      size: {
        sm: {
          borderRadius: vs(2),
        },
        md: {
          borderRadius: vs(4),
        },
        lg: {
          borderRadius: vs(6),
        },
      },
      colorScheme: {
        primary: {
          backgroundColor: theme.colors.brand.primary,
        },
        success: {
          backgroundColor: theme.colors.state.success,
        },
        error: {
          backgroundColor: theme.colors.state.error,
        },
        warning: {
          backgroundColor: theme.colors.state.warning,
        },
        info: {
          backgroundColor: theme.colors.state.info,
        },
      },
    },
  },
}));

export type ProgressBarStyleVariants = UnistylesVariants<typeof styles>;
