import { View } from 'react-native';
import { Text } from '@/common/components/Text';
import { UniActivityIndicator } from '@/common/components/uni';
import { styles } from './Loading.styles';
import type { LoadingProps } from './Loading.types';

/**
 * Displays a centered activity indicator with an optional text message.
 *
 * @example
 * ```tsx
 * <Loading message="Fetching data..." fullScreen />
 * ```
 */
export function Loading({
  message,
  fullScreen = false,
  size = 'large',
  accessibilityLabel,
}: LoadingProps) {
  styles.useVariants({ fullScreen });

  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? message ?? 'Loading'}
    >
      <UniActivityIndicator
        size={size}
        uniProps={(theme) => ({ color: theme.colors.brand.primary })}
      />
      {message && (
        <Text variant="bodySmall" style={styles.message}>
          {message}
        </Text>
      )}
    </View>
  );
}
