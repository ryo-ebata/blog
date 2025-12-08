'use client';

import type { ComponentPropsWithoutRef } from 'react';

export interface MdxBlockquoteProps extends ComponentPropsWithoutRef<'blockquote'> {}

export function MdxBlockquote({ className = '', children, ...props }: MdxBlockquoteProps) {
  return (
    <blockquote
      className={`my-6 border-l-4 border-terminal-border pl-6 italic text-gray-600 dark:text-gray-400 font-mono ${className}`}
      {...props}
    >
      {children}
    </blockquote>
  );
}
