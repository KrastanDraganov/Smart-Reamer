import { Image } from 'expo-image';
import { View } from 'react-native';
import { Icon } from '@/common/components/Icon';
import { Text } from '@/common/components/Text';
import { styles } from './Avatar.styles';
import { AVATAR_SIZES } from './Avatar.types';
import type { AvatarProps } from './Avatar.types';

/**
 * Displays a user avatar as an image, initials, custom icon, or default person icon.
 *
 * @example
 * ```tsx
 * <Avatar source={{ uri: 'https://example.com/photo.jpg' }} size="lg" />
 * <Avatar initials="JD" size="md" />
 * ```
 */
export function Avatar({ source, initials, icon, size = 'md', accessibilityLabel }: AvatarProps) {
  const dimension = AVATAR_SIZES[size];
  const fontSize = dimension * 0.4;

  styles.useVariants({ size });

  if (source) {
    return (
      <Image
        source={source}
        style={styles.container}
        contentFit="cover"
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  if (initials) {
    return (
      <View
        style={styles.container}
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel}
      >
        <Text weight="semibold" style={[styles.initials, { fontSize }]}>
          {initials.slice(0, 2).toUpperCase()}
        </Text>
      </View>
    );
  }

  if (icon) {
    return (
      <View
        style={styles.container}
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel}
      >
        {icon}
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? 'User avatar'}
    >
      <Icon name="person" variant="inverse" size={dimension * 0.5} />
    </View>
  );
}
