import { StyleSheet, type UnistylesVariants } from 'react-native-unistyles';
import { hs } from '@/theme/metrics';

export const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.metrics.spacingV.p4,
    variants: {
      orientation: {
        vertical: {
          flexDirection: 'column',
        },
        horizontal: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: theme.metrics.spacing.p8,
        },
      },
    },
  },
  option: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: theme.metrics.spacing.p12,
    paddingVertical: theme.metrics.spacingV.p12,
  },
  optionSelected: {},
  optionDisabled: {
    opacity: 0.5,
  },
  radio: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 2,
    borderColor: theme.colors.border.strong,
    backgroundColor: 'transparent',
    variants: {
      size: {
        sm: {
          width: hs(20),
          height: hs(20),
          borderRadius: hs(10),
        },
        md: {
          width: hs(24),
          height: hs(24),
          borderRadius: hs(12),
        },
        lg: {
          width: hs(28),
          height: hs(28),
          borderRadius: hs(14),
        },
      },
    },
  },
  radioSelected: {
    borderColor: theme.colors.brand.primary,
  },
  radioDot: {
    backgroundColor: theme.colors.brand.primary,
    variants: {
      size: {
        sm: {
          width: hs(8),
          height: hs(8),
          borderRadius: hs(4),
        },
        md: {
          width: hs(10),
          height: hs(10),
          borderRadius: hs(5),
        },
        lg: {
          width: hs(12),
          height: hs(12),
          borderRadius: hs(6),
        },
      },
    },
  },
  label: {
    flex: 1,
  },
}));

export type RadioGroupStyleVariants = UnistylesVariants<typeof styles>;
