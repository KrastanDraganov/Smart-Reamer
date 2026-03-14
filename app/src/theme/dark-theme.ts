import type { ThemeColors } from './types';

/**
 * Dark Theme
 *
 * A deep, comfortable dark theme optimized for reduced eye strain.
 *
 * Color Philosophy:
 * - Primary: Bright Indigo (#818CF8) - vibrant in darkness
 * - Secondary: Light Slate (#CBD5E1) - soft readable accents
 * - Tertiary: Bright Teal (#2DD4BF) - lively accent against dark
 */
export const darkColors: ThemeColors = {
  mode: 'dark',

  brand: {
    primary: '#818CF8',
    secondary: '#CBD5E1',
    tertiary: '#2DD4BF',
    primaryVariant: '#A5B4FC',
    secondaryVariant: '#E2E8F0',
  },

  background: {
    app: '#0F172A',
    surface: '#192236',
    surfaceAlt: '#262F44',
    section: '#1E293B',
    elevated: '#253348',
    input: '#1F2B3D',
    disabled: '#172035',
    modal: '#1E293B',
  },

  text: {
    primary: '#F1F5F9',
    secondary: '#CBD5E1',
    tertiary: '#94A3B8',
    muted: '#64748B',
    inverse: '#0F172A',
    accent: '#2DD4BF',
    link: '#818CF8',
    linkHover: '#A5B4FC',
  },

  border: {
    default: '#2C3548',
    subtle: '#192236',
    strong: '#3D4A5E',
    focus: '#818CF8',
    disabled: '#172035',
  },

  icon: {
    primary: '#818CF8',
    secondary: '#CBD5E1',
    tertiary: '#64748B',
    muted: '#475569',
    inverse: '#0F172A',
    accent: '#2DD4BF',
  },

  state: {
    success: 'rgba(52, 211, 153, 0.8)',
    successBg: 'rgba(16, 185, 129, 0.15)',
    warning: '#FBBF24',
    warningBg: 'rgba(251, 191, 36, 0.2)',
    error: '#F87171',
    errorBg: 'rgba(248, 113, 113, 0.2)',
    info: '#60A5FA',
    infoBg: 'rgba(96, 165, 250, 0.2)',
    disabled: '#475569',
  },

  overlay: {
    modal: 'rgba(0, 0, 0, 0.7)',
    pressed: 'rgba(129, 140, 248, 0.15)',
    hover: 'rgba(129, 140, 248, 0.08)',
    focus: 'rgba(129, 140, 248, 0.2)',
    ripple: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },

  gradient: {
    primary: ['#1E293B', '#818CF8'],
    secondary: ['#818CF8', '#A5B4FC'],
    accent: ['#0F766E', '#2DD4BF'],
    success: ['#059669', '#34D399'],
    highlight: ['#6D28D9', '#A78BFA'],
  },

  shadow: {
    color: 'rgba(0, 0, 0, 0.5)',
    elevation: 6,
    elevationSmall: 2,
    elevationMedium: 6,
    elevationLarge: 12,
  },
};

export default darkColors;
