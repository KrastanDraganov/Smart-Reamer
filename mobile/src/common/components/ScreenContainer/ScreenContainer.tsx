import { View, ScrollView } from 'react-native';
import { styles } from './ScreenContainer.styles';
import type { ScreenContainerProps } from './ScreenContainer.types';

/**
 * A safe-area-aware screen wrapper that supports both static and scrollable layouts.
 *
 * @example
 * ```tsx
 * <ScreenContainer scrollable padded edges={['top', 'bottom']}>
 *   <Text>Screen content</Text>
 * </ScreenContainer>
 * ```
 */
export function ScreenContainer({
  children,
  scrollable = false,
  padded = true,
  edges = ['top'],
  style,
}: ScreenContainerProps) {
  const hasTop = edges.includes('top');
  const hasBottom = edges.includes('bottom');

  if (scrollable) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          hasTop && styles.edgeTop,
          hasBottom && styles.edgeBottom,
          padded && styles.padded,
          style,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.container,
        hasTop && styles.edgeTop,
        hasBottom && styles.edgeBottom,
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );
}
