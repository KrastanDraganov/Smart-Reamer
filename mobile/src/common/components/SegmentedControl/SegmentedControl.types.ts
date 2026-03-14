/** A single option within a segmented control. */
export interface SegmentOption {
  /** Display label for the segment. */
  label: string;
  /** Unique value identifying this segment. */
  value: string;
  /** Optional icon rendered beside the label. */
  icon?: React.ReactNode;
}

/** Available sizes for the segmented control. */
export type SegmentedControlSize = 'sm' | 'md';

/** Props for the {@link SegmentedControl} component. */
export interface SegmentedControlProps {
  /** Currently selected segment value. */
  value: string;
  /** Callback invoked when a segment is selected. */
  onChange: (value: string) => void;
  /** Array of segment options to display. */
  options: SegmentOption[];
  /** Size of the control. Defaults to `'md'`. */
  size?: SegmentedControlSize;
  /** Whether the control is disabled. Defaults to `false`. */
  disabled?: boolean;
}
