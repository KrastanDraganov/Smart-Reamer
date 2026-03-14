export interface BrandColors {
  primary: string;
  secondary: string;
  tertiary: string;
  primaryVariant: string;
  secondaryVariant: string;
}

export interface BackgroundColors {
  app: string;
  surface: string;
  surfaceAlt: string;
  section: string;
  elevated: string;
  input: string;
  disabled: string;
  modal: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  tertiary: string;
  muted: string;
  inverse: string;
  accent: string;
  link: string;
  linkHover: string;
}

export interface BorderColors {
  default: string;
  subtle: string;
  strong: string;
  focus: string;
  disabled: string;
}

export interface IconColors {
  primary: string;
  secondary: string;
  tertiary: string;
  muted: string;
  inverse: string;
  accent: string;
}

export interface StateColors {
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  error: string;
  errorBg: string;
  info: string;
  infoBg: string;
  disabled: string;
}

export interface OverlayColors {
  modal: string;
  pressed: string;
  hover: string;
  focus: string;
  ripple: string;
  shadow: string;
}

export interface GradientColors {
  primary: [string, string];
  secondary: [string, string];
  accent: [string, string];
  success: [string, string];
  highlight: [string, string];
}

export interface ShadowConfig {
  color: string;
  elevation: number;
  elevationSmall: number;
  elevationMedium: number;
  elevationLarge: number;
}

export interface ThemeColors {
  mode: 'light' | 'dark';
  brand: BrandColors;
  background: BackgroundColors;
  text: TextColors;
  border: BorderColors;
  icon: IconColors;
  state: StateColors;
  overlay: OverlayColors;
  gradient: GradientColors;
  shadow: ShadowConfig;
}
