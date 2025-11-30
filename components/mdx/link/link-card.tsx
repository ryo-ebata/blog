'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface LinkCardProps extends ComponentPropsWithoutRef<'a'> {
  href: string;
  children: ReactNode;
  isExternal?: boolean;
}

export function LinkCard({
  href,
  children,
  className,
  isExternal = false,
  ...props
}: LinkCardProps) {
  const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Link
      href={href}
      className={cn(
        'block p-4 border border-gray-300 dark:border-gray-700 rounded-lg',
        'hover:border-blue-500 dark:hover:border-blue-400',
        'hover:bg-blue-50 dark:hover:bg-blue-950/20',
        'transition-colors duration-200',
        'group',
        className
      )}
      {...linkProps}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors duration-200">
          {children}
        </span>
        {isExternal && (
          <ArrowUpRight className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
        )}
      </div>
    </Link>
  );
}
