'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LinkCard } from './link-card';

export interface MdxLinkProps extends ComponentPropsWithoutRef<'a'> {
  href: string;
  children?: ReactNode;
}

/**
 * 内部リンクか外部リンクかを判定する
 */
function isExternalLink(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');
}

/**
 * 内部リンクかどうかを判定する
 */
function isInternalLink(href: string): boolean {
  return href.startsWith('/') || href.startsWith('#');
}

/**
 * インラインかブロックかを判定する
 * childrenが単純なテキストの場合はインライン、それ以外はブロック
 */
function isInlineLink(children: ReactNode): boolean {
  if (typeof children === 'string') {
    return true;
  }
  if (Array.isArray(children)) {
    return children.every((child) => typeof child === 'string');
  }
  return false;
}

export function MdxLink({ href, className, children, ...props }: MdxLinkProps) {
  const isExternal = isExternalLink(href);
  const isInternal = isInternalLink(href);
  const isInline = isInlineLink(children);

  // ブロックリンク（インラインではない）の場合、リンクカードを使用
  if (!isInline) {
    return (
      <LinkCard href={href} className={className} isExternal={isExternal} {...props}>
        {children}
      </LinkCard>
    );
  }

  // インラインリンクの場合
  if (isInternal) {
    // インラインの内部リンクは普通のaタグ（Next.jsのLinkを使用）
    return (
      <Link
        href={href}
        className={cn(
          'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200',
          className
        )}
        {...props}
      >
        {children}
      </Link>
    );
  }

  // インラインの外部リンクは普通のaタグで最後に外部で開くことを示すアイコン、target=_blank
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200',
        className
      )}
      {...props}
    >
      {children}
      <ArrowUpRight className="w-3 h-3 shrink-0" />
    </a>
  );
}
