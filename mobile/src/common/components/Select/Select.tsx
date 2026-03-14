import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef } from 'react';
import { Pressable, View } from 'react-native';
import type { ListRenderItem } from 'react-native';
import { Icon } from '@/common/components/Icon';
import { Text } from '@/common/components/Text';
import { styles } from './Select.styles';
import type { SelectOption, SelectProps } from './Select.types';

/**
 * A select dropdown using a bottom sheet modal to display options.
 *
 * @example
 * ```tsx
 * <Select
 *   value={country}
 *   onChange={setCountry}
 *   options={[
 *     { label: 'Egypt', value: 'eg' },
 *     { label: 'USA', value: 'us' },
 *   ]}
 *   placeholder="Choose a country"
 *   label="Country"
 * />
 * ```
 */
export function Select({
  value,
  onChange,
  options,
  placeholder,
  label,
  error,
  disabled = false,
  size = 'md',
}: SelectProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['40%', '60%'], []);

  styles.useVariants({ size, error: !!error, disabled });

  const selectedOption = options.find((o) => o.value === value);
  const displayText = selectedOption?.label ?? placeholder ?? '';

  const handleOpen = useCallback(() => {
    if (!disabled) {
      bottomSheetRef.current?.present();
    }
  }, [disabled]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      bottomSheetRef.current?.dismiss();
      requestAnimationFrame(() => onChange(optionValue));
    },
    [onChange]
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  const renderItem: ListRenderItem<SelectOption> = useCallback(
    ({ item }) => (
      <Pressable
        onPress={() => handleSelect(item.value)}
        disabled={item.disabled}
        style={styles.option}
        accessibilityRole="radio"
        accessibilityState={{ selected: item.value === value, disabled: item.disabled }}
      >
        <Text
          variant="body"
          style={[styles.optionText, item.value === value && styles.optionTextSelected]}
        >
          {item.label}
        </Text>
        {item.value === value && <Icon name="checkmark" sizeVariant="lg" variant="primary" />}
      </Pressable>
    ),
    [handleSelect, value]
  );

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      )}
      <Pressable
        onPress={handleOpen}
        disabled={disabled}
        accessibilityRole="combobox"
        accessibilityState={{ expanded: false, disabled }}
        style={styles.trigger}
      >
        <Text variant="body" style={selectedOption ? styles.selectedText : styles.placeholderText}>
          {displayText}
        </Text>
        <Icon name="chevron-down" sizeVariant="md" variant="muted" />
      </Pressable>
      {error && (
        <Text variant="caption" style={styles.errorText}>
          {error}
        </Text>
      )}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetHandle}
      >
        <BottomSheetFlatList
          data={options}
          keyExtractor={(item: SelectOption) => item.value}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </BottomSheetModal>
    </View>
  );
}
