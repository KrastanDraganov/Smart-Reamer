import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  badge: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: theme.metrics.borderRadius.full,
    variants: {
      variant: {
        solid: {
          borderWidth: 0,
        },
        outline: {
          borderWidth: 1,
          backgroundColor: 'transparent',
        },
      },
      size: {
        sm: {
          minWidth: hs(18),
          height: hs(18),
          paddingHorizontal: theme.metrics.spacing.p4,
        },
        md: {
          minWidth: hs(22),
          height: hs(22),
          paddingHorizontal: theme.metrics.spacing.p4,
        },
      },
      colorScheme: {
        primary: {},
        success: {},
        error: {},
        warning: {},
        info: {},
      },
    },
    compoundVariants: [
      {
        variant: 'solid',
        colorScheme: 'primary',
        styles: {
          backgroundColor: theme.colors.brand.primary,
          borderColor: theme.colors.brand.primary,
        },
      },
      {
        variant: 'solid',
        colorScheme: 'success',
        styles: {
          backgroundColor: theme.colors.state.success,
          borderColor: theme.colors.state.success,
        },
      },
      {
        variant: 'solid',
        colorScheme: 'error',
        styles: {
          backgroundColor: theme.colors.state.error,
          borderColor: theme.colors.state.error,
        },
      },
      {
        variant: 'solid',
        colorScheme: 'warning',
        styles: {
          backgroundColor: theme.colors.state.warning,
          borderColor: theme.colors.state.warning,
        },
      },
      {
        variant: 'solid',
        colorScheme: 'info',
        styles: {
          backgroundColor: theme.colors.state.info,
          borderColor: theme.colors.state.info,
        },
      },
      {
        variant: 'outline',
        colorScheme: 'primary',
        styles: { borderColor: theme.colors.brand.primary },
      },
      {
        variant: 'outline',
        colorScheme: 'success',
        styles: { borderColor: theme.colors.state.success },
      },
      {
        variant: 'outline',
        colorScheme: 'error',
        styles: { borderColor: theme.colors.state.error },
      },
      {
        variant: 'outline',
        colorScheme: 'warning',
        styles: { borderColor: theme.colors.state.warning },
      },
      {
        variant: 'outline',
        colorScheme: 'info',
        styles: { borderColor: theme.colors.state.info },
      },
    ],
  },
  badgeText: {
    variants: {
      variant: {
        solid: {},
        outline: {},
      },
      colorScheme: {
        primary: {},
        success: {},
        error: {},
        warning: {},
        info: {},
      },
    },
    compoundVariants: [
      {
        variant: 'outline',
        colorScheme: 'primary',
        styles: { color: theme.colors.brand.primary },
      },
      {
        variant: 'outline',
        colorScheme: 'success',
        styles: { color: theme.colors.state.success },
      },
      {
        variant: 'outline',
        colorScheme: 'error',
        styles: { color: theme.colors.state.error },
      },
      {
        variant: 'outline',
        colorScheme: 'warning',
        styles: { color: theme.colors.state.warning },
      },
      {
        variant: 'outline',
        colorScheme: 'info',
        styles: { color: theme.colors.state.info },
      },
    ],
  },
  dotWrapper: {
    position: 'relative' as const,
  },
  dot: {
    position: 'absolute' as const,
    top: -2,
    right: -2,
    width: hs(8),
    height: hs(8),
    borderRadius: theme.metrics.borderRadius.xs,
    variants: {
      colorScheme: {
        primary: { backgroundColor: theme.colors.brand.primary },
        success: { backgroundColor: theme.colors.state.success },
        error: { backgroundColor: theme.colors.state.error },
        warning: { backgroundColor: theme.colors.state.warning },
        info: { backgroundColor: theme.colors.state.info },
      },
    },
  },
}));

export type BadgeStyleVariants = UnistylesVariants<typeof styles>;
