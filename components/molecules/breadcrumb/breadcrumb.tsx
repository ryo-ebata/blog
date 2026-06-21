import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

/**
 * 視覚的パンくずリスト。最後の項目を現在地として強調し、それ以外はリンクにする。
 * BreadcrumbList 構造化データ(lib/jsonld の generateBreadcrumbJsonLd)と表示を揃える。
 */
export const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => (
  <nav aria-label="パンくずリスト" className="not-prose">
    <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={item.name} className="flex min-w-0 items-center gap-1.5">
            {item.href && !isLast ? (
              <Link href={item.href} className="transition-colors hover:text-foreground">
                {item.name}
              </Link>
            ) : (
              <span
                className={cn('truncate', isLast && 'text-foreground')}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.name}
              </span>
            )}
            {!isLast && <ChevronRight aria-hidden className="size-3.5 shrink-0" />}
          </li>
        );
      })}
    </ol>
  </nav>
);
