'use client';

import { Button } from '@/components/atoms/button';
import Link from 'next/link';

const FIRST_PAGE = 1;
const SINGLE_PAGE = 1;
const PAGE_OFFSET = 1;
const ELLIPSIS_OFFSET = 2;

interface PaginationProps {
  basePath: string;
  currentPage: number;
  totalPages: number;
}

const getPageUrl = (basePath: string, page: number): string => {
  if (page === FIRST_PAGE) {
    return basePath;
  }
  return `${basePath}?page=${page}`;
};

const shouldShowPage = (page: number, currentPage: number, totalPages: number): boolean => {
  const isFirstPage = page === FIRST_PAGE;
  const isLastPage = page === totalPages;
  const isNearCurrentPage = page >= currentPage - PAGE_OFFSET && page <= currentPage + PAGE_OFFSET;
  return isFirstPage || isLastPage || isNearCurrentPage;
};

const shouldShowEllipsis = (page: number, currentPage: number): boolean =>
  page === currentPage - ELLIPSIS_OFFSET || page === currentPage + ELLIPSIS_OFFSET;

const getPageVariant = (currentPage: number, page: number): 'default' | 'outline' => {
  if (currentPage === page) {
    return 'default';
  }
  return 'outline';
};

interface PageButtonProps {
  basePath: string;
  currentPage: number;
  page: number;
}

const PageButton = ({ basePath, currentPage, page }: PageButtonProps) => (
  <Button
    variant={getPageVariant(currentPage, page)}
    render={<Link href={getPageUrl(basePath, page)} />}
  >
    {page}
  </Button>
);

interface PaginationItemProps {
  basePath: string;
  currentPage: number;
  page: number;
  totalPages: number;
}

const PaginationItem = ({ basePath, currentPage, page, totalPages }: PaginationItemProps) => {
  if (shouldShowPage(page, currentPage, totalPages)) {
    return <PageButton key={page} basePath={basePath} currentPage={currentPage} page={page} />;
  }
  if (shouldShowEllipsis(page, currentPage)) {
    return <span key={page}>...</span>;
  }
  return null;
};

export const Pagination = ({ basePath, currentPage, totalPages }: PaginationProps) => {
  if (totalPages <= SINGLE_PAGE) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_unused, index) => index + PAGE_OFFSET);

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="ページネーション">
      {currentPage > FIRST_PAGE && (
        <Button
          variant="outline"
          render={<Link href={getPageUrl(basePath, currentPage - PAGE_OFFSET)} />}
        >
          前へ
        </Button>
      )}

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <PaginationItem
            key={page}
            basePath={basePath}
            currentPage={currentPage}
            page={page}
            totalPages={totalPages}
          />
        ))}
      </div>

      {currentPage < totalPages && (
        <Button
          variant="outline"
          render={<Link href={getPageUrl(basePath, currentPage + PAGE_OFFSET)} />}
        >
          次へ
        </Button>
      )}
    </nav>
  );
};
