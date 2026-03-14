import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    variants: {
      variant: {
        primary: {
          backgroundColor: theme.colors.brand.primary,
        },
        secondary: {
          backgroundColor: theme.colors.background.surfaceAlt,
        },
        outline: {
          borderWidth: 1,
          borderColor: theme.colors.border.default,
          backgroundColor: 'transparent',
        },
        ghost: {
          backgroundColor: 'transparent',
        },
      },
      size: {
        sm: {
          width: hs(32),
          height: hs(32),
          borderRadius: hs(16),
        },
        md: {
          width: hs(40),
          height: hs(40),
          borderRadius: hs(20),
        },
        lg: {
          width: hs(48),
          height: hs(48),
          borderRadius: hs(24),
        },
      },
      disabled: {
        true: {
          opacity: 0.5,
        },
      },
    },
  },
}));

export const ICON_SIZES: Record<string, number> = {
  sm: hs(16),
  md: hs(20),
  lg: hs(24),
};

export type IconButtonStyleVariants = UnistylesVariants<typeof styles>;
