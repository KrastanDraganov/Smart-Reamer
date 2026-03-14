import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect } from 'react';
import { Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';
import { useAnimatedTheme } from 'react-native-unistyles/reanimated';
import { vs } from '@/theme/metrics';
import { styles } from './TabBar.styles';
import type { TabBarProps } from './TabBar.types';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, { active: IoniconsName; inactive: IoniconsName }> = {
  index: { active: 'home', inactive: 'home-outline' },
  settings: { active: 'settings', inactive: 'settings-outline' },
};

const SPRING_CONFIG = {
  damping: 18,
  stiffness: 180,
  mass: 0.6,
};

export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const animatedTheme = useAnimatedTheme();

  const tabCount = state.routes.length;
  const containerWidth = useSharedValue(0);
  const activeIndex = useSharedValue(state.index);

  const padding = theme.metrics.spacing.p8;

  useEffect(() => {
    activeIndex.value = state.index;
  }, [state.index, activeIndex]);

  const handleContainerLayout = (e: LayoutChangeEvent) => {
    containerWidth.value = e.nativeEvent.layout.width;
  };

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    if (containerWidth.value === 0) return { width: 0, opacity: 0 };
    const innerWidth = containerWidth.value - padding * 2;
    const singleTabWidth = innerWidth / tabCount;
    return {
      width: singleTabWidth,
      left: withSpring(padding + activeIndex.value * singleTabWidth, SPRING_CONFIG),
      opacity: 1,
      backgroundColor: animatedTheme.value.colors.brand.primary,
    };
  });

  return (
    <View
      style={[styles.container, { marginBottom: insets.bottom + vs(12) }]}
      onLayout={handleContainerLayout}
    >
      {/* Animated sliding indicator — only animated props, no unistyles spread */}
      <Animated.View style={[styles.indicator, indicatorAnimatedStyle]} />

      {/* Tab items — plain Pressable, no AnimatedPressable */}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const icons = TAB_ICONS[route.name] ?? { active: 'ellipse', inactive: 'ellipse-outline' };
        const iconName = isFocused ? icons.active : icons.inactive;
        const iconColor = isFocused ? theme.colors.text.inverse : theme.colors.icon.tertiary;
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : (options.title ?? route.name);

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            style={styles.tab}
          >
            <Ionicons name={iconName} size={20} color={iconColor} />
            <Text style={[styles.label, isFocused ? styles.labelActive : styles.labelInactive]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
