import { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Icon } from '@/common/components/Icon';
import { Text } from '@/common/components/Text';
import { vs } from '@/theme/metrics';
import { styles } from './Accordion.styles';
import type { AccordionItem, AccordionProps } from './Accordion.types';

function AccordionSection({
  item,
  isExpanded,
  onToggle,
}: {
  item: AccordionItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const rotation = useSharedValue(isExpanded ? 1 : 0);
  const contentHeight = useSharedValue(isExpanded ? 1 : 0);

  const maxContentHeight = vs(500);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 180}deg` }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentHeight.value,
    maxHeight: contentHeight.value * maxContentHeight,
  }));

  const handleToggle = useCallback(() => {
    if (item.disabled) return;
    const newExpanded = !isExpanded;
    rotation.value = withTiming(newExpanded ? 1 : 0, { duration: 250 });
    contentHeight.value = withTiming(newExpanded ? 1 : 0, { duration: 250 });
    onToggle();
  }, [isExpanded, item.disabled, onToggle, rotation, contentHeight]);

  return (
    <View style={[styles.section, item.disabled && styles.sectionDisabled]}>
      <Pressable
        onPress={handleToggle}
        disabled={item.disabled}
        style={styles.header}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded, disabled: item.disabled }}
      >
        <Text variant="body" weight="medium" style={styles.title}>
          {item.title}
        </Text>
        <Animated.View style={chevronStyle}>
          <Icon name="chevron-down" sizeVariant="lg" variant="secondary" />
        </Animated.View>
      </Pressable>
      <Animated.View style={[styles.content, contentStyle]}>{item.content}</Animated.View>
    </View>
  );
}

/**
 * Expandable/collapsible content sections with animated transitions.
 *
 * @example
 * ```tsx
 * <Accordion
 *   items={[{ id: '1', title: 'Section', content: <Text>Body</Text> }]}
 *   multiple
 * />
 * ```
 */
export function Accordion({ items, multiple = false, defaultExpanded = [] }: AccordionProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded));

  const toggle = useCallback(
    (id: string) => {
      setExpanded((prev) => {
        const next = new Set(multiple ? prev : []);
        if (prev.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [multiple]
  );

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <AccordionSection
          key={item.id}
          item={item}
          isExpanded={expanded.has(item.id)}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </View>
  );
}
