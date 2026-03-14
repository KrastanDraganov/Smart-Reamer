import { UnistylesRuntime } from 'react-native-unistyles';
import { getItem, setItem, STORAGE_KEYS } from '@/utils/storage';
import {
  compositeThemeName,
  parseCompositeThemeName,
  THEME_PRESET_NAMES,
  type ThemePresetName,
} from './config';

export function applyThemePreset(preset: ThemePresetName) {
  const mode = getCurrentMode();
  const target = compositeThemeName(preset, mode);
  UnistylesRuntime.setTheme(target);
  setItem(STORAGE_KEYS.preferences.themePreset, preset);
}

export function toggleDarkMode(isDark: boolean) {
  const mode = isDark ? 'dark' : 'light';
  const preset = getCurrentPreset();
  const target = compositeThemeName(preset, mode);
  UnistylesRuntime.setTheme(target);
  setItem(STORAGE_KEYS.preferences.theme, mode);
}

export function getCurrentMode(): 'light' | 'dark' {
  const currentName = UnistylesRuntime.themeName;
  if (currentName && typeof currentName === 'string') {
    const { mode } = parseCompositeThemeName(currentName);
    return mode;
  }
  const result = getItem<string>(STORAGE_KEYS.preferences.theme);
  return result.success && result.data === 'dark' ? 'dark' : 'light';
}

export function getCurrentPreset(): ThemePresetName {
  const result = getItem<string>(STORAGE_KEYS.preferences.themePreset);
  if (
    result.success &&
    result.data &&
    THEME_PRESET_NAMES.includes(result.data as ThemePresetName)
  ) {
    return result.data as ThemePresetName;
  }
  return 'default';
}

export function initializeTheme() {
  // Theme is initialized via StyleSheet.configure({ settings: { initialTheme } })
}
