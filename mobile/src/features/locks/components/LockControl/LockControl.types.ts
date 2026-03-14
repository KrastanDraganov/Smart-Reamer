export interface LockControlProps {
  isLocked: boolean;
  isOnline: boolean;
  isToggling?: boolean;
  onToggle: () => void;
}
