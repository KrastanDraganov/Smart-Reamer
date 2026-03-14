import type { ComponentSize } from '@/common/components/shared.types';

/** Props for the {@link SearchBar} component. */
export interface SearchBarProps {
  /** Current text value of the search input. */
  value: string;
  /** Callback fired when the search text changes. */
  onChangeText: (text: string) => void;
  /** Placeholder text displayed when the input is empty. */
  placeholder?: string;
  /** Callback fired when the user submits the search (e.g. presses return). */
  onSubmit?: () => void;
  /** Callback fired when the clear button is pressed, after the text is cleared. */
  onClear?: () => void;
  /** Whether to show a loading spinner in place of the clear button. Defaults to `false`. */
  loading?: boolean;
  /** Whether the input should be focused on mount. Defaults to `false`. */
  autoFocus?: boolean;
  /** Size variant controlling the search bar dimensions. Defaults to `'md'`. */
  size?: ComponentSize;
}
