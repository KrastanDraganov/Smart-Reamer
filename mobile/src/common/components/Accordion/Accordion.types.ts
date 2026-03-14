import type { ReactNode } from 'react';

/** Represents a single expandable section within an Accordion. */
export interface AccordionItem {
  /** Unique identifier for this accordion section. */
  id: string;
  /** Header text displayed in the section trigger. */
  title: string;
  /** Content rendered when the section is expanded. */
  content: ReactNode;
  /** Whether this section is disabled and cannot be toggled. Defaults to `false`. */
  disabled?: boolean;
}

/** Props for the {@link Accordion} component. */
export interface AccordionProps {
  /** Array of accordion sections to render. */
  items: AccordionItem[];
  /** Whether multiple sections can be expanded simultaneously. Defaults to `false`. */
  multiple?: boolean;
  /** Array of item IDs that should be expanded on initial render. Defaults to `[]`. */
  defaultExpanded?: string[];
}
