import type { ColorScheme } from '@/common/components/shared.types';

/** Available size variants for the ProgressBar track height. */
export type ProgressBarSize = 'sm' | 'md' | 'lg';

/** Props for the {@link ProgressBar} component. */
export interface ProgressBarProps {
  /** Current progress value between 0 and 100. Ignored when `indeterminate` is `true`. Defaults to `0`. */
  value?: number;
  /** Size variant controlling the track height. Defaults to `'md'`. */
  size?: ProgressBarSize;
  /** Color scheme applied to the filled portion of the bar. Defaults to `'primary'`. */
  colorScheme?: ColorScheme;
  /** Whether to display an animated indeterminate progress indicator. Defaults to `false`. */
  indeterminate?: boolean;
  /** Custom accessibility label for the progress bar. Defaults to `'Progress'`. */
  accessibilityLabel?: string;
}
