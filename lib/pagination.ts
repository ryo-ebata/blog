const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export interface PaginationResult<TItem> {
  currentPage: number;
  items: TItem[];
  totalItems: number;
  totalPages: number;
}

export const paginateItems = <TItem>(
  items: TItem[],
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE
): PaginationResult<TItem> => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.max(DEFAULT_PAGE, Math.min(page, totalPages));

  const startIndex = (currentPage - DEFAULT_PAGE) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return {
    currentPage,
    items: items.slice(startIndex, endIndex),
    totalItems,
    totalPages,
  };
};
