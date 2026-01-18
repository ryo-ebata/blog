import type { MdxBlockquoteProps } from './types';

import './mdx-blockquote.css';

export const MdxBlockquote = ({ children, className = '' }: MdxBlockquoteProps) => (
  <blockquote className={`mdx-blockquote ${className}`.trim()}>{children}</blockquote>
);
