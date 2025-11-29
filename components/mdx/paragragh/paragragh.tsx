'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Children } from 'react';

export interface MdxParagraphProps extends ComponentPropsWithoutRef<'p'> {}

/**
 * children内の文字列の改行を<br />に変換する
 */
function processChildren(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === 'string') {
      const lines = child.split('\n');
      if (lines.length === 1) {
        return child;
      }
      const result: ReactNode[] = [];
      for (let i = 0; i < lines.length; i++) {
        if (lines[i]) {
          result.push(lines[i]);
        }
        if (i < lines.length - 1) {
          result.push(<br key={`br-${i}-${lines[i]?.slice(0, 10) ?? ''}`} />);
        }
      }
      return result;
    }
    return child;
  });
}

export function MdxParagraph({ className = '', children, ...props }: MdxParagraphProps) {
  return (
    <p
      className={`text-md text-gray-700 dark:text-gray-400 font-mono leading-relaxed ${className}`}
      {...props}
    >
      {processChildren(children)}
    </p>
  );
}
