'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import type { TocItem } from '@/lib/blog-content/extract-toc';

interface TableOfContentsProps {
  items: TocItem[];
}

/**
 * 記事の見出し(h2/h3)から生成する目次。
 * 折りたたみ可能(details)で、スクロール位置に応じて現在のセクションをハイライトする。
 */
export const TableOfContents = ({ items }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) {
    return null;
  }

  return (
    <details
      open
      className="not-prose group mb-8 overflow-hidden rounded-xl bg-card text-card-foreground shadow-xs ring-1 ring-foreground/10"
    >
      <summary className="flex cursor-pointer list-none select-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium">
        目次
        <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <nav aria-label="目次" className="px-2 pb-3">
        <ul className="space-y-0.5 text-sm">
          {items.map((item) => (
            <li key={item.id} className={cn(item.depth === 3 && 'ml-4')}>
              <a
                href={`#${item.id}`}
                className={cn(
                  'block rounded-md px-2 py-1 transition-colors hover:bg-muted hover:text-foreground',
                  activeId === item.id ? 'font-medium text-primary' : 'text-muted-foreground'
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
};
