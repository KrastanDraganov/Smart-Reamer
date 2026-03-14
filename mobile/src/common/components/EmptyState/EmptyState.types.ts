import type { ReactNode } from 'react';
import type { ComponentSize } from '@/common/components/shared.types';

/** Props for the {@link EmptyState} component. */
export interface EmptyStateProps {
  /** Primary heading text. */
  title: string;
  /** Optional descriptive message displayed below the title. */
  message?: string;
  /** Optional icon element rendered above the title. */
  icon?: ReactNode;
  /** Label for the optional call-to-action button. */
  actionLabel?: string;
  /** Callback invoked when the action button is pressed. */
  onAction?: () => void;
  /** Size variant controlling spacing and typography. Defaults to `'md'`. */
  size?: ComponentSize;
}
