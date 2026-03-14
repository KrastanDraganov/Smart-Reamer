/** Props for the {@link Divider} component. */
export interface DividerProps {
  /** Direction of the divider line. Defaults to `'horizontal'`. */
  orientation?: 'horizontal' | 'vertical';
  /** Whether to render a thicker divider. Defaults to `false`. */
  bold?: boolean;
  /** Whether to add horizontal inset (margin) to the divider. Defaults to `false`. */
  inset?: boolean;
}
