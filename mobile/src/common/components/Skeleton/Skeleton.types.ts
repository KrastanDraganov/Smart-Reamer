import type { DimensionValue } from 'react-native';

/** Shape variant for the skeleton placeholder. */
export type SkeletonVariant = 'text' | 'circle' | 'rect';

/** Props for the {@link Skeleton} component. */
export interface SkeletonProps {
  /** Shape variant of the placeholder. Defaults to `'rect'`. */
  variant?: SkeletonVariant;
  /** Width of the skeleton element. */
  width?: DimensionValue;
  /** Height of the skeleton element. */
  height?: DimensionValue;
  /** Whether to animate the pulse effect. Defaults to `true`. */
  animated?: boolean;
}
