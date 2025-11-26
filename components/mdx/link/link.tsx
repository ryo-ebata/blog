'use client';

import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

export interface MdxLinkProps extends ComponentPropsWithoutRef<'a'> {
  href: string;
}

export function MdxLink({ href, className, ...props }: MdxLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200',
        className
      )}
      {...props}
    />
  );
}
