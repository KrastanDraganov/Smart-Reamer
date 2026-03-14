import type { TextProps as RNTextProps } from 'react-native';

/** Typography variant controlling font size and line height. */
export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'overline';

/** Font weight options for text rendering. */
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

/** Horizontal text alignment options. */
export type TextAlign = 'left' | 'center' | 'right';

/** Semantic color tokens available for text. */
export type TextColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'muted'
  | 'inverse'
  | 'accent'
  | 'link';

/** Props for the {@link Text} component. */
export interface TextProps extends RNTextProps {
  /** Typography variant. Defaults to `'body'`. */
  variant?: TextVariant;
  /** Font weight override. */
  weight?: TextWeight;
  /** Semantic text color. */
  color?: TextColor;
  /** Horizontal text alignment. */
  align?: TextAlign;
  /** Content to render inside the text element. */
  children: React.ReactNode;
}
