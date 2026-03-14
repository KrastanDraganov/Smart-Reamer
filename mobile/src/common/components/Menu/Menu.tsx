import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import { Icon } from '@/common/components/Icon';
import { Text } from '@/common/components/Text';
import { styles } from './Menu.styles';
import type { MenuProps } from './Menu.types';

interface AnchorLayout {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
}

/**
 * A dropdown menu anchored to a trigger element, rendered inside a modal overlay.
 *
 * @example
 * ```tsx
 * <Menu
 *   visible={menuOpen}
 *   onDismiss={() => setMenuOpen(false)}
 *   anchor={<IconButton name="ellipsis-vertical" onPress={() => setMenuOpen(true)} />}
 *   items={[
 *     { label: 'Edit', icon: 'pencil', onPress: handleEdit },
 *     { label: 'Delete', icon: 'trash', destructive: true, onPress: handleDelete },
 *   ]}
 * />
 * ```
 */
export function Menu({ visible, onDismiss, anchor, items }: MenuProps) {
  const anchorRef = useRef<View>(null);
  const [anchorLayout, setAnchorLayout] = useState<AnchorLayout | null>(null);
  const [menuHeight, setMenuHeight] = useState(0);

  const handleModalShow = useCallback(() => {
    anchorRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      setAnchorLayout({ pageX, pageY, width, height });
    });
  }, []);

  const handleMenuLayout = useCallback((e: LayoutChangeEvent) => {
    setMenuHeight(e.nativeEvent.layout.height);
  }, []);

  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  let menuTop = 0;
  let menuLeft = 0;
  if (anchorLayout) {
    const showBelow = anchorLayout.pageY + anchorLayout.height + menuHeight <= screenHeight * 0.85;
    menuTop = showBelow
      ? anchorLayout.pageY + anchorLayout.height + 4
      : anchorLayout.pageY - menuHeight - 4;
    menuLeft = Math.min(anchorLayout.pageX, screenWidth - 280);
    menuLeft = Math.max(menuLeft, 8);
  }

  const menuPositionStyle = useMemo<ViewStyle>(
    () => ({
      top: menuTop,
      left: menuLeft,
      opacity: anchorLayout ? 1 : 0,
    }),
    [menuTop, menuLeft, anchorLayout]
  );

  return (
    <View>
      <View ref={anchorRef} collapsable={false}>
        {anchor}
      </View>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onDismiss}
        onShow={handleModalShow}
        statusBarTranslucent
      >
        <Pressable style={styles.backdrop} onPress={onDismiss}>
          <View style={[styles.menu, menuPositionStyle]} onLayout={handleMenuLayout}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              {items.map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => {
                    item.onPress();
                    onDismiss();
                  }}
                  disabled={item.disabled}
                  accessibilityRole="menuitem"
                  accessibilityState={{ disabled: item.disabled }}
                  style={[styles.item, item.disabled && styles.itemDisabled]}
                >
                  {item.icon && (
                    <Icon
                      name={item.icon}
                      sizeVariant="md"
                      destructive={item.destructive}
                      variant={item.destructive ? undefined : 'secondary'}
                    />
                  )}
                  <Text
                    variant="body"
                    style={item.destructive ? styles.destructiveText : styles.itemText}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
