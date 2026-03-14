import { View } from 'react-native';
import { Input } from '@/common/components/Input';
import { Text } from '@/common/components/Text';
import { vs } from '@/theme/metrics';
import { styles } from './TextArea.styles';
import type { TextAreaProps } from './TextArea.types';

/**
 * Multi-line text input with optional character counter.
 *
 * @example
 * ```tsx
 * <TextArea
 *   value={text}
 *   onChangeText={setText}
 *   numberOfLines={6}
 *   maxLength={500}
 *   showCount
 * />
 * ```
 */
export function TextArea({
  numberOfLines = 4,
  maxLength,
  showCount = false,
  value,
  style,
  ...rest
}: TextAreaProps) {
  const charCount = value?.length ?? 0;

  return (
    <View>
      <Input
        {...rest}
        value={value}
        multiline
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        textAlignVertical="top"
        style={[styles.textArea, { minHeight: numberOfLines * vs(22) }, style]}
      />
      {showCount && maxLength && (
        <Text variant="caption" style={styles.counter}>
          {`${charCount}/${maxLength}`}
        </Text>
      )}
    </View>
  );
}
