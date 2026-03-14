import type { ThemeColors } from './types';

/**
 * Light Theme
 *
 * A clean, professional light theme with a modern color palette.
 *
 * Color Philosophy:
 * - Primary: Indigo (#6366F1) - trustworthy, modern
 * - Secondary: Deep Slate (#1E293B) - strong readable headings
 * - Tertiary: Teal (#14B8A6) - fresh, versatile accent
 */
export const lightColors: ThemeColors = {
  mode: 'light',

  brand: {
    primary: '#6366F1',
    secondary: '#1E293B',
    tertiary: '#14B8A6',
    primaryVariant: '#4F46E5',
    secondaryVariant: '#334155',
  },

  background: {
    app: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F5F9',
    section: '#EEF2FF',
    elevated: '#F8FAFF',
    input: '#F1F5F9',
    disabled: '#E2E8F0',
    modal: '#FFFFFF',
  },

  text: {
    primary: '#0F172A',
    secondary: '#334155',
    tertiary: '#64748B',
    muted: '#94A3B8',
    inverse: '#FFFFFF',
    accent: '#14B8A6',
    link: '#6366F1',
    linkHover: '#4F46E5',
  },

  border: {
    default: '#E2E8F0',
    subtle: '#F1F5F9',
    strong: '#CBD5E1',
    focus: '#6366F1',
    disabled: '#E2E8F0',
  },

  icon: {
    primary: '#6366F1',
    secondary: '#1E293B',
    tertiary: '#94A3B8',
    muted: '#CBD5E1',
    inverse: '#FFFFFF',
    accent: '#14B8A6',
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
    disabled: '#CBD5E1',
  },

  overlay: {
    modal: 'rgba(0, 0, 0, 0.5)',
    pressed: 'rgba(99, 102, 241, 0.12)',
    hover: 'rgba(99, 102, 241, 0.08)',
    focus: 'rgba(99, 102, 241, 0.15)',
    ripple: 'rgba(255, 255, 255, 0.25)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },

  gradient: {
    primary: ['#4F46E5', '#6366F1'],
    secondary: ['#6366F1', '#818CF8'],
    accent: ['#0D9488', '#14B8A6'],
    success: ['#059669', '#34D399'],
    highlight: ['#7C3AED', '#A78BFA'],
  },

  shadow: {
    color: 'rgba(0, 0, 0, 0.1)',
    elevation: 4,
    elevationSmall: 2,
    elevationMedium: 4,
    elevationLarge: 8,
  },
};

export default lightColors;
