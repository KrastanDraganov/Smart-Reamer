import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs, vs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  skeleton: {
    backgroundColor: theme.colors.background.surfaceAlt,
    variants: {
      variant: {
        text: {
          width: '100%',
          height: vs(14),
          borderRadius: hs(4),
        },
        circle: {
          width: hs(40),
          height: hs(40),
          borderRadius: 999,
        },
        rect: {
          width: '100%',
          height: vs(40),
          borderRadius: hs(8),
        },
      },
    },
  },
}));

export type SkeletonStyleVariants = UnistylesVariants<typeof styles>;
