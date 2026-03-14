import { darkColors } from './dark-theme';
import { FONTS } from './fonts';
import { lightColors } from './light-theme';
import metrics, { fontSize } from './metrics';
import type { ThemeColors } from './types';

function buildAppTheme(colors: ThemeColors) {
  return {
    colors,
    metrics: { ...metrics },
    fonts: { ...FONTS, size: { ...fontSize } },
  };
}

export const appThemes = {
  light: buildAppTheme(lightColors),
  dark: buildAppTheme(darkColors),
};

export type ThemePresetName = 'default';

export type CompositeThemeName = `${ThemePresetName}_${'light' | 'dark'}`;

export function compositeThemeName(
  preset: ThemePresetName,
  mode: 'light' | 'dark'
): CompositeThemeName {
  return `${preset}_${mode}`;
}

export function parseCompositeThemeName(name: string): {
  preset: ThemePresetName;
  mode: 'light' | 'dark';
} {
  const lastUnderscore = name.lastIndexOf('_');
  const mode = name.slice(lastUnderscore + 1) as 'light' | 'dark';
  const preset = name.slice(0, lastUnderscore) as ThemePresetName;
  return { preset, mode };
}

export function buildAllThemes() {
  const themes: Record<string, ReturnType<typeof buildAppTheme>> = {};

  for (const preset of THEME_PRESET_NAMES) {
    themes[compositeThemeName(preset, 'light')] = appThemes.light;
    themes[compositeThemeName(preset, 'dark')] = appThemes.dark;
  }

  return themes;
}

export const THEME_PRESET_NAMES: ThemePresetName[] = ['default'];

export const THEME_METADATA: Record<
  ThemePresetName,
  { name: string; description: string; baseColor: string }
> = {
  default: {
    name: 'Default',
    description: 'Modern indigo theme',
    baseColor: '#6366F1',
  },
};

export { lightColors } from './light-theme';
export { default as darkColors } from './dark-theme';

export type { ThemeColors } from './types';
