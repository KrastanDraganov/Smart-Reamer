import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { vs } from '@/theme/metrics';

const TAB_BAR_HEIGHT = vs(60);
const ANDROID_EXTRA = vs(8);

export function useBottomPadding() {
  const { bottom } = useSafeAreaInsets();
  const base = TAB_BAR_HEIGHT + bottom;

  return Platform.OS === 'android' ? base + ANDROID_EXTRA : base;
}
