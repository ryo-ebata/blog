'use client';

import type { ComponentPropsWithoutRef } from 'react';

export interface MdxHeadingProps extends ComponentPropsWithoutRef<'h1'> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function MdxHeading({
  as: Component = 'h1',
  className = '',
  children,
  ...props
}: MdxHeadingProps) {
  const baseClasses = 'font-bold font-mono text-terminal-green dark:text-terminal-green';
  const sizeClasses = {
    h1: 'scroll-m-20 text-3xl terminal-glow',
    h2: 'scroll-m-20 border-b-2 border-terminal-border pb-2 text-2xl font-semibold tracking-tight first:mt-0 mt-6',
    h3: 'scroll-m-20 text-xl mt-5 mb-2 text-terminal-cyan',
    h4: 'scroll-m-20 text-lg mt-4 mb-2 text-terminal-cyan',
    h5: 'scroll-m-20 text-base mt-3 mb-1 text-terminal-cyan',
    h6: 'scroll-m-20 text-md mt-2 mb-1 text-terminal-cyan',
  };

  return (
    <Component className={`${baseClasses} ${sizeClasses[Component]} ${className}`} {...props}>
      {children}
    </Component>
  );
}
