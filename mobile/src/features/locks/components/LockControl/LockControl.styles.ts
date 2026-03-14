import { StyleSheet } from 'react-native-unistyles';
import { hs } from '@/theme/metrics';

const CONTROL_SIZE = hs(200);
const RING_SIZE = CONTROL_SIZE + hs(24);
const INNER_SIZE = CONTROL_SIZE - hs(32);

export const DIMENSIONS = {
  controlSize: CONTROL_SIZE,
  ringSize: RING_SIZE,
  innerSize: INNER_SIZE,
} as const;

export const styles = StyleSheet.create((theme) => ({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: RING_SIZE,
    height: RING_SIZE,
  },
  ring: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 3,
    borderColor: theme.colors.border.subtle,
  },
  outerCircle: {
    width: CONTROL_SIZE,
    height: CONTROL_SIZE,
    borderRadius: CONTROL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.surface,
    shadowColor: theme.colors.shadow.color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: theme.colors.shadow.elevationMedium,
  },
  innerCircle: {
    width: INNER_SIZE,
    height: INNER_SIZE,
    borderRadius: INNER_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusLabel: {
    marginTop: theme.metrics.spacingV.p8,
  },
}));
