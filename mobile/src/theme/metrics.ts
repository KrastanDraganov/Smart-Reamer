import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export interface Metrics {
  screenWidth: number;
  screenHeight: number;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  pixelDensity: number;
}

const metrics: Metrics = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isXs: SCREEN_WIDTH >= breakpoints.xs && SCREEN_WIDTH < breakpoints.sm,
  isSm: SCREEN_WIDTH >= breakpoints.sm && SCREEN_WIDTH < breakpoints.md,
  isMd: SCREEN_WIDTH >= breakpoints.md && SCREEN_WIDTH < breakpoints.lg,
  isLg: SCREEN_WIDTH >= breakpoints.lg && SCREEN_WIDTH < breakpoints.xl,
  isXl: SCREEN_WIDTH >= breakpoints.xl,
  pixelDensity: PixelRatio.get(),
};

export function rf(fontSize: number): number {
  const scaleFactor = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(fontSize * scaleFactor);
}

export function hs(size: number): number {
  const scaleFactor = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(size * scaleFactor);
}

export function vs(size: number): number {
  const scaleFactor = SCREEN_HEIGHT / BASE_HEIGHT;
  return Math.round(size * scaleFactor);
}

export function responsiveWidth(width: number | string): number {
  if (typeof width === 'string' && width.includes('%')) {
    const percentage = parseFloat(width) / 100;
    return Math.round(SCREEN_WIDTH * percentage);
  }
  return hs(width as number);
}

export function responsiveHeight(height: number | string): number {
  if (typeof height === 'string' && height.includes('%')) {
    const percentage = parseFloat(height) / 100;
    return Math.round(SCREEN_HEIGHT * percentage);
  }
  return vs(height as number);
}

export const spacing = {
  p4: hs(4),
  p8: hs(8),
  p12: hs(12),
  p16: hs(16),
  p20: hs(20),
  p24: hs(24),
  p28: hs(28),
  p32: hs(32),
  p36: hs(36),
  p40: hs(40),
  p44: hs(44),
  p48: hs(48),
  p52: hs(52),
  p56: hs(56),
  p60: hs(60),
  p64: hs(64),
  p68: hs(68),
  p72: hs(72),
  p76: hs(76),
  p80: hs(80),
  p84: hs(84),
  p88: hs(88),
  p92: hs(92),
  p96: hs(96),
  p100: hs(100),
  p104: hs(104),
  p108: hs(108),
  p112: hs(112),
  p116: hs(116),
  p120: hs(120),
};

export const spacingV = {
  p4: vs(4),
  p8: vs(8),
  p12: vs(12),
  p16: vs(16),
  p20: vs(20),
  p24: vs(24),
  p28: vs(28),
  p32: vs(32),
  p36: vs(36),
  p40: vs(40),
  p44: vs(44),
  p48: vs(48),
  p52: vs(52),
  p56: vs(56),
  p60: vs(60),
  p64: vs(64),
  p68: vs(68),
  p72: vs(72),
  p76: vs(76),
  p80: vs(80),
  p84: vs(84),
  p88: vs(88),
  p92: vs(92),
  p96: vs(96),
  p100: vs(100),
  p104: vs(104),
  p108: vs(108),
  p112: vs(112),
  p116: vs(116),
  p120: vs(120),
};

export const fontSize = {
  xxs: rf(10),
  xs: rf(12),
  sm: rf(14),
  md: rf(16),
  lg: rf(18),
  xl: rf(20),
  '2xl': rf(24),
  '3xl': rf(30),
  '4xl': rf(36),
  '5xl': rf(48),
  '6xl': rf(60),
};

Dimensions.addEventListener('change', () => {
  const { width, height } = Dimensions.get('window');
  metrics.screenWidth = width;
  metrics.screenHeight = height;
  metrics.isXs = width >= breakpoints.xs && width < breakpoints.sm;
  metrics.isSm = width >= breakpoints.sm && width < breakpoints.md;
  metrics.isMd = width >= breakpoints.md && width < breakpoints.lg;
  metrics.isLg = width >= breakpoints.lg && width < breakpoints.xl;
  metrics.isXl = width >= breakpoints.xl;
});

export const borderRadius = {
  xs: hs(4),
  sm: hs(6),
  md: hs(8),
  lg: hs(12),
  xl: hs(16),
  full: 999,
};

export const iconSize = {
  xs: hs(14),
  sm: hs(16),
  md: hs(18),
  lg: hs(20),
  xl: hs(24),
};

export default {
  spacing,
  spacingV,
  fontSize,
  borderRadius,
  iconSize,
};
