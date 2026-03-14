import { View } from 'react-native';
import { Text } from '@/common/components/Text';
import { styles } from './Badge.styles';
import type { BadgeProps } from './Badge.types';

function getDisplayCount(count: number | undefined, maxCount: number): string | undefined {
  if (count === undefined) return undefined;
  if (count > maxCount) return `${maxCount}+`;
  return `${count}`;
}

/**
 * Displays a small status indicator, count, or dot overlay on a child element.
 *
 * @example
 * ```tsx
 * <Badge count={5} colorScheme="error" />
 * <Badge variant="dot"><Icon name="bell" /></Badge>
 * ```
 */
export function Badge({
  variant = 'solid',
  size = 'md',
  colorScheme = 'primary',
  count,
  maxCount = 99,
  children,
}: BadgeProps) {
  styles.useVariants({ variant: variant === 'dot' ? undefined : variant, size, colorScheme });

  if (variant === 'dot') {
    return (
      <View style={styles.dotWrapper}>
        {children}
        <View style={styles.dot} />
      </View>
    );
  }

  const displayCount = getDisplayCount(count, maxCount);
  const isSolid = variant === 'solid';

  return (
    <View style={styles.badge}>
      {displayCount !== undefined && (
        <Text
          variant="caption"
          weight="semibold"
          color={isSolid ? 'inverse' : undefined}
          style={!isSolid ? styles.badgeText : undefined}
        >
          {displayCount}
        </Text>
      )}
    </View>
  );
}
