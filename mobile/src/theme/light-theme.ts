import type { ThemeColors } from './types';

/**
 * Light Theme — Smart Lock
 *
 * Palette: #EDEEC9, #DDE7C7, #BFD8BD, #98C9A3, #77BFA3
 *
 * Color Philosophy:
 * - Primary: Sage Teal (#77BFA3) - calm, trustworthy
 * - Secondary: Dark Green-Charcoal (#2D3A33) - strong readable headings
 * - Tertiary: Medium Green (#98C9A3) - fresh accent
 */
export const lightColors: ThemeColors = {
  mode: 'light',

  brand: {
    primary: '#77BFA3',
    secondary: '#2D3A33',
    tertiary: '#98C9A3',
    primaryVariant: '#5EA88C',
    secondaryVariant: '#3E4F46',
  },

  background: {
    app: '#F7F8F0',
    surface: '#FFFFFF',
    surfaceAlt: '#EDEEC9',
    section: '#DDE7C7',
    elevated: '#F2F5EC',
    input: '#EFF1E6',
    disabled: '#D8DDD0',
    modal: '#FFFFFF',
  },

  text: {
    primary: '#1A2421',
    secondary: '#2D3A33',
    tertiary: '#5C6E64',
    muted: '#8A9A90',
    inverse: '#FFFFFF',
    accent: '#5EA88C',
    link: '#77BFA3',
    linkHover: '#5EA88C',
  },

  border: {
    default: '#D1DCCF',
    subtle: '#E4EAD8',
    strong: '#BFD8BD',
    focus: '#77BFA3',
    disabled: '#D8DDD0',
  },

  icon: {
    primary: '#77BFA3',
    secondary: '#2D3A33',
    tertiary: '#8A9A90',
    muted: '#BCC8BA',
    inverse: '#FFFFFF',
    accent: '#98C9A3',
  },

  state: {
    success: '#10B981',
    successBg: '#ECFDF5',
    warning: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.12)',
    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.12)',
    info: '#3B82F6',
    infoBg: 'rgba(59, 130, 246, 0.12)',
    disabled: '#BCC8BA',
  },

  overlay: {
    modal: 'rgba(0, 0, 0, 0.5)',
    pressed: 'rgba(119, 191, 163, 0.15)',
    hover: 'rgba(119, 191, 163, 0.08)',
    focus: 'rgba(119, 191, 163, 0.18)',
    ripple: 'rgba(255, 255, 255, 0.25)',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },

  gradient: {
    primary: ['#5EA88C', '#77BFA3'],
    secondary: ['#77BFA3', '#98C9A3'],
    accent: ['#77BFA3', '#98C9A3'],
    success: ['#059669', '#34D399'],
    highlight: ['#BFD8BD', '#DDE7C7'],
  },

  shadow: {
    color: 'rgba(0, 0, 0, 0.08)',
    elevation: 4,
    elevationSmall: 2,
    elevationMedium: 4,
    elevationLarge: 8,
  },
};

export default lightColors;
