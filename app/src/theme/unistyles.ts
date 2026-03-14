import { Appearance } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { getItem, STORAGE_KEYS } from '../utils/storage';
import { buildAllThemes, compositeThemeName, THEME_PRESET_NAMES } from './config';
import type { CompositeThemeName, ThemePresetName } from './config';
import { breakpoints } from './metrics';

const allThemes = buildAllThemes();

function getInitialThemeName(): CompositeThemeName {
  const presetResult = getItem<string>(STORAGE_KEYS.preferences.themePreset);
  const modeResult = getItem<string>(STORAGE_KEYS.preferences.theme);

  let preset: ThemePresetName = 'default';
  if (
    presetResult.success &&
    presetResult.data &&
    THEME_PRESET_NAMES.includes(presetResult.data as ThemePresetName)
  ) {
    preset = presetResult.data as ThemePresetName;
  }

  let mode: 'light' | 'dark' = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
  if (modeResult.success && modeResult.data) {
    mode = modeResult.data === 'dark' ? 'dark' : 'light';
  }

  return compositeThemeName(preset, mode);
}

type AllThemes = typeof allThemes;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AllThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

type AppBreakpoints = typeof breakpoints;

StyleSheet.configure({
  settings: {
    initialTheme: getInitialThemeName,
    adaptiveThemes: false,
  },
  breakpoints,
  themes: allThemes,
});
