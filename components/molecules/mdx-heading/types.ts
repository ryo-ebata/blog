/* oxlint-disable no-magic-numbers -- 見出しレベル1-6は型リテラルのため許容 */
import type { ReactNode } from 'react';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface MdxHeadingProps {
  children: ReactNode;
  id?: string;
  level: HeadingLevel;
}
