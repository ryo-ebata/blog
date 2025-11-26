'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return basePath;
    }
    return `${basePath}/page/${page}`;
  };

  return (
    <nav className="flex items-center justify-center gap-2 mt-8">
      {currentPage > 1 && (
        <Button variant="outline" asChild>
          <Link href={getPageUrl(currentPage - 1)}>前へ</Link>
        </Button>
      )}

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <Button key={page} variant={currentPage === page ? 'default' : 'outline'} asChild>
                <Link href={getPageUrl(page)}>{page}</Link>
              </Button>
            );
          } else if (page === currentPage - 2 || page === currentPage + 2) {
            return <span key={page}>...</span>;
          }
          return null;
        })}
      </div>

      {currentPage < totalPages && (
        <Button variant="outline" asChild>
          <Link href={getPageUrl(currentPage + 1)}>次へ</Link>
        </Button>
      )}
    </nav>
  );
}
