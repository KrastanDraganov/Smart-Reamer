import { View } from 'react-native';
import { styles } from './Divider.styles';
import type { DividerProps } from './Divider.types';

/**
 * A thin line used to separate content sections.
 *
 * @example
 * ```tsx
 * <Divider orientation="horizontal" inset />
 * ```
 */
export function Divider({ orientation = 'horizontal', bold = false, inset = false }: DividerProps) {
  styles.useVariants({ orientation, bold, inset });

  return <View style={styles.divider} />;
}
