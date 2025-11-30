'use client';

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface LinkCardProps extends ComponentPropsWithoutRef<'a'> {
  href: string;
  children?: ReactNode;
  isExternal?: boolean;
  title?: string;
  description?: string;
  image?: string;
  icon?: string;
}

export function LinkCard({
  href,
  children,
  className,
  isExternal = false,
  title,
  description,
  image,
  icon,
  ...props
}: LinkCardProps) {
  const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  // メタデータがある場合は、それを使用してリンクカードを表示
  if (title) {
    return (
      <Link
        href={href}
        className={cn(
          'block border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden',
          'hover:border-blue-500 dark:hover:border-blue-400',
          'hover:bg-blue-50 dark:hover:bg-blue-950/20',
          'transition-colors duration-200',
          'group',
          className
        )}
        {...linkProps}
        {...props}
      >
        <div className="flex gap-4">
          {image && (
            <div className="relative w-[120px] h-[120px] min-w-[120px] shrink-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Image
                src={image}
                alt={title}
                fill
                className="object-contain p-2"
                sizes="120px"
                unoptimized
              />
            </div>
          )}
          <div className="flex-1 min-w-0 p-4">
            <div className="flex items-start gap-2 mb-2">
              {icon && (
                <Image
                  src={icon}
                  alt=""
                  width={16}
                  height={16}
                  className="shrink-0 mt-0.5"
                  unoptimized
                />
              )}
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                {title}
              </h3>
            </div>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                {description}
              </p>
            )}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-500 truncate">{href}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // メタデータがない場合は、従来の表示
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
