import { StyleSheet } from 'react-native-unistyles';
import { hs } from '@/theme/metrics';

const BASE_SIZE = hs(180);

export const SCANNING_DIMENSIONS = {
  baseSize: BASE_SIZE,
  ring1: BASE_SIZE * 0.5,
  ring2: BASE_SIZE * 0.75,
  ring3: BASE_SIZE,
} as const;

export const styles = StyleSheet.create((theme) => ({
  container: {
    width: BASE_SIZE,
    height: BASE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: BASE_SIZE / 2,
    borderWidth: 2,
    borderColor: theme.colors.brand.primary,
  },
  centerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
