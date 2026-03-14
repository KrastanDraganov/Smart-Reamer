import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Icon } from '@/common/components/Icon';
import { UniActivityIndicator, UniTextInput } from '@/common/components/uni';
import { styles } from './SearchBar.styles';
import type { SearchBarProps } from './SearchBar.types';

/**
 * A search input with a leading search icon, clear button, and optional loading indicator.
 *
 * @example
 * ```tsx
 * <SearchBar
 *   value={query}
 *   onChangeText={setQuery}
 *   placeholder="Search items..."
 *   onSubmit={handleSearch}
 * />
 * ```
 */
export function SearchBar({
  value,
  onChangeText,
  placeholder,
  onSubmit,
  onClear,
  loading = false,
  autoFocus = false,
  size = 'md',
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  styles.useVariants({ size, focused });

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View style={styles.container}>
      <Icon name="search" sizeVariant="md" variant="muted" />
      <UniTextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus={autoFocus}
        autoCorrect={false}
        accessibilityLabel={placeholder ?? 'Search'}
        uniProps={(theme) => ({ placeholderTextColor: theme.colors.text.muted })}
      />
      {loading ? (
        <UniActivityIndicator
          size="small"
          uniProps={(theme) => ({ color: theme.colors.text.muted })}
        />
      ) : (
        value.length > 0 && (
          <Pressable
            onPress={handleClear}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Icon name="close-circle" sizeVariant="md" variant="muted" />
          </Pressable>
        )
      )}
    </View>
  );
}
