/* oxlint-disable no-magic-numbers -- 見出しレベル1-6は明確なため許容 */
import type { ReactElement } from 'react';

import type { HeadingLevel, MdxHeadingProps } from './types';
import { HeadingAnchor } from './heading-anchor';

import './mdx-heading.css';

const HEADING_STYLES: Record<HeadingLevel, string> = {
  1: 'text-3xl font-bold mt-8 mb-4 border-b pb-2 border-dashed',
  2: 'text-2xl font-bold mt-8 mb-3 border-b pb-2 border-dashed',
  3: 'text-xl font-semibold mt-6 mb-2',
  4: 'text-lg font-semibold mt-4 mb-2',
  5: 'text-base font-semibold mt-4 mb-1',
  6: 'text-sm font-semibold mt-4 mb-1 text-muted-foreground',
};

export const MdxHeading = ({ children, id, level }: MdxHeadingProps): ReactElement => {
  const Tag = `h${level}` as const;
  const hashPrefix = '#'.repeat(level);

  return (
    <Tag className={`mdx-heading group ${HEADING_STYLES[level]}`} id={id}>
      <span className="mdx-heading-hash">{hashPrefix}</span>
      <span>{children}</span>
      {id && <HeadingAnchor id={id} />}
    </Tag>
  );
};

const createHeadingComponent = (level: HeadingLevel) => {
  const HeadingComponent = ({ children, id }: Omit<MdxHeadingProps, 'level'>): ReactElement => (
    <MdxHeading id={id} level={level}>
      {children}
    </MdxHeading>
  );
  HeadingComponent.displayName = `MdxH${level}`;
  return HeadingComponent;
};

export const MdxH1 = createHeadingComponent(1);
export const MdxH2 = createHeadingComponent(2);
export const MdxH3 = createHeadingComponent(3);
export const MdxH4 = createHeadingComponent(4);
export const MdxH5 = createHeadingComponent(5);
export const MdxH6 = createHeadingComponent(6);
