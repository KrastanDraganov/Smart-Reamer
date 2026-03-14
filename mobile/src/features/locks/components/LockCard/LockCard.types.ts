import type { Lock } from '../../types';

export interface LockCardProps {
  lock: Lock;
  onPress: (lock: Lock) => void;
  onToggle: (lock: Lock) => void;
  isToggling?: boolean;
}
