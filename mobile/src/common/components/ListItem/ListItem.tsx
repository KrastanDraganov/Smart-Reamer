import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Divider } from '@/common/components/Divider';
import { Text } from '@/common/components/Text';
import { useAnimatedPress } from '@/hooks/useAnimatedPress';
import { styles } from './ListItem.styles';
import type { ListItemProps } from './ListItem.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * A versatile list item supporting optional press interaction, left/right slots, and a divider.
 *
 * @example
 * ```tsx
 * <ListItem
 *   title="Settings"
 *   subtitle="Manage your preferences"
 *   left={<Icon name="settings" />}
 *   onPress={() => navigate('settings')}
 * />
 * ```
 */
export function ListItem({
  title,
  subtitle,
  left,
  right,
  onPress,
  divider = false,
  disabled = false,
  size = 'md',
}: ListItemProps) {
  styles.useVariants({ size, disabled });
  const { animatedStyle, onPressIn, onPressOut } = useAnimatedPress({ scale: 0.99 });

  const content = (
    <>
      {left && <View style={styles.left}>{left}</View>}
      <View style={styles.content}>
        <Text variant="body">{title}</Text>
        {subtitle && (
          <Text variant="caption" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>
      {right && <View style={styles.right}>{right}</View>}
    </>
  );

  return (
    <>
      {onPress ? (
        <AnimatedPressable
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          style={[styles.container, animatedStyle]}
        >
          {content}
        </AnimatedPressable>
      ) : (
        <View style={styles.container}>{content}</View>
      )}
      {divider && <Divider />}
    </>
  );
}
