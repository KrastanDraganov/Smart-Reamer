import type { ThemeColors } from './types';

/**
 * Dark Theme — Smart Lock
 *
 * Palette derived from: #EDEEC9, #DDE7C7, #BFD8BD, #98C9A3, #77BFA3
 *
 * Color Philosophy:
 * - Primary: Bright Sage (#98C9A3) - vibrant in darkness
 * - Secondary: Pale Green (#C4D9C0) - soft readable accents
 * - Tertiary: Mint (#A8D8B9) - lively accent against dark
 */
export const darkColors: ThemeColors = {
  mode: 'dark',

  brand: {
    primary: '#98C9A3',
    secondary: '#C4D9C0',
    tertiary: '#A8D8B9',
    primaryVariant: '#BFD8BD',
    secondaryVariant: '#DDE7C7',
  },

  background: {
    app: '#121A16',
    surface: '#1A2620',
    surfaceAlt: '#22302A',
    section: '#1E2B24',
    elevated: '#263530',
    input: '#1E2B24',
    disabled: '#192219',
    modal: '#1E2B24',
  },

  text: {
    primary: '#EDF2EE',
    secondary: '#C4D9C0',
    tertiary: '#8A9A90',
    muted: '#5C6E64',
    inverse: '#121A16',
    accent: '#A8D8B9',
    link: '#98C9A3',
    linkHover: '#BFD8BD',
  },

  border: {
    default: '#2A3D32',
    subtle: '#1A2620',
    strong: '#3A5244',
    focus: '#98C9A3',
    disabled: '#192219',
  },

  icon: {
    primary: '#98C9A3',
    secondary: '#C4D9C0',
    tertiary: '#5C6E64',
    muted: '#3E5245',
    inverse: '#121A16',
    accent: '#A8D8B9',
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
    disabled: '#3E5245',
  },

  overlay: {
    modal: 'rgba(0, 0, 0, 0.7)',
    pressed: 'rgba(152, 201, 163, 0.15)',
    hover: 'rgba(152, 201, 163, 0.08)',
    focus: 'rgba(152, 201, 163, 0.2)',
    ripple: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },

  gradient: {
    primary: ['#1E2B24', '#98C9A3'],
    secondary: ['#98C9A3', '#BFD8BD'],
    accent: ['#5EA88C', '#A8D8B9'],
    success: ['#059669', '#34D399'],
    highlight: ['#BFD8BD', '#EDEEC9'],
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
