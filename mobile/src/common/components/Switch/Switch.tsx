import { View } from 'react-native';
import { Text } from '@/common/components/Text';
import { UniSwitch } from '@/common/components/uni';
import { styles } from './Switch.styles';
import type { SwitchProps } from './Switch.types';

/**
 * Toggle switch with optional label, themed track and thumb colors.
 *
 * @example
 * ```tsx
 * <Switch value={isEnabled} onValueChange={setIsEnabled} label="Notifications" />
 * ```
 */
export function Switch({
  value,
  onValueChange,
  disabled = false,
  size = 'md',
  label,
}: SwitchProps) {
  styles.useVariants({ size, disabled });

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="body" style={styles.label}>
          {label}
        </Text>
      )}
      <View style={styles.switchWrapper}>
        <UniSwitch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          accessibilityRole="switch"
          accessibilityLabel={label}
          accessibilityState={{ checked: value, disabled }}
          uniProps={(theme) => ({
            trackColor: {
              false: theme.colors.border.strong,
              true: theme.colors.brand.primary,
            },
            thumbColor: theme.colors.text.inverse,
          })}
        />
      </View>
    </View>
  );
}
