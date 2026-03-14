import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: theme.colors.brand.primary,
    overflow: 'hidden' as const,
    variants: {
      size: {
        xs: {
          width: hs(24),
          height: hs(24),
          borderRadius: hs(12),
        },
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
          width: hs(56),
          height: hs(56),
          borderRadius: hs(28),
        },
        xl: {
          width: hs(80),
          height: hs(80),
          borderRadius: hs(40),
        },
      },
    },
  },
  initials: {
    color: theme.colors.text.inverse,
  },
}));

export type AvatarStyleVariants = UnistylesVariants<typeof styles>;
