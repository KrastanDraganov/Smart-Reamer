import { useWindowDimensions } from 'react-native';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

const BREAKPOINTS = {
  sm: 0,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  return 'sm';
}

export function useScreenDimensions() {
  const { width, height } = useWindowDimensions();
  const breakpoint = getBreakpoint(width);

  return {
    width,
    height,
    isPortrait: height >= width,
    isLandscape: width > height,
    breakpoint,
    isTablet: width >= BREAKPOINTS.md,
  };
}
