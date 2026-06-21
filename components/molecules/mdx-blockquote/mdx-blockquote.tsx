import { cn } from '@/lib/utils';

import type { MdxBlockquoteProps } from './types';

export const MdxBlockquote = ({ children, className = '' }: MdxBlockquoteProps) => (
  <blockquote
    className={cn(
      // 引用ブロック: 左ボーダー + ミュート文字 + italic。prose と調和。
      'my-6 rounded-r-lg border-l-2 border-primary/40 bg-muted/30 py-2 pl-4 italic text-muted-foreground',
      '[&_p]:my-0',
      className
    )}
  >
    {children}
  </blockquote>
);
