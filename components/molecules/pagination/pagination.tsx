'use client';

import Link from 'next/link';
import { Button } from '@/components/atoms/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

function getPageUrl(basePath: string, page: number): string {
  return page === 1 ? basePath : `${basePath}?page=${page}`;
}

function shouldShowPage(page: number, currentPage: number, totalPages: number): boolean {
  return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
}

function shouldShowEllipsis(page: number, currentPage: number): boolean {
  return page === currentPage - 2 || page === currentPage + 2;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="ページネーション">
      {currentPage > 1 && (
        <Button variant="outline" render={<Link href={getPageUrl(basePath, currentPage - 1)} />}>
          前へ
        </Button>
      )}

      <div className="flex items-center gap-1">
        {pages.map((page) => {
          if (shouldShowPage(page, currentPage, totalPages)) {
            return (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                render={<Link href={getPageUrl(basePath, page)} />}
              >
                {page}
              </Button>
            );
          }
          if (shouldShowEllipsis(page, currentPage)) {
            return <span key={page}>...</span>;
          }
          return null;
        })}
      </div>

      {currentPage < totalPages && (
        <Button variant="outline" render={<Link href={getPageUrl(basePath, currentPage + 1)} />}>
          次へ
        </Button>
      )}
    </nav>
  );
}
